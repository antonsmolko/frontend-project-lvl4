import axios from '../app/axios';
import {
	channelsPath,
} from '../routes';

const chatApi = {
	getChannels: () => axios.get(channelsPath()),
};

export default chatApi;
