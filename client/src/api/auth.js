import axios from '../app/axios';
import { loginPath, signupPath } from '../routes';

const userApi = {
	login: (payload) => axios.post(loginPath(), payload),
	signup: (payload) => axios.post(signupPath(), payload),
};

export default userApi;
