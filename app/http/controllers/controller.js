const autoBind = require('auto-bind');
module.exports = class Controller {
	constructor() {
		autoBind(this);
	}
	//
	flashAndRedirect(req, res, type = 'success', message, url) {
		req.flash(type, message);
		res.redirect(url);
	}
};
