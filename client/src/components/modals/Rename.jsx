import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { Modal, FormGroup, FormControl, Button, Form } from 'react-bootstrap';
import _ from "lodash";

const generateOnSubmit = ({ modalInfo, action, onHide }) => async (values, formikActions) => {

    const { validateField, setErrors } = formikActions

    await validateField('name')

    const item = { id: modalInfo.item.id, name: values.name }

    const { status, errors } = await action(item)

    if (status === 'error') {
        return setErrors({ name: errors })
    }

    onHide();
};

const RenameModal = (props) => {
    const { show, onHide, modalInfo } = props;
    const { id, name } = modalInfo.item;
    const f = useFormik({
        initialValues: { id, name },
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
        validateOnBlur: false
    });
    const inputRef = useRef();
    useEffect(() => {
        inputRef.current.select();
    }, []);

    return (
        <Modal centered show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Rename channel "{name}"</Modal.Title>
            </Modal.Header>

            <form onSubmit={f.handleSubmit}>
                <Modal.Body>
                    <FormGroup>
                        <Form.Label>Name</Form.Label>
                        <FormControl
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
            </form>
        </Modal>
    );
};

export default RenameModal;
