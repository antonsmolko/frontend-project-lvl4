import { io } from 'socket.io-client';
import { store } from "./store";

const getAuthHeader = () => {
  const { token } = store.getState().auth.user;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const socketIo = io('http://0.0.0.0:5000', {
  withCredentials: true,
  extraHeaders: getAuthHeader(),
});

export default socketIo;
