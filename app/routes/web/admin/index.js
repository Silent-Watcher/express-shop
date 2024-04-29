const adminController = require('app/http/controllers/admin/admin.controller');

const router = require('express').Router();
const courseRouter = require('./course');
const episodeRouter = require('./episode');

// fetch admin panel page
router.get('/', adminController.getIndexPage);

// admin panel courses section
router.use('/courses', courseRouter);

// admin panel episodes section
router.use('/episodes', episodeRouter);

module.exports = router;
