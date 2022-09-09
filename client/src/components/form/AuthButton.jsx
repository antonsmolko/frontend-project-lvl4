import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import React from 'react';
import { useAuth } from '../../hooks';

export default function AuthButton() {
	const { t } = useTranslation();
	const { loggedIn, logout } = useAuth();

	return (
		loggedIn
			? <Button onClick={logout}>{t('actions.logout')}</Button>
			: <Button as={Link} to="/login">{t('actions.login')}</Button>
	);
}
