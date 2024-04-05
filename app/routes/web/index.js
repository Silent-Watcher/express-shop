const router = require('express').Router();
const authRouter = require('./auth');
const adminRouter = require('./admin');
const homeRouter = require('./home');

router.use(
	'/auth',
	(req, res, next) => {
		req.app.set('layout', 'layouts/auth');
		next();
	},
	authRouter
);
router.use('/admin', adminRouter);
router.use(
	'/',
	(req, res, next) => {
		req.app.set('layout', 'layouts/layout');
		next();
	},
	homeRouter
);

module.exports = router;
