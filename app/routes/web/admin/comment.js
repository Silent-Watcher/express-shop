const router = require('express').Router();
const { param } = require('express-validator');
const commentController = require('../../../http/controllers/admin/comment.controller');
const checkDataValidation = require('../../../http/middlewares/validation.middleware');

router.get('/', commentController.getIndexPage);

router.all(
	'/:id/',
	param('id').isMongoId().withMessage('شناسه دیدگاه نادرست است'),
	checkDataValidation,
	(req, res, next) => {
		next();
	}
);

router.get('/:id/delete', commentController.getDeletePage);
router.post('/:id/delete', commentController.delete);

router.get('/:id/edit', commentController.getEditPage);
router.put('/:id/edit', commentController.edit);

module.exports = router;
