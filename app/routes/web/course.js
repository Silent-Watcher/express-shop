const { param } = require('express-validator');
const courseController = require('../../http/controllers/course.controller');
const checkDataValidation = require('app/http/middlewares/validation.middleware');

const router = require('express').Router();

router.get('/', courseController.getCoursesPage);
router.get(
	'/:courseSlug',
	param('courseSlug').escape().isSlug().withMessage('فرمت slug نامعتبر است'),
	checkDataValidation,
	courseController.getSingleCoursePage
);

module.exports = router;
