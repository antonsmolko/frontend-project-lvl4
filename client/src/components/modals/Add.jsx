import React, { useEffect, useRef } from 'react'
import { useFormik } from 'formik'
import { Form, Modal, FormGroup, Button } from 'react-bootstrap'
import _ from 'lodash'

const generateOnSubmit = ({ onHide, action }) => async (values, formikActions) => {
  const { validateField, setErrors } = formikActions

  await validateField('name')

  const item = { name: values.name }

  const { status, errors } = await action(item)

  if (status === 'error') {
    return setErrors({ name: errors })
  }

  onHide();
};

const AddModal = (props) => {
  const { show, onHide } = props;
  const f = useFormik({
    onSubmit: generateOnSubmit(props),
    validate: (values) => {
      switch (true) {
        case !values.name:
          return { name: 'Обязательное поле' }
        case !_.inRange(values.name.length, 3, 21):
          return { name: 'От 3 до 20 символов' }
        default:
          return {}
      }
    },
    validateOnMount: false,
    validateOnChange: false,
    validateOnBlur: false,
    initialValues: { name: '' }
  });

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Modal centered show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add</Modal.Title>
      </Modal.Header>

      <Form onSubmit={f.handleSubmit}>
        <Modal.Body>
          <FormGroup>
            <Form.Label>Name</Form.Label>
            <Form.Control
              ref={inputRef}
              onChange={f.handleChange}
              onBlur={f.handleBlur}
              value={f.values.name}
              data-testid="input-body"
              name="name"
            />
            <span>{f.errors.name}</span>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit">Submit</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddModal;
