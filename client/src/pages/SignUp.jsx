import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import authApi from '../api/auth';
import { login } from '../features/auth/authSlice';
import React, { useEffect, useRef } from 'react';
import {
  Button,
  Card, Col,
  Container,
  FloatingLabel,
  Form,
  Image,
  Row
} from 'react-bootstrap';

import image from '../assets/images/registration.jpg'

const SignUpPage = () => {
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
      const { setErrors } = formikActions

      try {
        const { data } = await authApi.signup(payload)
        dispatch(login(data))
        navigate('/', { replace: true })
      } catch (error) {
        setErrors(error.response.data)
      }
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(2, 'Must be at least 2 characters')
        .max(30, 'Must be less  than 30 characters')
        .required('Username is required')
        .matches(
          /^[a-zA-Z0-9]+$/,
          'Cannot contain special characters or spaces'
        ),
      password: Yup.string()
        .required('Password is required'),
      passwordConfirmation: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
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
                <Image roundedCircle
                 src={image}
                 alt="Зарегистрироваться"
                />
              </Col>
              <Col xs={12} md={6} className="mt-3 mt-mb-0">
                <h1 className="text-center mb-4">Регистрация</h1>
                <Form onSubmit={f.handleSubmit}>
                  <FloatingLabel
                    controlId="username"
                    label="Ваш ник"
                    className="mb-3"
                  >
                    <Form.Control
                      ref={usernameRef}
                      name="username"
                      onBlur={f.handleBlur}
                      onChange={f.handleChange}
                      value={f.values.username}
                      placeholder="Ваш ник"
                      isInvalid={f.errors.username}
                    />
                    <span className="invalid-tooltip">{f.errors.username}</span>
                  </FloatingLabel>
                  <FloatingLabel controlId="password" label="Пароль" className="mb-3">
                    <Form.Control
                      name="password"
                      type="password"
                      onBlur={f.handleBlur}
                      onChange={f.handleChange}
                      value={f.values.password}
                      placeholder="Пароль"
                      isInvalid={f.errors.password}
                    />
                    <span className="invalid-tooltip">{f.errors.password}</span>
                  </FloatingLabel>
                  <FloatingLabel controlId="passwordConfirmation" label="Подтвердите пароль" className="mb-3">
                    <Form.Control
                      name="passwordConfirmation"
                      type="password"
                      onBlur={f.handleBlur}
                      onChange={f.handleChange}
                      value={f.values.passwordConfirmation}
                      placeholder="Подтвердите пароль"
                      isInvalid={f.errors.passwordConfirmation}
                    />
                    <span className="invalid-tooltip">{f.errors.passwordConfirmation}</span>
                  </FloatingLabel>
                  <Form.Floating className="mb-4">
                    <Button variant="outline-primary" className="w-100 mb-3" type="submit">Зарегистрироваться</Button>
                  </Form.Floating>
                </Form>
              </Col>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUpPage;
