import axios from '../app/axios';
import { channelMessagesPath, channelsPath  } from '../routes';

const chatApi = {
  getMessagesByChannelId: (channelId) => axios.get(channelMessagesPath(channelId)),
  getChannels: () => axios.get(channelsPath())
}

export default chatApi;
