const recaptcha = require('app/config/recaptcha');

function validateRecaptcha(req, res, next) {
	if ('g-recaptcha-response' in req.body) {
		recaptcha.verify(req, (err, data) => {
			if (!data) {
				req.flash('error', 'فیلد ریکپچا خالی است');
				return res.redirect(req.headers.referer);
			}
			if (err) {
				req.flash('error', 'خطا در ریکپچای گوگل');
				return res.redirect(req.headers.referer);
			}
			next();
		});
	}
}

module.exports = validateRecaptcha;
