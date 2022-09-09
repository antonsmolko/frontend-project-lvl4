import React from 'react';

const Message = ({ id, username, text }) => (
	<div key={id} className="text-break mb-2">
		<b>{username}</b>
		:
		{' '}
		{text}
	</div>
);

export default Message;
