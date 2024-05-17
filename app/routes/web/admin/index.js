const adminController = require('app/http/controllers/admin/admin.controller');

const router = require('express').Router();
const courseRouter = require('./course');
const episodeRouter = require('./episode');
const commentRouter = require('./comment');
const categoryRouter = require('./category');

// fetch admin panel page
router.get('/', adminController.getIndexPage);

// admin panel courses section
router.use('/courses', courseRouter);

// admin panel episodes section
router.use('/episodes', episodeRouter);

// admin panel comments section
router.use('/comments', commentRouter);

// admin panel category section
router.use('/categories', categoryRouter);

module.exports = router;
