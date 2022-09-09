import { createAsyncThunk, createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import chatApi from '../../api/chat';

const channelsAdapter = createEntityAdapter();
const initialState = channelsAdapter.getInitialState();

export const fetchChannels = createAsyncThunk(
	'chat/fetchChannels',
	async () => {
		const { data } = await chatApi.getChannels();
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
	extraReducers: (builder) => {
		builder.addCase(fetchChannels.fulfilled, (state, { payload }) => {
			const { channels } = payload;
			channelsAdapter.upsertMany(state, channels);
		});
	},
});

export const {
	addChannel,
	removeChannel,
	renameChannel,
} = channelsSlice.actions;

export default channelsSlice.reducer;
