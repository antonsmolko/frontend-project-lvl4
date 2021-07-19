import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authApi from "../../api/auth";
import lsApi from "../../api/localStorage";
import _ from 'lodash';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials) => {
    const { data } = await authApi.login(credentials);
    return data;
  }
)

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: lsApi.getItem('user') || {},
    loggedIn: Boolean(_.get(lsApi.getItem('user'), 'token')),
  },
  reducers: {
    logout: (state) => {
      lsApi.setItem('user', {});
      state.loggedIn = false;
      state.user = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, { payload }) => {
        state.user = payload;
        lsApi.setItem('user', payload);
        state.loggedIn = Boolean(payload.token);
      })
  }
});

export const {
  logout,
} = authSlice.actions

export default authSlice.reducer;

