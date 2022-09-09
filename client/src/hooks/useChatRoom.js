import { useEffect, useRef } from 'react';
import { addChannel, removeChannel, renameChannel } from '../features/channels/channelsSlice';
import { addMessage, setMessages } from '../features/messages/messagesSlice';
import { useDispatch } from 'react-redux';
import socketIo from '../app/socket-io';

export const useChatRoom = (roomId, setDefaultRoomId) => {
	const dispatch = useDispatch();
	const socketRef = useRef(null);

	useEffect(() => {
		if (!roomId) { return; }

		socketRef.current = socketIo(roomId);

		socketRef.current.emit('message:get');

		socketRef.current.on('s:messages', (messages) => {
			dispatch(setMessages(messages));
		});

		socketRef.current.on('s:message:add', (message) => {
			if (message.channel === roomId) {
				dispatch(addMessage(message));
			}
		});

		socketRef.current.on('s:channel:add', (channel) => {
			if (channel.id !== roomId) {
				dispatch(addChannel(channel));
			}
		});

		socketRef.current.on('s:channel:remove', async (id) => {
			dispatch(removeChannel(id));

			if (id === roomId) {
				setDefaultRoomId();
			}
		});

		socketRef.current.on('s:channel:rename', (data) => dispatch(renameChannel(data)));

		return () => {
			socketRef.current.disconnect();
		};
	}, [roomId]);

	const onAddChannel = (name) => new Promise((resolve, reject) => {
		if (!socketRef.current.connected) { reject(); }

		socketRef.current.emit('channel:add', name, (response) => {
			if (response.status === 'ok') {
				dispatch(addChannel(response.channel));
			}

			resolve(response);
		});
	});

	const onRemoveChannel = (id) => {
		if (!socketRef.current.connected) { return; }

		socketRef.current.emit('channel:remove', { id });
	};

	const onRenameChannel = (item) => new Promise((resolve, reject) => {
		if (!socketRef.current.connected) { reject(); }

		socketRef.current.emit('channel:rename', item, resolve);
	});

	const onSendMessage = (payload) => new Promise((resolve, reject) => {
		if (!socketRef.current.connected) { reject(); }

		socketRef.current.emit('message:add', payload, ({ status }) => {
			status === 'ok' ? resolve() : reject();
		});
	});

	return {
		onSendMessage,
		onAddChannel,
		onRemoveChannel,
		onRenameChannel
	};
};
