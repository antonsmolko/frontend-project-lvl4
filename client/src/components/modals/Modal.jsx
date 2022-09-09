import React from 'react';
import Add from './Add';
import Remove from './Remove';
import Rename from './Rename';
import { useChat } from '../../hooks';

const Modal = ({ addAction, removeAction, renameAction}) => {
	const { modalInfo, hideModal } = useChat();

	const { type } = modalInfo;

	if (!type) { return null; }

	const componentMap = {
		adding: Add,
		removing: Remove,
		renaming: Rename,
	};

	const actionMap = {
		adding: addAction,
		removing: removeAction,
		renaming: renameAction
	};

	const Component = componentMap[type];
	const action = actionMap[type];
	const show = !!type;

	return (
		<Component
			modalInfo={modalInfo}
			show={show}
			onHide={hideModal}
			action={action}
		/>
	);
};

export default Modal;
