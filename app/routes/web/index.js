const router = require('express').Router();
const authRouter = require('./auth');
const adminRouter = require('./admin');
const homeRouter = require('./home');
const courseRouter = require('./course');
const episodeRouter = require('./episode');
const { redirectIfAuthenticate, isUserAuthenticate, checkUserIsAdmin } = require('app/http/guards/auth.guard');
const { PORT } = require('app/common/globals');
const date = require('../../helpers/date/convertToJalali');
const User = require('../../models/user.model');

// main page routes
router.use(
	'/',
	async (req, res, next) => {
		req.app.set('layout', 'layouts/layout');
		res.locals.old = req.flash('formData')[0];
		res.locals.isAuthenticated = req.isAuthenticated();
		res.locals.errors = req.flash('error');
		res.locals.success = req.flash('success');
		res.locals.breadcrumbs = req.breadcrumbs;
		res.locals.url = `${req.protocol}://${req.hostname}:${PORT}${req.url}`;
		res.locals.title = 'فروشگاه عطن';
		res.locals.date = date;
		if (req.isAuthenticated()) {
			let user = await User.findById(req.user._id, { password: 0, rememberToken: 0 }).populate({
				path: 'cartItems',
				select: 'title price slug thumbnail _id',
			});
			res.locals.user = user;
		}
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

// courses routes
router.use('/courses', courseRouter);
//  episodes routes
router.use('/episodes', episodeRouter);

module.exports = router;
