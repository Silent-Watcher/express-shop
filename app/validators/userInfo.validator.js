const { body } = require('express-validator');
function validateUserInfoData() {
	return [
		body('firstName').optional().escape().trim(),
		body('lastName').optional().escape().trim(),
		body('phone').isMobilePhone('fa-IR').withMessage('شماره تماس وارد شده معتبر نیست'),
	];
}

module.exports = { validateUserInfoData };
