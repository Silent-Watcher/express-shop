// const session = require('express-session');
// const MongoStore = require('connect-mongo');
// const cookieParser = require('cookie-parser');

const { handleExceptions, handleNotFoundError } = require('../../app/http/middlewares/handleExceptions');
const { STATIC_FILES_PATH } = require('app/common/globals');
const express = require('express');
require('app-module-path').addPath(__dirname);
const { DASHBOARD_VIEW_FILES_PATH } = require('app/common/globals');
const app = express();
const router = require('./routes/web');
// const { env } = process;

app.set('view engine', 'ejs');
app.set('views', DASHBOARD_VIEW_FILES_PATH);
app.set('layout', 'layouts/layout');
app.use('/static', express.static(STATIC_FILES_PATH));
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);
app.set('layout extractMetas', true);

// app.use(
// 	cookieParser(env.COOKIE_SECRET),
// 	session({
// 		secret: env.SESSION_SECRET,
// 		saveUninitialized: true,
// 		resave: true,
// 		cookie: { expiresIn: new Date(Date.now() + 6 * 3600 * 1000) },
// 		store: MongoStore.create({ mongoUrl: env.DB_URL, dbName: env.DB_NAME }),
// 	})
// );

app.use(router);

app.use(handleExceptions);
app.use(handleNotFoundError);

module.exports = app;
