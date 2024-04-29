const httpErrors = require('http-errors');

const Controller = require('app/http/controllers/controller');
const Episode = require('../../../models/episode.model');
const Course = require('../../../models/course.model');
class EpisodeController extends Controller {
	constructor() {
		super();
	}
	//
	async create(req, res, next) {
		try {
			let { title: courseTitle } = await Course.findById(req.body.course);
			await Episode.create({ ...req.body });
			return this.flashAndRedirect(
				req,
				res,
				'success',
				`جلسه ${req.body.title} به دوره ${courseTitle} با موفقیت اضافه شد`,
				'/admin/episodes'
			);
		} catch (error) {
			next({ status: 500, message: `something went wrong !`, stack: error.stack });
		}
	}
	//
	// async edit(req, res, next) {
	// 	try {
	// 	} catch (error) {}
	// }
	//
	// async delete(req, res, next) {
	// 	try {
	// 	} catch (error) {}
	// }
	//
	async getIndexPage(req, res, next) {
		try {
			let page = req.query.page ?? 1;
			const title = 'پنل مدیریت | ویدیو ها';
			const episodes = await Episode.paginate({}, { limit: 4, page, sort: { createdAt: 'desc' }, lean: true });
			if (isNaN(page)) {
				req.flash('شماره صفحه نامعتبر است');
				return res.redirect('/admin/episodes/');
			}
			return res.render('admin/episode/index', { title, episodes });
		} catch (error) {
			next(new httpErrors.InternalServerError('بارگذاری صفحه ویدیو ها با مشکل مواجه شد'));
		}
	}
	//
	async getCreateEpisodePage(req, res, next) {
		try {
			const title = 'پنل مدیریت | جلسه جدید';
			const courses = await Course.find({}, { title: 1, slug: 1 }).lean();
			return res.render('admin/episode/create', { title, courses });
		} catch (error) {
			next(new httpErrors.InternalServerError('بارگذاری صفحه ایجاد ویدیو ها با مشکل مواجه شد'));
		}
	}
	//
	// async getEditCoursePage(req, res, next) {
	// 	try {
	// 	} catch (error) {}
	// }
	//
	// async getDeleteCoursePage(req, res, next) {
	// 	try {
	// 	} catch (error) {}
	// }
}

module.exports = new EpisodeController();