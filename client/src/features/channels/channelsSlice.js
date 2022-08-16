import { createAsyncThunk, createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import chatApi from '../../api/chat';

const channelsAdapter = createEntityAdapter();
const initialState = channelsAdapter.getInitialState({ currentChannelId: null });

export const fetchChannels = createAsyncThunk(
	'chat/fetchChannels',
	async () => {
		const { data } = await chatApi.getChannels();
		return data;
	},
);

export const getChannel = createAsyncThunk(
	'chat/getChannel',
	async ({ id }) => {
		console.log('getChannel asyncThunk', id);
		const { data } = await chatApi.getChannel({ id });
		return data;
	},
);

export const channelsSlice = createSlice({
	name: 'channels',
	initialState,
	reducers: {
		addChannel: channelsAdapter.addOne,
		removeChannel: channelsAdapter.removeOne,
		renameChannel: channelsAdapter.updateOne,
	},
	// reducers: {
	//   setMessages: (state, { payload }) => {
	//     state.messages = [...payload];
	//   },
	//   addMessage: (state, { payload }) => {
	//     state.messages.push(payload)
	//   },
	//   setCurrentChannelId: (state, { payload }) => {
	//     state.currentChannelId = payload;
	//   },
	//   setMessageValue: (state, { payload }) => {
	//     state.newMessage = payload;
	//   },
	// },
	extraReducers: (builder) => {
		builder.addCase(fetchChannels.fulfilled, (state, { payload }) => {
			const { channels } = payload;
			channelsAdapter.upsertMany(state, channels);
			const { id } = channels.find((channel) => channel.default);
			state.currentChannelId = id;
		});
		builder.addCase(getChannel.fulfilled, (state, { payload }) => {
			state.currentChannelId = payload.id;
			console.log('getChannel:currentChannelId', state.currentChannelId);
		});
	},
});

export const {
	setCurrentChannelId,
	addChannel,
	removeChannel,
	renameChannel,
} = channelsSlice.actions;

export default channelsSlice.reducer;
