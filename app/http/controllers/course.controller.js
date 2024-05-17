const httpStatus = require('http-status');

const Controller = require('app/http/controllers/controller');
const Course = require('../../models/course.model');
const User = require('../../models/user.model');
const Rating = require('../../models/rating.model');
class CourseController extends Controller {
	//
	async getCoursesPage(req, res, next) {
		try {
			const title = 'فروشگاه عطن | دوره ها';
			const page = req.query.page ?? 1;
			if (isNaN(page)) return this.flashAndRedirect(req, res, 'error', 'شماره صفحه نامعتبر است !', req.headers.referer);
			const { s: search = null, type = 'paid', sort = 'newest' } = req.query;
			let query = {};

			if (search) query.title = new RegExp(search, 'gi');
			if (type != 'all') query.type = type;

			const courses = await Course.paginate(
				{ ...query },
				{
					limit: 6,
					page,
					sort: { createdAt: sort == 'newest' ? 'desc' : 'asc' },
					lean: true,
				}
			);
			return res.render('pages/courses/index.ejs', { courses, title, searchedValue: search, sort, type });
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
					{ path: 'ratings', select: 'user value' },
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
			const canRate = await this.canUserRate(req, course);
			const rateInfo = { total: course.ratings.length, score: course.score };
			res.render('pages/courses/single', { title, course, canUse, canRate, rateInfo });
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
	//
	async canUserRate(req, course) {
		let canRate = false;
		if (this.canUserUse(req, course)) {
			if (course.ratings.length <= 0) return (canRate = true);
			course.ratings.forEach(rating => {
				if (rating.user.equals(req.user._id)) return (canRate = false);
				else return (canRate = true);
			});
		}
		return canRate;
	}
	//
	async like(req, res, next) {
		try {
			const { courseId } = req.params;
			const course = await Course.findById(courseId, { likeCount: 1, _id: 1 });
			if (!course) res.json({ status: 400, message: 'شناسه دوره نامعتبر است' });
			const user = await User.findById(req.user.id);

			const likedIndex = user.likedCourses.indexOf(courseId);

			if (likedIndex == -1) {
				// User has not liked the course, add like
				user.likedCourses.push(courseId);
				await course.inc('likeCount', 1);
			} else {
				// User has already liked the course, remove like
				user.likedCourses.splice(likedIndex, 1);
				await course.inc('likeCount', -1);
			}
			await user.save();
			return res.json({
				status: res.statusCode,
				likeStatus: likedIndex == -1 ? 'liked' : 'unLiked',
				likesCount: course.likeCount,
			});
		} catch (error) {
			next(error);
		}
	}
	//
	async rate(req, res, next) {
		try {
			const { courseId } = req.params;
			const course = await Course.findById(courseId).populate({ path: 'ratings' });
			const canRate = await this.canUserRate(req, course);
			if (!canRate) return res.json({ status: httpStatus.BAD_REQUEST });
			if (!course) return res.json({ status: 400, message: 'شناسه دوره نامعتبر است' });
			const { value } = req.body;
			const user = await User.findById(req.user.id);
			const rate = await Rating.create({ user, course, value });
			if (!rate) return res.json({ status: httpStatus.BAD_REQUEST, message: 'خطا در ثبت امتیاز. لطفا مجدد تلاش کنید' });
			await course.updateScore(value, course.ratings.length + 1);
			return res.json({
				status: httpStatus.OK,
				score: course.score,
				totalRates: course.ratings.length + 1,
			});
		} catch (error) {
			next(error);
		}
	}
	//
}

module.exports = new CourseController();
