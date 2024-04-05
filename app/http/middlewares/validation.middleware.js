const { validationResult } = require('express-validator');

function checkDataValidation(req, res, next) {
	let { errors } = validationResult(req);
	if (Object.keys(errors).length > 0) {
		errors.map(error => {
			req.flash('error', error.msg);
		});
		return res.redirect(req.headers.referer);
	}
	next();
}

module.exports = checkDataValidation;
