const i18N = require('i18n');

const http = require('http');

const methodOverride = require('method-override');

const favicon = require('serve-favicon');
const autoBind = require('auto-bind');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const express = require('express');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const session = require('express-session');

const { VIEW_FILES_PATH, STATIC_FILES_PATH } = require('app/common/globals');
const expressEjsLayouts = require('express-ejs-layouts');
const { handleExceptions, handleNotFoundError } = require('app/http/middlewares/handleExceptions');
const passport = require('passport');
const rememberLogin = require('app/http/middlewares/remember.middleware');
const addBreadcrumbs = require('./http/middlewares/breadcrumb.middleware');

const path = require('path');
const gate = require('./http/guards/gate.guard');
const { LOCALES_PATH } = require('./common/globals');
// const helmet = require('helmet');

const { env } = process;

class Application {
	#app = express();
	#port;
	//------------------
	constructor(port) {
		autoBind(this);
		this.#port = port;
		this.setConfigs();
		this.router();
		this.connectToMongoDb(env.DB_URL, env.DB_NAME).then(() => {
			this.createServer(this.#port);
		});
		this.handleErrors();
	}
	//------------------
	createServer(port) {
		const server = http.createServer(this.#app);
		server.listen(port, () => {
			console.log(`server is up and running on port ${port}`);
		});
	}
	//------------------
	setConfigs() {
		require('./passport/local');
		require('./passport/google');
		this.#app.set('view engine', 'ejs');
		this.#app.set('views', VIEW_FILES_PATH);
		this.#app.set('layout extractScripts', true);
		this.#app.set('layout extractStyles', true);
		this.#app.set('layout extractMetas', true);
		this.#app.use(methodOverride('_method'));
		i18N.configure({
			locales: ['en', 'fa'],
			directory: LOCALES_PATH,
			defaultLocale: 'fa',
			cookie: 'lang',
		});
		this.#app.use(i18N.init);
		this.#app.use('/robots.txt', express.static(path.join(STATIC_FILES_PATH, 'robots.txt')));
		this.#app.use(addBreadcrumbs);
		this.#app.use(favicon(path.join(STATIC_FILES_PATH, 'favicon.ico')));
		// this.#app.use(
		// 	helmet({
		// 		referrerPolicy: {
		// 			policy: ['origin', 'unsafe-url'],
		// 		},
		// 		contentSecurityPolicy: {
		// 			directives: {
		// 				'script-src': [
		// 					"'self'",
		// 					"'http://www.google.com/'",
		// 					"'https://cdn.jsdelivr.net/'",
		// 					"'https://code.jquery.com/'",
		// 				],
		// 			},
		// 			reportOnly: true,
		// 		},
		// 	})
		// );
		this.#app.use(
			express.json(),
			express.urlencoded({ extended: true }),
			expressEjsLayouts,
			cookieParser(env.COOKIE_SECRET),
			session({
				secret: env.SESSION_SECRET,
				saveUninitialized: true,
				resave: true,
				cookie: { expiresIn: new Date(Date.now() + 6 * 3600 * 1000) },
				store: MongoStore.create({ mongoUrl: env.DB_URL, dbName: env.DB_NAME }),
			}),
			flash()
		);
		this.#app.use(passport.initialize());
		this.#app.use(passport.session());
		this.#app.use(rememberLogin);
		this.#app.use('/static', express.static(STATIC_FILES_PATH));
		this.#app.use((req, res, next) => {
			res.locals.lang = req.getLocale();
			next();
		});
		this.#app.use((req, res, next) => {
			if (req.isAuthenticated()) res.locals.user = req.user;
			else res.locals.user = null;
			next();
		});
		this.#app.use(gate.middleware());
		this.#app.use(compression({ level: 3 }));
	}
	//------------------
	router() {
		this.#app.use(require('app/routes/web'));
		this.#app.use(require('app/routes/api'));
	}
	//------------------
	connectToMongoDb(dbUrl, dbName) {
		// mongoose.set('strictQuery', true);
		// mongoose.set('strictPopulate', false);
		return mongoose.connect(dbUrl, { dbName });
	}
	//------------------
	handleErrors() {
		this.#app.use(handleExceptions);
		this.#app.use(handleNotFoundError);
	}
}

module.exports = Application;
