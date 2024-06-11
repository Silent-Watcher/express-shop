const i18N = require('i18n');

const detectLanguage = (req, res, next) => {
	try {
		let lang = req.signedCookies.lang;
		if (i18N.getLocales().includes(lang)) {
			req.setLocale(lang);
		} else {
			req.setLocale(i18N.getLocale(req));
		}
		next();
	} catch (error) {
		next(error);
	}
};

module.exports = detectLanguage;
