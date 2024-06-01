const router = require('express').Router();
const authRouter = require('./auth');
const adminRouter = require('./admin');
const homeRouter = require('./home');
const courseRouter = require('./course');
const episodeRouter = require('./episode');
const panelRouter = require('./panel');
const { redirectIfAuthenticate, isUserAuthenticate, checkUserIsAdmin } = require('app/http/guards/auth.guard');
const { PORT } = require('app/common/globals');
const date = require('app/helpers/date/convertToJalali');
const User = require('app/models/user.model');

// main page routes
router.use(
	'/',
	async (req, res, next) => {
		req.app.set('layout', 'layouts/layout');
		res.locals.old = req.flash('formData')[0];
		res.locals.isAuthenticated = req.isAuthenticated();
		res.locals.errors = req.flash('error');
		res.locals.success = req.flash('success');
		res.locals.alert = req.flash('sweetalert');
		res.locals.breadcrumbs = req.breadcrumbs;
		res.locals.url = `${req.protocol}://${req.hostname}:${PORT}${req.url}`;
		res.locals.urlPath = req.url;
		res.locals.title = 'فروشگاه عطن';
		res.locals.date = date;
		if (req.isAuthenticated()) {
			let user = await User.findById(req.user._id, {
				cartItems: 1,
				firstName: 1,
				lastName: 1,
				email: 1,
				avatar: 1,
				photos: 1,
				phone: 1,
				admin: 1,
				likedCourses: 1,
			}).populate({
				path: 'cartItems',
				select: 'title price slug thumbnail _id',
			});
			let totalCost = 0;
			if (user?.cartItems.length > 0) {
				user.cartItems.forEach(item => {
					totalCost += item.price;
				});
			}
			res.locals.totalCost = totalCost;
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
		res.locals.admin = req.user;
		res.locals.title = 'پنل مدیریت';
		next();
	},
	adminRouter
);

// courses routes
router.use('/courses', courseRouter);
// episodes routes
router.use('/episodes', episodeRouter);

// user panel routes
router.use('/me', isUserAuthenticate, panelRouter);

module.exports = router;
