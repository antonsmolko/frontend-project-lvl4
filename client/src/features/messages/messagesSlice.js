import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { fetchChannels, getChannel } from '../channels/channelsSlice';

const messagesAdapter = createEntityAdapter();
const initialState = messagesAdapter.getInitialState();

export const messagesSlice = createSlice({
	name: 'messages',
	initialState,
	reducers: {
		addMessage: messagesAdapter.addOne,
	},
	extraReducers: (builder) => (
		builder
			.addCase(fetchChannels.fulfilled, (state, { payload }) => {
				messagesAdapter.upsertMany(state, payload.messages);
			})
			.addCase(getChannel.fulfilled, (state, { payload }) => {
				messagesAdapter.setAll(state, payload.messages);
			})
	),
});

export const {
	addMessage,
} = messagesSlice.actions;

export default messagesSlice.reducer;
