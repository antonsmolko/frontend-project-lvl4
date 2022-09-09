import React from 'react';
import { BsPlusSquare } from 'react-icons/bs';
import { useChat } from '../../../hooks';

const AddChannelButton = () => {
	const { addChannel } = useChat();

	return (
		<button
			type="button"
			onClick={addChannel}
			className="p-0 text-primary btn btn-group-vertical"
		>
			<BsPlusSquare />
		</button>
	);
};

export default AddChannelButton;
