import i18n from 'i18next';
import ru from './locales/ru.js';

i18n
	.init({
		lng: 'ru',
		resources: {
			ru,
		},
	});

export default i18n;
