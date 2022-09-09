import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks';

export default function PrivateRoute() {
	const location = useLocation();
	const { loggedIn } = useAuth();

	const to = {
		pathname: '/login',
		state: { from: location }
	};

	return loggedIn ? <Outlet /> : <Navigate to={to} />;
}
