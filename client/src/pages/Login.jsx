import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import {
	Container,
	Button,
	Form,
	Card,
	Row,
	Col,
	Image,
	FloatingLabel,
} from 'react-bootstrap';
import { useLocation, useNavigate, Link } from 'react-router-dom';

import image from '../assets/images/login.jpg';

import * as Yup from 'yup';
import { vRules, vParams } from '../yup';
import { useAuth } from '../hooks';

function LoginPage() {
	const { t } = useTranslation();
	const location = useLocation();
	const navigate = useNavigate();
	const prevPath = location.state ? location.state.from.pathname : '/';
	const { login } = useAuth();

	const f = useFormik({
		initialValues: {
			username: '',
			password: '',
		},
		validateOnMount: false,
		validateOnChange: false,
		validateOnBlur: false,
		onSubmit: async (payload, formikActions) => {
			const { setErrors } = formikActions;

			try {
				await login(payload);
				navigate(prevPath);
			} catch (error) {
				setErrors(error);
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
							<Col xs={12} md={6} className="d-flex justify-content-center align-items-center">
								<Image roundedCircle src={image} alt={t('pages.login.title')} />
							</Col>
							<Col xs={12} md={6} className="mt-3 mt-mb-0">
								<h1 className="text-center mb-4">{t('pages.login.title')}</h1>
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
									<Form.Floating className="mb-4">
										<Button variant="outline-primary" className="w-100 mb-3" type="submit">
											{t('pages.login.submit')}
										</Button>
									</Form.Floating>
								</Form>
							</Col>
						</Card.Body>
						<Card.Footer className="p-4 text-center">
							{t('pages.login.link.question')}
							{' '}
							<Link to="/signup">{t('pages.login.link.answer')}</Link>
						</Card.Footer>
					</Card>
				</Col>
			</Row>
		</Container>
	);
}

export default LoginPage;
