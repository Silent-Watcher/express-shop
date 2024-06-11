const router = require('express').Router();
const { param } = require('express-validator');
const commentController = require('../../../http/controllers/admin/comment.controller');
const checkDataValidation = require('../../../http/middlewares/validation.middleware');
const gate = require('../../../http/guards/gate.guard');

router.get('/', gate.can('show-comments'), commentController.getIndexPage);

router.all(
	'/:id/',
	param('id').isMongoId().withMessage('شناسه دیدگاه نادرست است'),
	checkDataValidation,
	(req, res, next) => {
		next();
	}
);

router.get('/:id/delete', gate.can('delete-comments'), commentController.getDeletePage);
router.post('/:id/delete', commentController.delete);

router.get('/:id/edit', gate.can('edit-comments'), commentController.getEditPage);
router.put('/:id/edit', commentController.edit);

module.exports = router;
