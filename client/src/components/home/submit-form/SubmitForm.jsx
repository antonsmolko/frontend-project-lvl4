import React, { useEffect, useRef } from 'react';
import { Field, Form, Formik } from 'formik';
import { InputGroup } from 'react-bootstrap';
import ButtonSubmit from './ButtonSubmit';
import filter from 'leo-profanity';
import { useTranslation } from 'react-i18next';

const SubmitForm = ({ username, room , submit }) => {
	const { t } = useTranslation();
	const inputRef = useRef(null);

	useEffect(() => {
		inputRef.current.focus();
	}, [inputRef, room, submit]);

	const handleSubmit = async (message, actions) => {
		if (!message.trim()) reject();

		filter.loadDictionary('ru');
		const text = filter.clean(message);

		const payload = { username, text, channel: room };

		await submit(payload);
		actions.resetForm();
	};

	return (
		<div className="border-top mt-auto py-3 px-5">
			<Formik
				initialValues={{ message: '' }}
				onSubmit={({ message }, actions) => handleSubmit(message, actions)}
			>
				<Form>
					<InputGroup>
						<Field name="message">
							{({ field, form: { isSubmitting } }) => (
								<input
									{...field}
									ref={inputRef}
									disabled={isSubmitting}
									type="text"
									placeholder={t('form.placeholder.message')}
									className="form-control border-0"
								/>
							)}
						</Field>
						<ButtonSubmit />
					</InputGroup>
				</Form>
			</Formik>
		</div>
	);
};

export default SubmitForm;
