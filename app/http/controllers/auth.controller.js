const Controller = require('app/http/controllers/controller');

const passport = require('passport');

const authService = require('app/http/services/auth.service');
const recaptcha = require('app/config/recaptcha');
const setRememberToken = require('app/utils/token.util');

class AuthController extends Controller {
	#service;
	constructor() {
		super();
		this.#service = authService;
	}

	register(req, res, next) {
		try {
			passport.authenticate('local.register', {
				successRedirect: '/',
				failureRedirect: '/auth/register',
				failureFlash: true,
			})(req, res, next);
		} catch (error) {
			next(error);
		}
	}
	login(req, res, next) {
		try {
			passport.authenticate('local.login', (err, user) => {
				if (!user) return res.redirect('/auth/login');
				req.login(user, async err => {
					if (err) return next(err);
					if (req.body.remember == 'true') await setRememberToken(res, user);
					res.locals = { user: req.user };
					return res.redirect('/');
				});
			})(req, res, next);
		} catch (error) {
			next(error);
		}
	}

	logout(req, res, next) {
		req.logout(err => {
			if (err) return next(err);
			else {
				res.clearCookie('remember_token');
				res.redirect('/');
			}
		});
	}

	getRegisterPage(req, res, next) {
		try {
			res.render('auth/register', {
				messages: req.flash('error'),
				captcha: recaptcha.render(),
			});
		} catch (error) {
			next(error);
		}
	}
	getLoginPage(req, res, next) {
		try {
			res.render('auth/login', {
				messages: req.flash('error'),
				captcha: recaptcha.render(),
			});
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new AuthController();
