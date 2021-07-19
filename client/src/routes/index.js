// @ts-check

const host = '';
const prefix = 'api/v1';

export const channelsPath = () => [host, prefix, 'channels'].join('/');
export const channelPath = (id) => [host, prefix, 'channels', id].join('/');
export const channelMessagesPath = (id) => [host, prefix, 'channels', id, 'messages'].join('/');
export const setCurrentChannel = (id) => [host, prefix, 'channels', id, 'current'].join('/');
export const loginPath = () => [host, prefix, 'login'].join('/');

