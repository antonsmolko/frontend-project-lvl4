import { nanoid } from 'nanoid';

export default (io, socket, db) => {
	const getMessages = () => {
		const messages = db.chain.get('messages').filter({ channel: socket.roomId }).value();
		io.in(socket.roomId).emit('s:messages', messages);
	};

	const addMessage = async (payload, acknowledge) => {
		const message = {
			id: nanoid(8),
			createdAt: new Date(),
			...payload
		};

		db.data.messages.push(message);

		await db.write();

		acknowledge({ status: 'ok', message });

		io.emit('s:message:add', message);
	};

	socket.on('message:get', getMessages);
	socket.on('message:add', addMessage);
};
