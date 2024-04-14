const router = require('express').Router();
const authRouter = require('./auth');
const adminRouter = require('./admin');
const homeRouter = require('./home');
const { redirectIfAuthenticate, isUserAuthenticate, checkUserIsAdmin } = require('app/http/guards/auth.guard');

// authentication routes
router.use(
	'/auth',
	redirectIfAuthenticate,
	(req, res, next) => {
		req.app.set('layout', 'layouts/auth');
		next();
	},
	authRouter
);

// admin routes
router.use(
	'/admin',
	isUserAuthenticate,
	checkUserIsAdmin,
	(req, res, next) => {
		req.app.set('layout', 'layouts/admin');
		next();
	},
	adminRouter
);

// main page routes
router.use(
	'/',
	(req, res, next) => {
		req.app.set('layout', 'layouts/layout');
		next();
	},
	homeRouter
);

module.exports = router;
