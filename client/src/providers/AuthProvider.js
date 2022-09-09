import React, { useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { AuthContext } from '../contexts';
import { fetchUser, login, signup, logout } from '../features/auth/authSlice';
import { useLocalStorage } from '../hooks';

export default function AuthProvider({ children }) {
	const dispatch = useDispatch();
	const loggedIn = useSelector(({ auth }) => auth.loggedIn);
	const [user, setUser] = useLocalStorage('user', {});

	useLayoutEffect(() => {
		if (!user.token) { return; }
		dispatch(fetchUser(user));
	}, [dispatch, user]);

	const handleLogout = () => {
		setUser({});
		dispatch(logout());
	};

	const handleLogin = async (payload) => {
		const data = await dispatch(login(payload));
		const result = unwrapResult(data);

		setUser(result);
	};

	const handleSignup = async (payload) => {
		const data = await dispatch(signup(payload));
		const result = unwrapResult(data);

		setUser(result);
	};

	return (
		<AuthContext.Provider value={{
			user,
			loggedIn: loggedIn || !!user.token,
			logout: handleLogout,
			login: handleLogin,
			signup: handleSignup
		}}>
			{children}
		</AuthContext.Provider>
	);
}
