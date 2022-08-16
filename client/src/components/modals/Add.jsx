import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import {
	Form,
	Modal,
	Button,
	FloatingLabel,
} from 'react-bootstrap';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { vRules, vParams } from '../../yup';

const generateOnSubmit = ({ onHide, action }) => async (values, formikActions) => {
	const { validateField, setErrors } = formikActions;

	await validateField('name');

	const item = { name: values.name };
	const { status, errors } = await action(item);

	if (status === 'error') {
		return setErrors({ name: errors });
	}

	onHide();
};

function AddModal(props) {
	const { t } = useTranslation();
	const { show, onHide } = props;
	const f = useFormik({
		onSubmit: generateOnSubmit(props),
		validateOnMount: false,
		validateOnChange: false,
		validateOnBlur: false,
		initialValues: { name: '' },
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
		inputRef.current.focus();
	}, []);

	return (
		<Modal centered show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>{t('modals.add.title')}</Modal.Title>
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
					<Button variant="primary" type="submit">{t('actions.add')}</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
}

export default AddModal;
