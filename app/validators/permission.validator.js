const { body, param } = require('express-validator');
const Permission = require('../models/permission.model');

function validateNewPermissionData() {
	return [
		body('name')
			.trim()
			.escape()
			.isString()
			.isLength({ min: 3 })
			.withMessage('نام اجازه دسترسی نمیتواند کم تر از 3 حرف باشد'),
		body('label')
			.trim()
			.escape()
			.isString()
			.isLength({ min: 3 })
			.withMessage('توضیح اجازه دسترسی نمیتواند کم تر از 3 حرف باشد'),
	];
}

function validateEditPermissionData() {
	return [
		body('name')
			.trim()
			.escape()
			.isString()
			.isLength({ min: 3 })
			.withMessage('نام اجازه دسترسی نمیتواند کم تر از 3 حرف باشد'),
		body('label')
			.trim()
			.escape()
			.isString()
			.isLength({ min: 3 })
			.withMessage('توضیح اجازه دسترسی نمیتواند کم تر از 3 حرف باشد'),
		param('id').isMongoId().withMessage('شناسه اجازه دسترسی نامعتبر است'),
		body('id')
			.custom((value, { req }) => {
				return req.query._method == 'PUT';
			})
			.withMessage('متد ارسال شده در فرم نامعتبر است'),
		body('id')
			.custom(async value => {
				const foundedPermission = await Permission.findById(value, { _id: 1 }).lean();
				return foundedPermission;
			})
			.withMessage('اجازه دسترسی با این شناسه یافت نشد'),
	];
}

function validateDeletePermissionData() {
	return [];
}

module.exports = { validateNewPermissionData, validateEditPermissionData, validateDeletePermissionData };
