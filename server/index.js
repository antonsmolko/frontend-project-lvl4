// @ts-check

import Pug from 'pug';
import path from 'path';
import { fileURLToPath } from 'url';
import fastify from 'fastify';
import view from '@fastify/view';
import fastifySocketIo from 'fastify-socket.io';
import fastifyStatic from '@fastify/static';
import fastifyJWT from '@fastify/jwt';
import fastifyCors from '@fastify/cors';
import HttpErrors from 'http-errors';
import i18n from 'i18next';
import { JSONFile } from 'lowdb';
import LowWithLodash from './db/LowWithLodash.js';

import addRoutes from './routes.js'; // eslint-disable-line
import addSocket from './socket/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Connect Database
const file = path.join(__dirname, './db/db.json');
const adapter = new JSONFile(file);
const db = new LowWithLodash(adapter);
await db.read();

const { Unauthorized } = HttpErrors;

const isProduction = process.env.NODE_ENV === 'production';
const appPath = path.join(__dirname, '..');
const isDevelopment = !isProduction;

const setUpViews = (app) => {
	const devHost = 'http://localhost:8080';
	const domain = isDevelopment ? devHost : '';
	app.register(view, {
		engine: {
			pug: Pug,
		},
		defaultContext: {
			assetPath: (filename) => `${domain}/assets/${filename}`,
		},
		templates: path.join(__dirname, 'views'),
	});
};

const setUpStaticAssets = (app) => {
	app.register(fastifyStatic, {
		root: path.join(appPath, 'dist/public'),
		prefix: '/assets',
	});
};

const setUpCors = (app) => {
	app.register(fastifyCors, {
		origin: (origin, cb) => {
			if (/localhost/.test(origin)) {
				//  Request from localhost will pass
				cb(null, true);
				return;
			}
			// Generate an error on other origins, disabling access
			cb(new Error(i18n.t('errors.notAllowed')));
		},
	});
};

const setUpAuth = (app) => {
	// @TODO: add socket auth
	app
		.register(fastifyJWT, {
			secret: 'supersecret',
		})
		.decorate('authenticate', async (req, reply) => {
			try {
				await req.jwtVerify();
			} catch (_err) {
				reply.send(new Unauthorized());
			}
		});
};

const server = async () => {
	const app = fastify({ logger: true });

	setUpAuth(app);
	setUpViews(app);
	setUpStaticAssets(app);
	setUpCors(app);
	await app.register(fastifySocketIo, {
		cors: {
			origin: 'http://localhost:3000',
			methods: ['GET', 'POST'],
			allowedHeaders: ['Authorization'],
			credentials: true,
		},
	});
	addSocket(app, db);
	addRoutes(app, db);

	return app;
};

export default server;
