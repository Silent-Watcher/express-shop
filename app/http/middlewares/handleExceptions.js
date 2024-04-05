const path = require('path');

const dotenv = require('dotenv-safe');
dotenv.config({ path: path.join(process.cwd(), '.env') });

const createError = require('http-errors');
const normalizeStatusCode = require('../../helpers/normalizer');

function handleNotFoundError(req, res, next) {
	return next(createError(404, 'صفحه یافت نشد 😣'));
}

// eslint-disable-next-line no-unused-vars
function handleExceptions(err, req, res, next) {
	let status = err.status || err.code || err.statusCode || 500;
	req.app.set('layout', 'layouts/error');
	status = normalizeStatusCode(status);
	res.locals.error = process.env.APP_ENV == 'development' ? err : { status, message: err.message };
	if (process.env.APP_ENV == 'development') res.status(status).json(err);
	else res.render('error');
}

module.exports = { handleNotFoundError, handleExceptions };
