const slugify = require('slugify');
const Controller = require('app/http/controllers/controller');
const Course = require('app/models/course.model');
const { DEFAULT_THUMBNAIL } = require('app/common/globals');
const imageHelper = require('app/helpers/image.helper');
const Category = require('../../../models/category.model');

class CourseController extends Controller {
	constructor() {
		super();
	}
	//
	async create(req, res, next) {
		try {
			const { title, type, slug, description, price, tags } = req.body;
			const image = req?.file;
			let imageAddrs = [];
			if (image) imageAddrs = Object.values(imageHelper.resizeImage(image.path));
			await Course.create({
				title,
				type,
				slug: slugify(slug, { lower: true, replacement: '-' }),
				description,
				user: req.user._id,
				images: imageAddrs ?? [],
				thumbnail: imageAddrs.find(imageAddr => imageAddr.size == 'original') ?? DEFAULT_THUMBNAIL,
				price,
				tags,
			});
			return this.flashAndRedirect(req, res, 'success', `دوره ${title} با موفقیت ایجاد شد`, '/admin/courses');
		} catch (error) {
			next({ status: 500, message: `something went wrong !`, stack: error.stack });
		}
	}
	//
	async edit(req, res, next) {
		try {
			const { useDefaultImage } = req.body;
			const foundedCourse = await Course.findById(req.body.courseId);
			let thumbnail = foundedCourse?.thumbnail ?? DEFAULT_THUMBNAIL;
			let imageAddrs = null;

			if (useDefaultImage == 'true') {
				imageAddrs = [];
				thumbnail = DEFAULT_THUMBNAIL;
				await imageHelper.removeImages(foundedCourse.images);
			} else {
				const image = req?.file;
				if (!foundedCourse) {
					return this.flashAndRedirect(
						req,
						res,
						'error',
						'شناسه دوره نامعتبر است',
						`/admin/courses/${req.body.courseId}/edit`
					);
				}
				// add new image
				if (image) {
					// remove the old images
					await imageHelper.removeImages(foundedCourse.images);
					imageAddrs = imageHelper.resizeImage(image.path);
					thumbnail = imageAddrs.find(imageAddr => imageAddr.size == 'original');
				} else {
					//update thumbnail size
					const { thumbSize } = req.body;
					if (thumbSize != 'original') {
						thumbnail = foundedCourse.images.find(image => image.size == thumbSize);
					} else {
						thumbnail = foundedCourse.images.find(image => image.size == 'original');
					}
				}
			}
			const updatedCourse = await Course.updateOne(
				{ _id: req.body.courseId },
				{
					$set: {
						...req.body,
						images: imageAddrs ?? foundedCourse.images,
						thumbnail,
					},
				}
			);
			if (!updatedCourse) {
				return this.flashAndRedirect(
					req,
					res,
					'error',
					`عملیات به روز رسانی دوره ${req.body.title} ناموفق بود. دوباره تلاش کنید`,
					`/admin/courses/${req.body.courseId}/edit`
				);
			}
			return this.flashAndRedirect(
				req,
				res,
				'success',
				`دوره ${req.body.title} با موفقیت به روز رسانی شد`,
				'/admin/courses'
			);
		} catch (error) {
			next({ status: 500, message: `something went wrong !`, stack: error.stack });
		}
	}
	//
	async delete(req, res, next) {
		try {
			const { course } = req.body;
			const { id } = req.params;
			const foundedCourse = await Course.findOne({
				$and: [{ title: course }, { _id: id }],
			})
				.populate(['episodes', 'comments', 'ratings'])
				.populate('comments')
				.exec();
			if (!foundedCourse) {
				return this.flashAndRedirect(req, res, 'error', `دوره یافت نشد`, `/admin/courses/${req.body.courseId}/delete`);
			} else {
				// remove course images
				await imageHelper.removeImages(foundedCourse.images);
				// remove course episodes
				foundedCourse.episodes.forEach(async episode => await episode.deleteOne());
				// remove course comments
				foundedCourse.comments.forEach(async comment => await comment.deleteOne());
				// remove course ratings
				foundedCourse.ratings.forEach(async rating => await rating.deleteOne());
				// remove Course
				await foundedCourse.deleteOne();
				req.flash('success', 'دوره با موفقیت حذف شد');
			}
			return res.redirect(`/admin/courses`);
		} catch (error) {
			next({ status: 500, message: `something went wrong !`, stack: error.stack });
		}
	}
	// FETCH PAGES
	async getIndexPage(req, res, next) {
		try {
			let page = req.query.page ?? 1;
			if (isNaN(page)) {
				req.flash('error', 'شماره صفحه نامعتبر است');
				return res.redirect('/admin/courses/');
			}
			const title = 'پنل مدیریت | دوره ها';
			const courses = await Course.paginate(
				{},
				{
					limit: 4,
					page,
					sort: { createdAt: 'desc' },
					lean: true,
					populate: [{ path: 'user', select: 'name' }],
				}
			);

			return res.render('admin/course/index', { title, courses });
		} catch (error) {
			next({ status: 500, message: `something went wrong !`, stack: error.stack });
		}
	}
	//
	async getCreateCoursePage(req, res, next) {
		try {
			const title = 'پنل مدیریت | ایجاد دوره';
			let categories = await Category.find({}, { name: 1, _id: 1 }).lean();
			// return res.json(categories);
			res.render('admin/course/create', { title, categories });
		} catch (error) {
			next(error);
		}
	}
	//
	async getEditCoursePage(req, res, next) {
		try {
			const title = 'پنل مدیریت | ویرایش دوره';
			const course = await Course.findById(req.params.id).lean();
			if (!course) {
				return this.flashAndRedirect(req, res, 'error', 'آیدی دوره نامعتبر است', '/admin/courses');
			}
			let categories = await Category.find({}, { name: 1, _id: 1 }).lean();
			res.render('admin/course/edit', { title, course, categories });
		} catch (error) {
			next(error);
		}
	}
	//
	async getDeleteCoursePage(req, res, next) {
		try {
			const title = 'پنل مدیریت | حذف دوره';
			const course = await Course.findById(req.params.id).lean();
			if (!course) return this.flashAndRedirect(req, res, 'error', 'آیدی دوره نامعتبر است', '/admin/courses');
			res.render('admin/course/delete', { title, course });
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new CourseController();
