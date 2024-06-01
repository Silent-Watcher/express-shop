const { body } = require('express-validator');
function validateUserInfoData() {
	return [
		body('firstName').optional().escape().trim(),
		body('lastName').optional().escape().trim(),
		body('phone').optional(),
	];
}

module.exports = { validateUserInfoData };
