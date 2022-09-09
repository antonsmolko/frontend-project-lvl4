import { io } from 'socket.io-client';
import store from './store';

const SERVER_URL = 'http://0.0.0.0:5000';

const getAuthHeader = () => {
	const { token } = store.getState().auth.user;
	return token ? { Authorization: `Bearer ${token}` } : {};
};

const socketIo = (roomId) => io(SERVER_URL, {
	withCredentials: true,
	extraHeaders: getAuthHeader(),
	query: { roomId }
});

export default socketIo;
