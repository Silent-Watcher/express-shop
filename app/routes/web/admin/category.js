const getOldData = require('../../../http/middlewares/getOldData');
const checkDataValidation = require('../../../http/middlewares/validation.middleware');
const { param } = require('express-validator');
const categoryController = require('../../../http/controllers/admin/category.controller');
const gate = require('../../../http/guards/gate.guard');

const router = require('express').Router();

router.get('/', categoryController.getIndexPage);

router.get('/create', categoryController.getCreatePage);
router.post('/create', getOldData, categoryController.create);

router.all(
	'/:id/',
	param('id').isMongoId().withMessage('شناسه دسته بندی نادرست است'),
	checkDataValidation,
	(req, res, next) => {
		next();
	}
);

router.get('/:id/edit', categoryController.getEditPage);
router.put('/:id/edit', categoryController.edit);

router.get('/:id/delete', gate.can('delete-categories'), categoryController.getDeletePage);
router.delete('/:id/delete', categoryController.delete);

module.exports = router;
