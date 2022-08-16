// @ts-check

import _ from 'lodash';
import HttpErrors from 'http-errors';
import i18n from './i18n.js';

const { Unauthorized, NotFound } = HttpErrors;

const getNextId = () => Number(_.uniqueId());

const buildState = (defaultState) => {
	const generalChannelId = getNextId();
	const randomChannelId = getNextId();
	const state = {
		channels: [
			{
				id: generalChannelId, name: 'general', removable: false, default: true,
			},
			{ id: randomChannelId, name: 'random', removable: false },
			{ id: getNextId(), name: 'develop', removable: true },
		],
		messages: [],
		users: [
			{ id: 1, username: 'admin', password: 'admin' },
			{ id: 2, username: 'smol', password: 'secret' },
		],
	};

	if (defaultState.messages) {
		state.messages.push(...defaultState.messages);
	}
	if (defaultState.channels) {
		state.channels.push(...defaultState.channels);
	}
	if (defaultState.users) {
		state.users.push(...defaultState.users);
	}

	return state;
};

const routes = (app, defaultState = {}) => {
	const state = buildState(defaultState);

	app.io.on('connect', (socket) => {
		console.log({ 'socket.id': socket.id });

		socket.on('newMessage', (message, acknowledge) => {
			const newMessage = {
				...message,
				id: getNextId(),
			};
			state.messages.push(newMessage);
			acknowledge({ status: 'ok' });
			app.io.emit('newMessage', newMessage);
		});

		socket.on('newChannel', (channel, acknowledge) => {
			console.log('acknowledge', acknowledge);

			const checkForUniqueness = !state.channels.some(({ name }) => name === channel.name);

			if (!checkForUniqueness) {
				acknowledge({ status: 'error', errors: i18n.t('validation.unique') });
				return;
			}

			const newChannel = {
				...channel,
				removable: true,
				id: getNextId(),
			};

			state.channels.push(newChannel);
			acknowledge({ status: 'ok', id: newChannel.id });
			app.io.emit('newChannel', newChannel);
		});

		socket.on('removeChannel', ({ id }) => {
			const channelId = Number(id);
			state.channels = state.channels.filter((c) => c.id !== channelId);
			state.messages = state.messages.filter((m) => m.channel !== channelId);

			app.io.emit('removeChannel', channelId);
		});

		socket.on('renameChannel', (payload, acknowledge) => {
			const channelId = Number(payload.id);
			const channel = state.channels.find((c) => c.id === channelId);

			const checkForUniqueness = !state.channels.some(({ name }) => name === payload.name);

			if (!checkForUniqueness) {
				acknowledge({ status: 'error', errors: i18n.t('validation.unique') });
				return;
			}

			if (!channel) {
				return;
			}

			channel.name = payload.name;

			const data = { id: channelId, changes: { name: payload.name } };

			acknowledge({ status: 'ok', ...data });
			app.io.emit('renameChannel', data);
		});
	});

	app.post('/api/v1/login', async (req, reply) => {
		const username = _.get(req, 'body.username');
		const password = _.get(req, 'body.password');
		const user = state.users.find((u) => u.username === username);

		if (!user || user.password !== password) {
			reply
				.code(401)
				.header('Content-Type', 'application/json; charset=utf-8')
				.send({ password: i18n.t('errors.auth.invalidCredentials') });

			return;
		}

		const token = app.jwt.sign({ userId: user.id });
		reply.send({ token, username, id: user.id });
	});

	app.post('/api/v1/signup', async (req, reply) => {
		const username = _.get(req, 'body.username');
		const password = _.get(req, 'body.password');
		const user = state.users.find((u) => u.username === username);

		if (user) {
			reply
				.code(409)
				.header('Content-Type', 'application/json; charset=utf-8')
				.send({ username: i18n.t('errors.auth.usernameAlreadyExists') });

			return;
		}

		const newUser = { id: getNextId(), username, password };
		const token = app.jwt.sign({ userId: newUser.id });
		state.users.push(newUser);

		reply
			.code(201)
			.header('Content-Type', 'application/json; charset=utf-8')
			.send({ token, username });
	});

	app.get('/api/v1/data', { preValidation: [app.authenticate] }, (req, reply) => {
		const user = state.users.find(({ id }) => id === req.user.userId);

		if (!user) {
			reply.send(new Unauthorized());
			return;
		}

		reply
			.header('Content-Type', 'application/json; charset=utf-8')
			.send(_.omit(state, 'users'));
	});

	app.get('/api/v1/channels', { preValidation: [app.authenticate] }, (req, reply) => {
		const { channels, messages } = state;
		const { id } = channels.find((channel) => channel.default);
		const defaultMessages = messages.filter(({ channel }) => channel === id);

		reply
			.header('Content-Type', 'application/json; charset=utf-8')
			.send({ channels, messages: defaultMessages });
	});

	app.get('/api/v1/channels/:id', { preValidation: [app.authenticate] }, (req, reply) => {
		const { id } = req.params;
		const channelId = Number(id);

		if (!_.some(state.channels, ['id', channelId])) {
			reply.send(new NotFound());
			return;
		}

		const currentChannel = state.channels.find((channel) => channel.id === channelId);
		const messages = state.messages.filter(({ channel }) => channel === channelId);

		reply
			.code(200)
			.header('Content-Type', 'application/json; charset=utf-8')
			.send({ ...currentChannel, messages });
	});

	app
		.get('*', (_req, reply) => {
			reply.view('index.pug');
		});
};

export default routes;
