const userController = require('../../../http/controllers/admin/user.controller');

const router = require('express').Router();

router.get('/', userController.getIndexPage);

module.exports = router;
