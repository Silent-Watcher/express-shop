const uniqueString = require('unique-string');
const Controller = require('app/http/controllers/controller');
const recaptcha = require('app/config/recaptcha');
const User = require('app/models/user.model');
const PasswordReset = require('../../models/passwordReset.model');

class ForgotPasswordController extends Controller {
	constructor() {
		super();
	}
	//--------------------------
	getForgotPasswordPage(req, res, next) {
		try {
			const title = 'فراموشی رمز عبور';
			res.render('auth/password/email', { errors: req.flash('error'), title, captcha: recaptcha.render() });
		} catch (error) {
			next(error);
		}
	}
	//--------------------------
	async sendForgotPasswordLink(req, res, next) {
		try {
			const foundedUser = await User.findOne({ email: req.body.email });
			if (!foundedUser) {
				req.flash('error', 'کاربری با این آدرس ایمیل یافت نشد!');
				return res.redirect(req.headers.referer);
			}

			await PasswordReset.create({
				email: req.body.email,
				token: uniqueString(),
				use: false,
			});
			return res.redirect('/');
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new ForgotPasswordController();
