import React from 'react';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link,
	Navigate,
	Outlet,
	useLocation,
} from 'react-router-dom';
import { Container, Button, Navbar } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import authContext from './contexts';
import { logout } from './features/auth/authSlice';

import {
	LoginPage,
	HomePage,
	NotFoundPage,
	SignUpPage,
} from './pages';

function AuthProvider({ children }) {
	const loggedIn = useSelector(({ auth }) => auth.loggedIn);

	return (
		<authContext.Provider value={{ loggedIn }}>
			{children}
		</authContext.Provider>
	);
}

function PrivateRoute() {
	const loggedIn = useSelector(({ auth }) => auth.loggedIn);
	const location = useLocation();

	return loggedIn ? <Outlet /> : <Navigate to={{ pathname: '/login', state: { from: location } }} />;
}

function AuthButton() {
	const { t } = useTranslation();
	const loggedIn = useSelector(({ auth }) => auth.loggedIn);
	const dispatch = useDispatch();
	const handleLogout = () => {
		dispatch(logout());
	};

	return (
		loggedIn
			? <Button onClick={handleLogout}>{t('actions.logout')}</Button>
			: <Button as={Link} to="/login">{t('actions.login')}</Button>
	);
}

function App() {
	const user = useSelector(({ auth }) => auth.user);

	return (
		<AuthProvider>
			<Router>
				<div className="d-flex flex-column h-100">
					<Navbar bg="light" expand="lg" className="shadow-sm bg-white">
						<Container>
							<Navbar.Brand as={Link} to="/">Ch@T</Navbar.Brand>
							<AuthButton />
						</Container>
					</Navbar>
					<Routes>
						<Route exact path="/login" element={<LoginPage />} />
						<Route exact path="/signup" element={<SignUpPage />} />
						<Route exact path="/not-found" element={<NotFoundPage />} />
						<Route exact path='/' element={<PrivateRoute />}>
							<Route exact path='/' element={<HomePage {...user} />} />
						</Route>
						<Route exact path="*" element={<Navigate to="/not-found" />} />
					</Routes>
					<ToastContainer />
				</div>
			</Router>
		</AuthProvider>
	);
}

export default App;
