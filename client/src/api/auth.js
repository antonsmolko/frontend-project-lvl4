import axios from '../app/axios';
import { loginPath } from '../routes';

const userApi = {
  login: (credentials) => axios.post(loginPath(), credentials)
}

export default userApi;
