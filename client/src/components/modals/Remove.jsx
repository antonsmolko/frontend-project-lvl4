import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

// BEGIN
const generateOnSubmit = ({ modalInfo, action, onHide, successMessage }) => (e) => {
	e.preventDefault();
	action(modalInfo.item.id);

	toast.success(successMessage);
	onHide();
};

function Remove(props) {
	const { t } = useTranslation();
	const { show, onHide, modalInfo } = props;
	const successMessage = t('toasts.channel.success.remove');
	const onSubmit = generateOnSubmit({ ...props, successMessage });

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
