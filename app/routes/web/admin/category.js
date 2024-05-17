const checkDataValidation = require('../../../http/middlewares/validation.middleware');
const { param } = require('express-validator');
const categoryController = require('../../../http/controllers/admin/category.controller');

const router = require('express').Router();

router.get('/', categoryController.getIndexPage);

router.get('/create', categoryController.getCreatePage);
router.post('/create', categoryController.create);

router.all(
	'/:id/',
	param('id').isMongoId().withMessage('شناسه دسته بندی نادرست است'),
	checkDataValidation,
	(req, res, next) => {
		next();
	}
);

router.get('/:id/edit', categoryController.getEditPage);

module.exports = router;
