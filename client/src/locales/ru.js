export default {
	translation: {
		pages: {
			home: {
				title: 'Каналы',
				messages_zero: '{{count}} сообщений',
				messages_one: '{{count}} сообщение',
				messages_few: '{{count}} сообщения',
				messages_many: '{{count}} сообщений',
			},
			login: {
				title: 'Вход',
				submit: 'Войти',
				link: {
					question: 'Нет аккаунта?',
					answer: 'Регистрация',
				},
			},
			signUp: {
				title: 'Регистрация',
				submit: 'Зарегистрироваться',
				link: {
					question: 'Уже есть аккаунт?',
					answer: 'Войти',
				},
			},
			notfound: {
				title: 'Страница не найдена',
			},
		},
		modals: {
			add: {
				title: 'Добавить канал',
			},
			remove: {
				title: 'Удалить канал "{{channel}}"',
			},
			rename: {
				title: 'Переименовать канал "{{channel}}"',
			},
		},
		actions: {
			delete: 'Удалить',
			rename: 'Переименовать',
			add: 'Добавить',
			remove: 'Удалить',
			cancel: 'Отменить',
			login: 'Войти',
			logout: 'Выйти',
		},
		validation: {
			default: 'Поле не валидно',
			required: 'Поле обязательно',
			unique: 'Должно быть уникальным',
			range: 'От {{min}} до {{max}} символов',
			alphaNum: 'Допускаются только буквенно-цифровые символы',
			passwordConfirmation: 'Должно совпадать с паролем',
		},
		form: {
			label: {
				username: 'Ваш ник',
				password: 'Пароль',
				passwordConfirmation: 'Подтвердите пароль',
				name: 'Имя',
			},
			placeholder: {
				message: 'Введите сообщение...',
			},
		},
	},
};
