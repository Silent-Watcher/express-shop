const roleController = require('../../../http/controllers/admin/role.controller');
const checkDataValidation = require('app/http/middlewares/validation.middleware');
const getOldData = require('app/http/middlewares/getOldData');
const {
	validateNewRoleData,
	validateEditRoleData,
	validateDeleteRoleData,
} = require('../../../validators/role.validator');
const { param } = require('express-validator');

const router = require('express').Router();

router.get('/', roleController.getIndexPage);

router.get('/new', roleController.getCreateNewPage);
router.post('/new', getOldData, validateNewRoleData(), checkDataValidation, roleController.new);

router.get(
	'/:id/edit',
	param('id').isMongoId().withMessage('شناسه نقش کاربری نامعتبر است'),
	checkDataValidation,
	roleController.getEditPage
);
router.put('/:id/edit', getOldData, validateEditRoleData(), checkDataValidation, roleController.edit);

router.get(
	'/:id/delete',
	param('id').isMongoId().withMessage('شناسه اجازه دسترسی نامعتبر است'),
	checkDataValidation,
	roleController.getDeletePage
);
router.delete('/:id/delete', getOldData, validateDeleteRoleData(), checkDataValidation, roleController.delete);

module.exports = router;
