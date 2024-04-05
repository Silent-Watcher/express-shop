const createError = require('http-errors');
const httpStatus = require('http-status');
const normalizeStatusCode = require('../../helpers/normalizer');

function handleNotFoundError(req, res, next) {
	next(createError(httpStatus.NOT_FOUND));
}

function handleExceptions(err, req, res) {
	let status = err.status || err.code || err.statusCode || 500;
	status = normalizeStatusCode(status);
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') == 'development' ? err : { status };
	if (req.app.get('env') == 'development') res.status(status).json(err);
	else res.render('error');
}

module.exports = { handleNotFoundError, handleExceptions };
