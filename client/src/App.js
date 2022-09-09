import React from 'react';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link,
	Navigate,
} from 'react-router-dom';
import { Container, Navbar } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthProvider from './providers/AuthProvider';

import {
	LoginPage,
	HomePage,
	NotFoundPage,
	SignUpPage,
} from './pages';

import AuthButton  from './components/form/AuthButton';
import PrivateRoute from './components/routes/PrivateRoute';

function App() {
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
							<Route exact path='/' element={<HomePage />} />
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
