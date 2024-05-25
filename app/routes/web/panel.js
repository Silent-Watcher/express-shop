const router = require('express').Router();
const panelController = require('../../http/controllers/panel.controller');

router.use((req, res, next) => {
	req.app.set('layout', 'layouts/panel');
	next();
});

router.get('/', panelController.getIndexPage);

module.exports = router;