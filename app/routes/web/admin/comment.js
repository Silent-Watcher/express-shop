const router = require('express').Router();
const commentController = require('../../../http/controllers/admin/comment.controller');

router.get('/', commentController.getIndexPage);

router.get('/:id/delete', commentController.getDeletePage);
router.post('/:id/delete', commentController.delete);

router.get('/:id/edit', commentController.getEditPage);
router.put('/:id/edit', commentController.edit);

module.exports = router;
