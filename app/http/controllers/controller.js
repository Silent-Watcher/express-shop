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
	//
	alert(req, options) {
		let title = options.title ?? 'عنوان';
		let message = options.message ?? '';
		let icon = options.icon ?? 'warning';
		let iconWhiteList = ['error', 'success', 'warning', 'info'];
		if (!iconWhiteList.includes(icon)) throw new Error('invalid alert icon name');
		req.flash('sweetalert', { title, message, icon });
	}
	//
	alertAndRedirect(req, res, type = 'error', message, url) {
		this.alert(req, {
			title: message,
			icon: type,
		});
		res.redirect(url);
	}
};
