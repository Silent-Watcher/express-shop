const { param, query } = require('express-validator');
const courseController = require('../../http/controllers/course.controller');
const checkDataValidation = require('app/http/middlewares/validation.middleware');
const { isUserAuthenticate } = require('app/http/guards/auth.guard');

const router = require('express').Router();
// courses page
router.get('/', query('s').escape(), courseController.getCoursesPage);
// single course page
router.get(
	'/:courseSlug',
	param('courseSlug').escape().isSlug().withMessage('فرمت slug نامعتبر است'),
	checkDataValidation,
	courseController.getSingleCoursePage
);
// like a single course
router.post(
	'/:courseId/like',
	isUserAuthenticate,
	param('courseId').isMongoId(),
	checkDataValidation,
	(req, res, next) => {
		res.locals.user = req.user;
		next();
	},
	courseController.like
);
//
module.exports = router;
