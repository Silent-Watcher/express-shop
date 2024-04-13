const path = require('path');
const uniqueString = require('unique-string');
const Controller = require('app/http/controllers/controller');
const recaptcha = require('app/config/recaptcha');
const User = require('app/models/user.model');
const PasswordReset = require('app/models/passwordReset.model');
const sendmail = require('app/config/mail/mailer');
const mailTemplate = require('app/config/mail/mail.template');

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
			const token = uniqueString();
			await PasswordReset.create({
				email: req.body.email,
				token,
				use: false,
			});
			// send mail
			const resetPassEmailMessage = `<a target='_blank' href='http://localhost:3000/auth/password/reset/${token}'>تغییر رمز عبور </a>`;
			console.log(path.join(process.cwd(), 'public', 'imgs', 'logoMail.svg'));
			sendmail(
				{
					from: 'backendwithali@gmail.com',
					to: req.body.email,
					subject: 'باز یابی رمز عبور',
					html: mailTemplate(resetPassEmailMessage),
					attachments: [
						{
							filename: 'logoMail.png',
							path: path.join(process.cwd(), 'public', 'imgs', 'logoMail.png'),
							cid: 'logo',
						},
					],
				},
				() => {
					req.flash('success', 'ایمیل بازیابی رمز عبور با موفقیت ارسال شد');
					return res.redirect('/');
				}
			);
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new ForgotPasswordController();
