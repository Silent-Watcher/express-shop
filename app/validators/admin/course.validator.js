const { body } = require('express-validator');
const isNumeric = require('app/helpers/math/isNumeric');
const Course = require('../../models/course.model');

function validateCreateCourseData() {
	return [
		body('title').isString().trim().not().isEmpty().escape().withMessage('عنوان دوره نامعتبر است.'),
		body('title')
			.isString()
			.escape()
			.custom(async value => {
				const foundedTitle = await Course.findOne({ title: value }, { title: 1 }).lean();
				if (foundedTitle) throw new Error('چنین دوره ای با این عنوان قبلا در سایت قرار داده شده است.');
			}),
		body('type')
			.custom(value => {
				let typeWhiteList = ['vip', 'free', 'paid'];
				return typeWhiteList.includes(value);
			})
			.withMessage('نوع دوره نامعتبر است'),
		body('description').isString().trim().escape().withMessage('متن توضیحات دوره معتبر نیست'),
		body('price')
			.custom((value, { req }) => {
				if ('free' == req.body.type) return value == 0;
				else return value != 0;
			})
			.withMessage('قیمت دوره رایگان باید صفر باشد'),
		body('price')
			.custom(value => {
				return isNumeric(value);
			})
			.withMessage('قیمت دوره باید یک مقدار عددی باشد'),
		body('slug')
			.trim()
			.escape()
			.custom(async value => {
				const foundedSlug = await Course.findOne({ slug: value }, { title: 1 }).lean();
				if (foundedSlug) throw new Error('این slug قبلا تعریف شده است');
			}),
		body('user').isMongoId().withMessage('آیدی ایجاد کننده دوره نامعتبر است'),
	];
}
function validateEditCourseData() {
	return [
		body('title').isString().trim().not().isEmpty().escape().withMessage('عنوان دوره نامعتبر است.'),
		body('title')
			.isString()
			.escape()
			.custom(async (value, { req }) => {
				const foundedCourse = await Course.findOne(
					{ title: value, _id: { $ne: req.body.courseId } },
					{ title: 1 }
				).lean();
				if (foundedCourse) throw new Error('چنین دوره ای با این عنوان قبلا در سایت قرار داده شده است.');
			}),
		body('type')
			.custom(value => {
				let typeWhiteList = ['vip', 'free', 'paid'];
				return typeWhiteList.includes(value);
			})
			.withMessage('نوع دوره نامعتبر است'),
		body('description').isString().trim().escape().withMessage('متن توضیحات دوره معتبر نیست'),
		body('price')
			.custom(value => {
				return isNumeric(value);
			})
			.withMessage('قیمت دوره باید یک مقدار عددی باشد'),
		body('price')
			.custom((value, { req }) => {
				if ('free' == req.body.type) return value == 0;
				else return value != 0;
			})
			.withMessage('قیمت دوره با نوع دوره تطابق ندارد'),
		body('courseId').isMongoId().withMessage('آیدی ایجاد کننده دوره نامعتبر است'),
		body('slug')
			.trim()
			.escape()
			.custom(async (value, { req }) => {
				const foundedSlug = await Course.findOne({ slug: value, _id: { $ne: req.body.courseId } }, { title: 1 }).lean();
				if (foundedSlug) throw new Error('این slug قبلا تعریف شده است');
			}),
		body('user').isMongoId().withMessage('آیدی ایجاد کننده دوره نامعتبر است'),
	];
}

module.exports = {
	validateCreateCourseData,
	validateEditCourseData,
};
