const adminController = require('app/http/controllers/admin/admin.controller');
const courseController = require('app/http/controllers/admin/course.controller');
const { validateCreateCourseData } = require('app/validators/admin/course.validator');
const checkDataValidation = require('app/http/middlewares/validation.middleware');
const getOldData = require('../../http/middlewares/getOldData');
const router = require('express').Router();

router.get('/', adminController.getIndexPage);

router.get('/courses', courseController.getIndexPage);
router.get('/courses/create', courseController.getCreateCoursePage);
router.post('/courses/create', getOldData, validateCreateCourseData(), checkDataValidation, courseController.create);

module.exports = router;
