import axios from '../app/axios';
import {
	channelsPath,
	channelPath,
} from '../routes';

const chatApi = {
	getChannels: () => axios.get(channelsPath()),
	addChannel: (payload) => axios.post(channelsPath(), payload),
	getChannel: ({ id }) => axios.get(channelPath(id)),
	renameChannel: ({ id, name }) => axios.put(channelPath(id), { name }),
	removeChannel: (id) => axios.delete(channelPath(id)),
};

export default chatApi;
