const permissionController = require('../../../http/controllers/admin/permission.controller');
const {
	validateNewPermissionData,
	validateEditPermissionData,
	validateDeletePermissionData,
} = require('../../../validators/permission.validator');
const checkDataValidation = require('app/http/middlewares/validation.middleware');
const getOldData = require('app/http/middlewares/getOldData');
const { param } = require('express-validator');

const router = require('express').Router();

router.get('/', permissionController.getIndexPage);

router.get('/new', permissionController.getCreateNewPage);
router.post('/new', getOldData, validateNewPermissionData(), checkDataValidation, permissionController.new);

router.get(
	'/:id/edit',
	param('id').isMongoId().withMessage('شناسه اجازه دسترسی نامعتبر است'),
	checkDataValidation,
	permissionController.getEditPage
);
router.put('/:id/edit', getOldData, validateEditPermissionData(), checkDataValidation, permissionController.edit);

router.get(
	'/:id/delete',
	param('id').isMongoId().withMessage('شناسه اجازه دسترسی نامعتبر است'),
	checkDataValidation,
	permissionController.getDeletePage
);
router.delete(
	'/:id/delete',
	getOldData,
	validateDeletePermissionData(),
	checkDataValidation,
	permissionController.delete
);

module.exports = router;
