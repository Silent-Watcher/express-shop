const path = require('path');

const dotenv = require('dotenv-safe');
// const normalizeStatusCode = require('./normalizeStatus');
dotenv.config({ path: path.join(process.cwd(), '.env') });

// eslint-disable-next-line no-unused-vars
function handleExceptions(err, req, res, next) {
	if (!err) next();
	let status = err?.status ?? err?.code ?? err?.statusCode ?? 500;
	// normalizeStatusCode(status);
	req.app.set('layout', 'layouts/error');
	res.locals.error =
		process.env.APP_ENV == 'development' ? err : { status, message: err.message, redirectLink: req.headers.referer };
	if (process.env.APP_ENV == 'development') res.status(status).json(err);
	else res.status(status).render('error');
}

// eslint-disable-next-line no-unused-vars
function handleNotFoundError(req, res, next) {
	req.app.set('layout', 'layouts/error');
	return res.render('error', {
		error: {
			status: 404,
			message: 'صفحه یافت نشد 😣',
			redirectLink: req.headers.referer,
		},
	});
}

module.exports = { handleExceptions, handleNotFoundError };
