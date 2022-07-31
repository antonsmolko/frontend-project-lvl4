import React from 'react';
import { Modal, Button } from 'react-bootstrap';

// BEGIN
const generateOnSubmit = ({ modalInfo, action, onHide }) => (e) => {
    e.preventDefault();
    action(modalInfo.item.id);
    onHide();
};

const Remove = (props) => {
    const { show, onHide, modalInfo } = props;
    const onSubmit = generateOnSubmit(props);

    return (
        <Modal centered show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Remove channel "{modalInfo.item.name}"</Modal.Title>
            </Modal.Header>
            <form onSubmit={onSubmit}>
                <Modal.Footer>
                    <Button variant="danger" type="submit">Remove</Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default Remove;
