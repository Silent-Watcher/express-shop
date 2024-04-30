const homeService = require('app/http/services/home.service');
const Controller = require('app/http/controllers/controller');
const Course = require('app/models/course.model');
class HomeController extends Controller {
	#service;
	constructor() {
		super();
		this.#service = homeService;
	}
	async index(req, res, next) {
		try {
			const courses = await Course.paginate({}, { lean: true, limit: 4, sort: { createdAt: 'desc' } });
			const title = 'فروشگاه';
			res.render('index', {
				errors: req.flash('error'),
				title,
				success: req.flash('success'),
				courseCount: courses.totalDocs - 1,
				latestCourses: courses.docs,
			});
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new HomeController();
