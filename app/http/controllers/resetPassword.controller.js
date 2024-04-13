const Controller = require('app/http/controllers/controller');
const recaptcha = require('app/config/recaptcha');
const PasswordReset = require('app/models/passwordReset.model');
const User = require('app/models/user.model');
const passwordUtil = require('app/utils/password.util');

class ResetPasswordController extends Controller {
	constructor() {
		super();
	}

	getResetPasswordPage(req, res, next) {
		try {
			const title = 'بازیابی رمز عبور';
			res.render('auth/password/reset', {
				errors: req.flash('error'),
				title,
				token: req.params.token,
				captcha: recaptcha.render(),
			});
		} catch (error) {
			next(error);
		}
	}
	//
	async resetPassword(req, res, next) {
		try {
			const foundedPasswordReset = await PasswordReset.findOne({
				$and: [{ email: req.body.email }, { token: req.body.token }],
			});
			if (!foundedPasswordReset) {
				req.flash('error', 'اطلاعات وارد شده نامعتبر است.');
				return res.redirect('/auth/password/reset/' + req.body.token);
			}
			const newPassword = await passwordUtil.hash(req.body.password);
			// update user password
			const user = await User.findOneAndUpdate(
				{ email: foundedPasswordReset.email },
				{ $set: { password: newPassword } }
			);
			if (!user) {
				req.flash('error', 'عملیات به روز رسانی رمز عبور انجام نشد. دوباره سعی کنید');
				return res.redirect('/auth/password/reset/' + req.body.token);
			}
			if (foundedPasswordReset.use) {
				req.flash('error', 'از این لینک برای بازیابی رمز عبور قبلا استفاده شده است');
				return res.redirect('/auth/password/reset/' + req.body.token);
			}
			foundedPasswordReset.use = true;
			await foundedPasswordReset.save();
			req.flash('success', 'رمز عبور شما با موفقیت تغییر کرد.وارد حساب خود شوید.');
			return res.redirect('/auth/login');
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new ResetPasswordController();
