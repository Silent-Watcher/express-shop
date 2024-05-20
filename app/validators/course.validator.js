const { query } = require('express-validator');
function validateCourseQueries() {
	return [
		query('s').escape().optional(),
		query('type')
			.escape()
			.optional()
			.custom(value => {
				const whiteList = ['free', 'paid', 'vip'];
				return whiteList.includes(value);
			})
			.withMessage('پارامتر جست و جو نادرست است'),
		query('sort')
			.optional()
			.escape()
			.custom(value => {
				const whiteList = ['newest', 'oldest'];
				return whiteList.includes(value);
			})
			.withMessage('پارامتر جست و جو نادرست است'),
		query('category').escape().optional(),
	];
}

module.exports = { validateCourseQueries };
