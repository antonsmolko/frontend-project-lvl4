import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

// BEGIN
const generateOnSubmit = ({ modalInfo, action, onHide }) => (e) => {
	e.preventDefault();
	action(modalInfo.item.id);
	onHide();
};

function Remove(props) {
	const { t } = useTranslation();
	const { show, onHide, modalInfo } = props;
	const onSubmit = generateOnSubmit(props);

	return (
		<Modal centered show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>
					{t('modals.remove.title', { channel: modalInfo.item.name })}
				</Modal.Title>
			</Modal.Header>
			<form onSubmit={onSubmit}>
				<Modal.Footer>
					<Button variant="danger" type="submit">{t('actions.remove')}</Button>
				</Modal.Footer>
			</form>
		</Modal>
	);
}

export default Remove;
