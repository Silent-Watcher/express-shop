const adminController = require('app/http/controllers/admin/admin.controller');
const uploadImage = require('app/config/imageUploader');
const router = require('express').Router();
const courseRouter = require('./course');
const episodeRouter = require('./episode');
const ticketRouter = require('./ticket');
const commentRouter = require('./comment');
const categoryRouter = require('./category');
const settingRouter = require('./setting');
const validateImageSize = require('../../../validators/imageSize.validator');
const userRouter = require('./user');
const permissionRouter = require('./permission');

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

// admin panel tickets section
router.use('/tickets', ticketRouter);

// admin panel users section
router.use('/users', userRouter);

// admin panel permissions section
router.use('/users/permissions', permissionRouter);

module.exports = router;
