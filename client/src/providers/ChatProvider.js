import React, { useState } from 'react';
import { ChatContext } from '../contexts';

export default function ChatProvider({ children }) {
	const [modalInfo, setModalInfo] = useState({ type: null, item: null });

	const hideModal = () => setModalInfo({ type: null, item: null });
	const showModal = (type, item = null) => setModalInfo({ type, item });

	const removeChannel = ({ id, name }) => {
		showModal('removing', { id, name });
	};

	const renameChannel = ({ id, name }) => {
		showModal('renaming', { id, name });
	};

	const addChannel = () => {
		showModal('adding');
	};

	return (
		<ChatContext.Provider value={{
			showModal,
			hideModal,
			modalInfo,
			addChannel,
			removeChannel,
			renameChannel
		}}>
			{children}
		</ChatContext.Provider>
	);
}
