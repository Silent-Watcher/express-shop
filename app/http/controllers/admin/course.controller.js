const Controller = require('app/http/controllers/controller');

class CourseController extends Controller {
	constructor() {
		super();
	}
	//
	getIndexPage(req, res, next) {
		try {
			res.render('admin/course/index', { title: 'پنل مدیریت | دوره ها' });
		} catch (error) {
			next(error);
		}
	}
	//
	create(req, res, next) {
		try {
			// creating a new course
		} catch (error) {
			next(error);
		}
	}
	//
	getCreateCoursePage(req, res, next) {
		try {
			res.render('admin/course/create', { title: 'پنل مدیریت | ایجاد دوره' });
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new CourseController();
