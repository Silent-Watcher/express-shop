const { body } = require('express-validator');
function validateComment() {
	return [body('comment').isString().escape().not().isEmpty().withMessage('کامنت وارد شده هیچ مقداری ندارد')];
}

module.exports = validateComment;
