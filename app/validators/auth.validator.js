const { body, param } = require('express-validator');

function validateRegisterData() {
	return [
		body('email').isEmail().normalizeEmail().withMessage('ایمیل وارد شده معتبر نیست'),
		body('password').trim().notEmpty().escape().isLength({ min: 4 }).withMessage('رمز وارد شده معتبر نیست'),
		body('passwordConfirmation')
			.custom((value, { req }) => {
				return value == req.body.password;
			})
			.withMessage('رمز عبور وارد شده تطابق ندارد'),
	];
}

function validateLoginData() {
	return [
		body('email').isEmail().withMessage('ایمیل وارد شده معتبر نیست'),
		body('password').trim().notEmpty().escape().withMessage('رمز عبور خود را وارد کنید'),
	];
}

function validateForgotPassData() {
	return [body('email').isEmail().withMessage('ایمیل وارد شده معتبر نیست')];
}

function validateResetPasswordToken() {
	return [param('token').isString().trim().notEmpty().escape().withMessage('توکن نامعتبر !')];
}

function validateResetPasswordData() {
	return [
		body('email').isEmail().withMessage('ایمیل وارد شده معتبر نیست'),
		body('token').isString().trim().notEmpty().escape().withMessage('فیلد توکن نمیتواند خالی باشد'),
		body('password').trim().notEmpty().escape().isLength({ min: 4 }).withMessage('رمز وارد شده معتبر نیست'),
		body('passwordConfirmation')
			.custom((value, { req }) => {
				return value == req.body.password;
			})
			.withMessage('رمز عبور وارد شده تطابق ندارد'),
	];
}

module.exports = {
	validateRegisterData,
	validateLoginData,
	validateForgotPassData,
	validateResetPasswordToken,
	validateResetPasswordData,
};
