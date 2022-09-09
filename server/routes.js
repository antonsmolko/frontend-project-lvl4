// @ts-check

import _ from 'lodash';
import { nanoid } from 'nanoid';
import HttpErrors from 'http-errors';
import i18n from './i18n.js';

const { Unauthorized, NotFound } = HttpErrors;

const routes = (app, db) => {
	app.post('/api/v1/login', async (req, reply) => {
		const username = _.get(req, 'body.username');
		const password = _.get(req, 'body.password');
		const user = db.chain.get('users').find({ username }).value();

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
		const user = db.chain.get('users').find({ username }).value();

		if (user) {
			reply
				.code(409)
				.header('Content-Type', 'application/json; charset=utf-8')
				.send({ username: i18n.t('errors.auth.usernameAlreadyExists') });

			return;
		}

		const newUser = { id: nanoid(8), username, password };
		const token = app.jwt.sign({ userId: newUser.id });
		db.data.users.push(newUser);

		reply
			.code(201)
			.header('Content-Type', 'application/json; charset=utf-8')
			.send({ token, username });
	});

	app.get('/api/v1/data', { preValidation: [app.authenticate] }, (req, reply) => {
		const users = db.data.users;
		const user = users.chain.get('users').find({ id: req.user.userId }).value();

		if (!user) {
			reply.send(new Unauthorized());
			return;
		}

		reply
			.header('Content-Type', 'application/json; charset=utf-8')
			.send(users);
	});

	app.get('/api/v1/channels', { preValidation: [app.authenticate] }, (req, reply) => {
		const channels = db.data.channels;
		const defaultChannel = channels.find((c) => c.default);
		const messages = db.data.messages.filter(({ channel }) => channel === defaultChannel.id);

		reply
			.header('Content-Type', 'application/json; charset=utf-8')
			.send({ channels, messages });
	});

	app.get('/api/v1/channels/:id', { preValidation: [app.authenticate] }, (req, reply) => {
		const { id } = req.params;
		const channel = db.chain.get('channels').find({ id }).value();

		if (!channel) {
			reply.send(new NotFound());
			return;
		}

		const messages = db.data.messages.filter((message) => message.channel === id);

		reply
			.code(200)
			.header('Content-Type', 'application/json; charset=utf-8')
			.send({ ...channel, messages });
	});

	app
		.get('*', (_req, reply) => {
			reply.view('index.pug');
		});
};

export default routes;
