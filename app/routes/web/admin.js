const adminController = require('app/http/controllers/admin/admin.controller');
const courseController = require('app/http/controllers/admin/course.controller');
const router = require('express').Router();

router.get('/', adminController.getIndexPage);

router.get('/courses', courseController.getIndexPage);
router.get('/courses/create', courseController.getCreateCoursePage);

module.exports = router;
