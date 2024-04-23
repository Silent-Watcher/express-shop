const router = require('express').Router();
const authRouter = require('./auth');
const adminRouter = require('./admin');
const homeRouter = require('./home');
const { redirectIfAuthenticate, isUserAuthenticate, checkUserIsAdmin } = require('app/http/guards/auth.guard');

// main page routes
router.use(
	'/',
	(req, res, next) => {
		req.app.set('layout', 'layouts/layout');
		res.locals.old = req.flash('formData')[0];
		res.locals.errors = req.flash('error');
		res.locals.success = req.flash('success');
		res.locals.title = 'فروشگاه عطن';
		next();
	},
	homeRouter
);

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
		res.locals.user = req.user;
		res.locals.title = 'پنل مدیریت';
		next();
	},
	adminRouter
);

module.exports = router;
