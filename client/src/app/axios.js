import axios from 'axios';
import { toast } from 'react-toastify';
import store from './store';
import i18n from 'i18next';

const instance = axios.create({
	baseURL: 'http://0.0.0.0:5000',
	headers: {
		post: { 'Content-Type': 'application/x-www-form-urlencoded' },
	},
});

instance.interceptors.request.use((config) => {
	const { token } = store.getState().auth.user;
	return token ? { ...config, headers: { Authorization: `Bearer ${token}` } } : config;
});

instance.interceptors.response.use((response) => response, (error) => {
	const { status } = error.response;

	if (![401, 409, 422].includes(status)) {
		const message = _.get(error, 'response.message', i18n.t(`toasts.httpErrors.${status}`));
		toast.error(message);
	}

	return Promise.reject(error);
});

export default instance;
