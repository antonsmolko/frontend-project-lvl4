import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import React, { useEffect, useRef } from 'react';
import {
	Button,
	Card, Col,
	Container,
	FloatingLabel,
	Form,
	Image,
	Row,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import authApi from '../api/auth';
import { login } from '../features/auth/authSlice';

import image from '../assets/images/registration.jpg';
import { vRules, vParams } from '../yup';

function SignUpPage() {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const f = useFormik({
		initialValues: {
			username: '',
			password: '',
			passwordConfirmation: '',
		},
		validateOnMount: false,
		validateOnChange: false,
		validateOnBlur: false,
		onSubmit: async (payload, formikActions) => {
			const { setErrors } = formikActions;

			try {
				const { data } = await authApi.signup(payload);
				dispatch(login(data));
				navigate('/', { replace: true });
			} catch (error) {
				setErrors(error.response.data);
			}
		},
		validationSchema: Yup.object({
			username: Yup.string()
				.required()
				.matches(vRules.string.matches.alphaNum, t('validation.alphaNum'))
				.test({
					name: 'range',
					params: vParams.username.range,
					message: t('validation.range', vParams.username.range),
					test: vRules.string.range(vParams.username.range),
				}),
			password: Yup.string().required(),
			passwordConfirmation: Yup.string()
				.oneOf([Yup.ref('password'), null], t('validation.passwordConfirmation')),
		}),
	});

	const usernameRef = useRef();

	useEffect(() => {
		usernameRef.current.focus();
	}, []);

	return (
		<Container fluid className="h-100">
			<Row className="justify-content-center align-items-center h-100">
				<Col xs={12} md={8} xxl={6}>
					<Card className="shadow-sm">
						<Card.Body className="row p-5">
							<Row>
								<Col xs={12} md={6} className="d-flex justify-content-center align-items-center">
									<Image roundedCircle src={image} alt={t('pages.signUp.title')} />
								</Col>
								<Col xs={12} md={6} className="mt-3 mt-mb-0">
									<h1 className="text-center mb-4">{t('pages.signUp.title')}</h1>
									<Form onSubmit={f.handleSubmit}>
										<FloatingLabel
											controlId="username"
											label={t('form.label.username')}
											className="mb-3"
										>
											<Form.Control
												ref={usernameRef}
												name="username"
												onBlur={f.handleBlur}
												onChange={f.handleChange}
												value={f.values.username}
												placeholder={t('form.label.username')}
												isInvalid={f.errors.username}
											/>
											<span className="invalid-tooltip">{f.errors.username}</span>
										</FloatingLabel>
										<FloatingLabel
											controlId="password"
											label={t('form.label.password')}
											className="mb-3"
										>
											<Form.Control
												name="password"
												type="password"
												onBlur={f.handleBlur}
												onChange={f.handleChange}
												value={f.values.password}
												placeholder={t('form.label.password')}
												isInvalid={f.errors.password}
											/>
											<span className="invalid-tooltip">{f.errors.password}</span>
										</FloatingLabel>
										<FloatingLabel
											controlId="passwordConfirmation"
											label={t('form.label.passwordConfirmation')}
											className="mb-3"
										>
											<Form.Control
												name="passwordConfirmation"
												type="password"
												onBlur={f.handleBlur}
												onChange={f.handleChange}
												value={f.values.passwordConfirmation}
												placeholder={t('form.label.passwordConfirmation')}
												isInvalid={f.errors.passwordConfirmation}
											/>
											<span className="invalid-tooltip">{f.errors.passwordConfirmation}</span>
										</FloatingLabel>
										<Form.Floating className="mb-4">
											<Button variant="outline-primary" className="w-100 mb-3" type="submit">
												{t('pages.signUp.submit')}
											</Button>
										</Form.Floating>
									</Form>
								</Col>
							</Row>
						</Card.Body>
						<Card.Footer className="p-4 text-center">
							{t('pages.signUp.link.question')}
							{' '}
							<Link to="/login">{t('pages.signUp.link.answer')}</Link>
						</Card.Footer>
					</Card>
				</Col>
			</Row>
		</Container>
	);
}

export default SignUpPage;
