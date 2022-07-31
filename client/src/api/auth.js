import axios from '../app/axios';
import { loginPath, signupPath } from '../routes';

const userApi = {
  login: (credentials) => axios.post(loginPath(), credentials),
  signup: (payload) => axios.post(signupPath(), payload),
}

export default userApi;
