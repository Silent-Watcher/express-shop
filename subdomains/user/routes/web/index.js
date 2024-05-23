const panelController = require('../../../../app/http/controllers/panel.controller');

const router = require('express').Router();

router.get(
	'/',
	(req, res, next) => {
		req.app.set('layout', 'layouts/layout');
		console.log(req.signedCookies);
		console.log(req.cookies);
		next();
	},
	panelController.getIndexPage
);

module.exports = router;
