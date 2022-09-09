import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authApi from '../../api/auth';

export const login = createAsyncThunk(
	'auth/login',
	async (payload, { rejectWithValue }) => {
		try {
			const { data } = await authApi.login(payload);
			return data;
		} catch ({ response }) {
			if (response.status !== 401) return;
			return rejectWithValue(response.data);
		}
	},
);

export const signup = createAsyncThunk(
	'auth/signup',
	async (payload,{ rejectWithValue }) => {
		try {
			const { data } = await authApi.signup(payload);
			return data;
		} catch ({ response }) {
			if (![422, 409].includes(response.status)) return;
			return rejectWithValue(response.data);
		}
	},
);

const setState = (state, { payload = {} } = {}) => {
	state.user = payload;
	state.loggedIn = !!payload.token;
};

export const authSlice = createSlice({
	name: 'auth',
	initialState: {
		user: {},
		loggedIn: false
	},
	reducers: {
		fetchUser: setState,
		logout: setState,
	},
	extraReducers: (builder) => {
		builder.addCase(login.fulfilled, setState);
		builder.addCase(signup.fulfilled, setState);
	},
});

export const { logout, fetchUser } = authSlice.actions;

export default authSlice.reducer;
