const adminController = require('app/http/controllers/admin/admin.controller');
const uploadImage = require('app/config/imageUploader');
const router = require('express').Router();
const courseRouter = require('./course');
const episodeRouter = require('./episode');
const commentRouter = require('./comment');
const categoryRouter = require('./category');
const settingRouter = require('./setting');
const validateImageSize = require('../../../validators/imageSize.validator');

// fetch admin panel page
router.get('/', adminController.getIndexPage);

// upload images from editor
router.post('/upload-image', uploadImage.single('upload'), validateImageSize, adminController.uploadImage);

// admin panel courses section
router.use('/courses', courseRouter);

// admin panel episodes section
router.use('/episodes', episodeRouter);

// admin panel comments section
router.use('/comments', commentRouter);

// admin panel category section
router.use('/categories', categoryRouter);

// admin panel setting section
router.use('/settings', settingRouter);

module.exports = router;
