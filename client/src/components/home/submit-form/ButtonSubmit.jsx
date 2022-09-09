import React from 'react';
import { useTranslation } from 'react-i18next';
import image from '../../../assets/images/send.svg';

function ButtonSubmit() {
	const { t } = useTranslation();

	return (
		<div className="input-group-append">
			<button type="submit" className="btn btn-group-vertical">
				<img src={image} alt={t('actions.submit')} />
				<span className="visually-hidden">{t('actions.submit')}</span>
			</button>
		</div>
	);
}

export default ButtonSubmit;
