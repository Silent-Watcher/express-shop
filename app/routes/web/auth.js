const authController = require('app/http/controllers/auth.controller');
const { validateRegisterData, validateLoginData } = require('app/validators/auth.validator');
const checkDataValidation = require('app/http/middlewares/validation.middleware');
const validateRecaptcha = require('app/validators/recaptcha.validator');
const { redirectIfAuthenticate, isUserAuthenticate } = require('app/http/guards/auth.guard');
const passport = require('passport');

const router = require('express').Router();

router
	.route('/register')
	.get(redirectIfAuthenticate, authController.getRegisterPage)
	.post(
		redirectIfAuthenticate,
		validateRecaptcha,
		validateRegisterData(),
		checkDataValidation,
		authController.register
	);

// google authentication
router.route('/google').get(redirectIfAuthenticate, authController.authWithGoogle);
router.get(
	'/google/callback',
	redirectIfAuthenticate,
	passport.authenticate('google', {
		successRedirect: '/',
		failureRedirect: '/auth/register',
	})
);

router
	.route('/login')
	.get(redirectIfAuthenticate, authController.getLoginPage)
	.post(redirectIfAuthenticate, validateRecaptcha, validateLoginData(), checkDataValidation, authController.login);

router.get('/logout', isUserAuthenticate, authController.logout);

module.exports = router;
