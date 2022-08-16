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
		min: ({ min }) => ({ key: 'validation.length.min', values: { min } }),
		max: ({ max }) => ({ key: 'validation.length.max', values: { max } }),
	},
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
		range: { min: 2, max: 20 },
	},
	channelName: {
		range: { min: 3, max: 20 },
	},
};
