import axios from 'axios';
import { store } from './store';

const instance = axios.create({
  baseURL: 'http://0.0.0.0:5000',
  headers: {
    post: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }
});

instance.interceptors.request.use(function (config) {
  const { token } = store.getState().auth.user;
  return token ? { ...config, headers: { Authorization: `Bearer ${token}` } } : config;
});

export default instance;
