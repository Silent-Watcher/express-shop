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
			let { title: courseTitle } = await Course.findById(req.body.course, { title: 1 }).lean();
			await Episode.create({ ...req.body, courseTitle });
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
	async delete(req, res, next) {
		try {
			const { episode } = req.body;
			const { id } = req.params;
			const foundedEpisode = await Episode.findOneAndDelete({
				$and: [{ title: episode }, { _id: id }],
			});
			if (!foundedEpisode) {
				req.flash('error', `عملیات حذف دوره موفقیت آمیز نبود . لطفا مجدد تلاش کنید.`);
				return res.redirect(`/admin/courses/${req.body.courseId}/delete`);
			} else req.flash('success', 'دوره با موفقیت حذف شد');
			return res.redirect(`/admin/episodes`);
		} catch (error) {
			next(error);
		}
	}
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
	async getDeleteEpisodePage(req, res, next) {
		try {
			const title = 'پنل مدیریت | حذف جلسه';
			const episode = await Episode.findById(req.params.id).lean();
			if (!episode) {
				req.flash('error', 'آیدی جلسه نامعتبر است');
				res.redirect('/admin/episodes');
			}
			res.render('admin/episode/delete', { title, episode });
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new EpisodeController();
