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

import addRoutes from './routes.js'; // eslint-disable-line

const { Unauthorized } = HttpErrors;

const __filename = fileURLToPath(import.meta.url); // eslint-disable-line no-underscore-dangle
const __dirname = path.dirname(__filename); // eslint-disable-line no-underscore-dangle

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
			cb(new Error('Not allowed'));
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

const server = async (options) => {
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
	addRoutes(app, options.state || {});

	return app;
};

export default server;
