const recaptcha = require('app/config/recaptcha');

function validateRecaptcha(req, res, next) {
	if ('g-recaptcha-response' in req.body) {
		recaptcha.verify(req, (err, data) => {
			if (!data) {
				req.flash(
					'error',
					'گزینه امنیتی مربوط به شناسایی ربات خاموش است. لطفا از فعال بودن آن اطمینان حاصل نمایید و مجدد امتحان کنید.'
				);
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
