const compression = require('compression');

const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const autoBind = require('auto-bind');

const { VIEW_FILES_PATH, STATIC_FILES_PATH } = require('app/common/globals');
const expressEjsLayouts = require('express-ejs-layouts');
const { handleExceptions, handleNotFoundError } = require('app/http/middlewares/handleExceptions');
const passport = require('passport');
const rememberLogin = require('app/http/middlewares/remember.middleware');

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
		this.handleErrors();
		this.connectToMongoDb(env.DB_URL, env.DB_NAME).then(() => {
			this.createServer(this.#port);
		});
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
		this.#app.set('view engine', 'ejs');
		this.#app.set('views', VIEW_FILES_PATH);
		this.#app.use('/static', express.static(STATIC_FILES_PATH));
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
		this.#app.use((req, res, next) => {
			if (req.isAuthenticated()) {
				res.locals = { user: req.user };
			} else {
				res.locals = { user: null };
			}
			next();
		});
		this.#app.use(compression({ level: 3 }));
	}
	//------------------
	router() {
		this.#app.use(require('app/routes/web'));
		this.#app.use(require('app/routes/api'));
	}
	//------------------
	connectToMongoDb(dbUrl, dbName) {
		mongoose.set('strictQuery', true);
		return mongoose.connect(dbUrl, { dbName });
	}
	//------------------
	handleErrors() {
		this.#app.use(handleNotFoundError);
		this.#app.use(handleExceptions);
	}
}

module.exports = Application;
