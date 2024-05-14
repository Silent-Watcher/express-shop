const Controller = require('app/http/controllers/controller');
const Course = require('../../models/course.model');
class CourseController extends Controller {
	//
	async getCoursesPage(req, res, next) {
		try {
			const title = 'فروشگاه عطن | دوره ها';
			const page = req.query.page ?? 1;
			if (isNaN(page)) return this.flashAndRedirect(req, res, 'error', 'شماره صفحه نامعتبر است !', req.headers.referer);
			const courses = await Course.paginate(
				{},
				{
					limit: 4,
					page,
					sort: { createdAt: 'desc' },
					lean: true,
				}
			);
			return res.render('pages/courses/index.ejs', { courses, title });
		} catch (error) {
			next(error);
		}
	}
	//
	async getSingleCoursePage(req, res, next) {
		try {
			const { courseSlug } = req.params;
			const course = await Course.findOneAndUpdate(
				{ slug: courseSlug },
				{ $inc: { viewCount: 1 } },
				{ projection: { images: 0, slug: 0, __v: 0 } }
			)
				.populate([
					{ path: 'episodes' },
					{ path: 'user' },
					{
						path: 'comments',
						match: { parent: null, isApproved: true },
						populate: [
							{ path: 'user', select: 'name photo' },
							{
								path: 'comments',
								match: { parent: null, isApproved: true },
								populate: [{ path: 'user', select: 'name photo' }, { path: 'comments' }],
							},
						],
					},
				])
				.exec();
			// return res.json(course);
			const title = course.title;
			const canUse = await this.canUserUse(req, course);

			res.render('pages/courses/single', { title, course, canUse });
		} catch (error) {
			next(error);
		}
	}
	async canUserUse(req, course) {
		let canUse = false;
		if (req.isAuthenticated()) {
			let isVip = req.user.isVip();
			switch (course.type) {
				case 'paid':
					canUse = isVip ? true : await req.user.checkIfLearning(course);
					break;
				case 'vip':
					canUse = true;
					break;
				default:
					canUse = true;
					break;
			}
		}
		return canUse;
	}
}

module.exports = new CourseController();
