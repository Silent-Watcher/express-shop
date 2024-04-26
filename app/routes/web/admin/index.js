const adminController = require('app/http/controllers/admin/admin.controller');

const router = require('express').Router();
const courseRouter = require('./course');

// fetch admin panel page
router.get('/', adminController.getIndexPage);

// admin panel courses section
router.use('/courses', courseRouter);

module.exports = router;
