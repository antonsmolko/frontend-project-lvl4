import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import {
	Modal,
	Button,
	Form,
	FloatingLabel,
} from 'react-bootstrap';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { vRules, vParams } from '../../yup';
import { toast } from 'react-toastify';

const generateOnSubmit = ({
	modalInfo,
	action,
	onHide,
	successMessage,
	errorMessage
}) => async (values, formikActions) => {
	const { validateField, setErrors } = formikActions;

	await validateField('name');

	const item = { id: modalInfo.item.id, name: values.name };

	const { status, errors } = await action(item);

	if (status === 'error') {
		toast.success(errorMessage);
		return setErrors({ name: errors });
	}

	toast.success(successMessage);

	onHide();
};

function RenameModal(props) {
	const { t } = useTranslation();
	const { show, onHide, modalInfo } = props;
	const successMessage = t('toasts.channel.success.rename');
	const errorMessage = t('toasts.channel.error.rename');
	const { id, name } = modalInfo.item;
	const f = useFormik({
		initialValues: { id, name },
		onSubmit: generateOnSubmit({ ...props, successMessage, errorMessage }),
		validateOnMount: false,
		validateOnChange: false,
		validateOnBlur: false,
		validationSchema: Yup.object({
			name: Yup.string()
				.required()
				.test({
					name: 'range',
					params: vParams.channelName.range,
					message: t('validation.range', vParams.channelName.range),
					test: vRules.string.range(vParams.channelName.range),
				}),
		}),
	});
	const inputRef = useRef();
	useEffect(() => {
		inputRef.current.select();
	}, []);

	return (
		<Modal centered show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>
					{t('modals.rename.title', { channel: modalInfo.item.name })}
				</Modal.Title>
			</Modal.Header>

			<Form onSubmit={f.handleSubmit}>
				<Modal.Body>
					<FloatingLabel
						controlId="name"
						label={t('form.label.name')}
						className="mb-3"
					>
						<Form.Control
							ref={inputRef}
							name="name"
							onChange={f.handleChange}
							onBlur={f.handleBlur}
							value={f.values.name}
							placeholder={t('form.label.name')}
							isInvalid={f.errors.name}
						/>
						<span className="invalid-tooltip">{f.errors.name}</span>
					</FloatingLabel>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" type="submit">{t('actions.rename')}</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
}

export default RenameModal;
