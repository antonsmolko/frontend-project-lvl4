import { setLocale } from 'yup';
import { t } from 'i18next';
import inRange from 'lodash/inRange';

setLocale({
	// use constant translation keys for messages without values
	mixed: {
		default: t('validation.default'),
		required: t('validation.required'),
	},
	// use functions to generate an error object that includes the value from the schema
	number: {
		min: (value) => t('validation.number.min', value),
		max: (value) => t('validation.number.max', value),
	},
	string: {
		min: (value) => t('validation.string.min', value),
		max: (value) => t('validation.string.max', value),
	}
});

export const vRules = {
	string: {
		range: ({ min, max }) => (value) => value == null || inRange(value.length, min, max + 1),
		matches: {
			alphaNum: /^[\wА-яЁё]+$/,
		},
	},
};

export const vParams = {
	username: {
		range: { min: 3, max: 20 },
	},
	channelName: {
		range: { min: 3, max: 20 },
	},
};
