const { body } = require('express-validator');

function validateRegisterData() {
	return [
		body('email').trim().isEmail().normalizeEmail().withMessage('ایمیل وارد شده معتبر نیست'),
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
		body('email').trim().isEmail().withMessage('ایمیل وارد شده معتبر نیست'),
		body('password').trim().notEmpty().escape().withMessage('رمز عبور خود را وارد کنید'),
	];
}

module.exports = { validateRegisterData, validateLoginData };
