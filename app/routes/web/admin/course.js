const router = require('express').Router();
const courseController = require('app/http/controllers/admin/course.controller');
const { validateCreateCourseData, validateEditCourseData } = require('app/validators/admin/course.validator');
const checkDataValidation = require('app/http/middlewares/validation.middleware');
const getOldData = require('app/http/middlewares/getOldData');
const { param, body } = require('express-validator');
const uploadImage = require('app/config/imageUploader');
const validateImageSize = require('../../../validators/imageSize.validator');

// ========== COURSES PATHS ================
// COURSE INDEX PAGE
router.get('/', checkDataValidation, courseController.getIndexPage);
// CREATE COURSES
router.get('/create', courseController.getCreateCoursePage);
router.post(
	'/create',
	uploadImage.single('image'),
	validateImageSize,
	getOldData,
	validateCreateCourseData(),
	checkDataValidation,
	courseController.create
);
// EDIT COURSES
router.get(
	'/:id/edit',
	param('id').isMongoId().withMessage('شناسه دوره نامعتبر است'),
	checkDataValidation,
	courseController.getEditCoursePage
);
router.put(
	'/:id/edit',
	uploadImage.single('image'),
	validateImageSize,
	getOldData,
	validateEditCourseData(),
	checkDataValidation,
	courseController.edit
);
// DELETE COURSES
router.get(
	'/:id/delete',
	param('id').isMongoId().withMessage('شناسه دوره نامعتبر است'),
	checkDataValidation,
	courseController.getDeleteCoursePage
);
router.delete(
	'/:id/delete',
	param('id').isMongoId().withMessage('شناسه دوره نامعتبر است'),
	body('course').isString().trim().escape().withMessage('نام دوره نامعتبر است'),
	checkDataValidation,
	courseController.delete
);
// =================================

module.exports = router;
