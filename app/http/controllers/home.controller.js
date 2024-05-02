const homeService = require('app/http/services/home.service');
const Controller = require('app/http/controllers/controller');
const Course = require('app/models/course.model');
const recaptcha = require('app/config/recaptcha');
class HomeController extends Controller {
	#service;
	constructor() {
		super();
		this.#service = homeService;
	}
	async index(req, res, next) {
		try {
			const title = 'فروشگاه';
			const courses = await Course.find({}).lean();
			const latestCourses = await Course.find(
				{},
				{ _id: 0, __v: 0, createdAt: 0, updatedAt: 0, commentCount: 0, viewCount: 0, images: 0, user: 0, tags: 0 }
			)
				.sort({ createdAt: 'desc' })
				.limit(6)
				.lean();
			res.render('index', {
				errors: req.flash('error'),
				title,
				success: req.flash('success'),
				courses: latestCourses,
				courseCount: courses.length,
			});
		} catch (error) {
			next(error);
		}
	}
	//
	getContactUsPage(req, res, next) {
		try {
			const title = 'تماس با ما';
			res.render('pages/contactUs', { title, captcha: recaptcha.render() });
		} catch (error) {
			next(error);
		}
	}
	//
	getAboutUsPage(req, res, next) {
		try {
			const title = 'درباره ما';
			res.render('pages/aboutUs', { title });
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new HomeController();
