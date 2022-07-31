import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import chatApi from "../../api/chat";

// export const fetchMessagesByChannelId = createAsyncThunk(
//   'chat/fetchMessages',
//   async (channelId) => {
//     const { data } = await chatApi.getMessagesByChannelId(channelId)
//     return data;
//   }
// )

export const fetchChannels = createAsyncThunk(
  'chat/fetchChannels',
  async () => {
    const { data } = await chatApi.getChannels()
    return data;
  }
)

export const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    channels: [],
    currentChannelId: null,
    messages: [],
    newMessage: '',
  },
  reducers: {
    setMessages: (state, { payload }) => {
      state.messages = [...payload];
    },
    addMessage: (state, { payload }) => {
      state.messages.push(payload)
    },
    setCurrentChannelId: (state, { payload }) => {
      state.currentChannelId = payload;
    },
    setMessageValue: (state, { payload }) => {
      state.newMessage = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChannels.fulfilled, (state, { payload }) => {
      state.channels = [...payload.channels];
      state.currentChannelId = payload.currentChannelId;
    })
    // builder.addCase(fetchMessagesByChannelId.fulfilled, (state, { payload}) => {
    //   state.messages = [...payload];
    // })
  },
});

export const {
  setMessages,
  setCurrentChannelId,
  setMessageValue,
  addMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
