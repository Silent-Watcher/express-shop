const homeService = require('app/http/services/home.service');
const Controller = require('app/http/controllers/controller');
const Course = require('app/models/course.model');
const recaptcha = require('app/config/recaptcha');
const Comment = require('../../models/comment.model');
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
	//
	async comment(req, res, next) {
		try {
			const result = await Comment.create({ user: req.user._id, ...req.body });
			if (!result) this.flashAndRedirect(req, res, 'error', 'خطایی در ثبت نظر رخ داده است.', req.headers.referer);
			return this.flashAndRedirect(
				req,
				res,
				'success',
				'دیدگاه با موفقیت ارسال شد. بعد از تایید دیدگاه شما در سایت به نمایش  در میاید',
				req.headers.referer
			);
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new HomeController();
