const authController = require('app/http/controllers/auth/auth.controller');
const {
	validateRegisterData,
	validateLoginData,
	validateForgotPassData,
	validateResetPasswordData,
} = require('app/validators/auth.validator');
const checkDataValidation = require('app/http/middlewares/validation.middleware');
const validateRecaptcha = require('app/validators/recaptcha.validator');
const passport = require('passport');
const forgotPasswordController = require('app/http/controllers/auth/forgotPassword.controller');
const resetPasswordController = require('app/http/controllers/auth/resetPassword.controller');

const router = require('express').Router();

// register
router
	.route('/register')
	.get(authController.getRegisterPage)
	.post(validateRecaptcha, validateRegisterData(), checkDataValidation, authController.register);

// login
router
	.route('/login')
	.get(authController.getLoginPage)
	.post(validateRecaptcha, validateLoginData(), checkDataValidation, authController.login);

// google authentication
router.route('/google').get(authController.authWithGoogle);
router.get(
	'/google/callback',

	passport.authenticate('google', {
		successRedirect: '/',
		failureRedirect: '/auth/register',
	})
);

// forgot password
router.get('/password/reset', forgotPasswordController.getForgotPasswordPage);
router.get('/password/reset/:token', resetPasswordController.getResetPasswordPage);
router.post(
	'/password/reset',
	validateRecaptcha,
	validateResetPasswordData(),
	checkDataValidation,
	resetPasswordController.resetPassword
);
router.post(
	'/password/email',
	validateRecaptcha,
	validateForgotPassData(),
	checkDataValidation,
	forgotPasswordController.sendForgotPasswordLink
);

module.exports = router;
