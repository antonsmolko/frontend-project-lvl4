import { createSlice } from "@reduxjs/toolkit";
import lsApi from "../../api/localStorage";
import _ from 'lodash';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: lsApi.getItem('user') || {},
    loggedIn: Boolean(_.get(lsApi.getItem('user'), 'token')),
  },
  reducers: {
    login: (state, { payload }) => {
      state.user = payload;
      lsApi.setItem('user', payload);
      state.loggedIn = Boolean(payload.token);
    },
    logout: (state) => {
      lsApi.setItem('user', {});
      state.loggedIn = false;
      state.user = {};
    }
  }
});

export const {
  logout,
  login
} = authSlice.actions

export default authSlice.reducer;

