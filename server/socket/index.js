import registerMessageHandlers from './handlers/messageHandlers.js';
import registerChannelHandlers from './handlers/channelHendlers.js';

export default (app, db) => app.io.on('connect', (socket) => {
	const { roomId } = socket.handshake.query;
	// сохраняем название комнаты в соответствующем свойстве сокета
	socket.roomId = roomId; // eslint-disable-line

	// присоединяемся к комнате (входим в нее)
	socket.join(roomId);

	registerMessageHandlers(app.io, socket, db);
	registerChannelHandlers(app.io, socket, db);

	socket.on('disconnect', () => {
		socket.leave(roomId);
	});
});
