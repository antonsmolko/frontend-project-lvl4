import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const messagesAdapter = createEntityAdapter();
const initialState = messagesAdapter.getInitialState();

export const messagesSlice = createSlice({
	name: 'messages',
	initialState,
	reducers: {
		addMessage: messagesAdapter.addOne,
		setMessages: messagesAdapter.setAll,
	},
});

export const {
	addMessage,
	setMessages,
} = messagesSlice.actions;

export default messagesSlice.reducer;
