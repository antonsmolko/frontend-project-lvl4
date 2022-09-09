import i18n from '../../i18n.js';
import { nanoid } from 'nanoid';

export default (io, socket, db) => {
	const validChannelName = (name, acknowledge, id = null) => {
		const channels = db.data.channels;
		const checkForUniqueness = channels.every((channel) => channel.name !== name || channel.id === id);

		if (!checkForUniqueness) {
			acknowledge({ status: 'error', errors: { name: i18n.t('validation.unique') } });
			return false;
		}

		if (!name) {
			acknowledge({ status: 'error', errors: { name: i18n.t('validation.required') } });
			return false;
		}

		return true;
	};

	const getChannels = () => {
		const channels = db.data.channels;
		io.in(socket.roomId).emit('s:channels', channels);
	};

	const addChannel = async (name, acknowledge) => {
		const validation = validChannelName(name, acknowledge);

		if (!validation) { return; }

		const channel = {
			id: nanoid(8),
			name,
			createdAt: new Date(),
			removable: true,
			default: false
		};

		db.data.channels.push(channel);
		await db.write();

		acknowledge({ status: 'ok', channel });

		io.emit('s:channel:add', channel);
	};

	const renameChannel = async ({ name, id }, acknowledge) => {
		const validation = validChannelName(name, acknowledge, id);

		if (!validation) { return; }

		const channel = {
			name,
			updatedAt: new Date(),
		};

		db.chain.get('channels').find({ id }).assign(channel).value();
		await db.write();

		acknowledge({ status: 'ok', id });

		io.emit('s:channel:rename', { id, changes: { name } });
	};

	const removeChannel = async ({ id }) => {
		db.chain.get('channels').remove({ id }).value();
		db.chain.get('messages').remove({ channel: id }).value();

		await db.write();
		io.emit('s:channel:remove', id);
	};

	socket.on('channel:get', getChannels);
	socket.on('channel:add', addChannel);
	socket.on('channel:rename', renameChannel);
	socket.on('channel:remove', removeChannel);
};
