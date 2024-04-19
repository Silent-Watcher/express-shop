const slugify = require('slugify');
const Controller = require('app/http/controllers/controller');
const Course = require('../../../models/course.model');

class CourseController extends Controller {
	constructor() {
		super();
	}
	//
	async create(req, res, next) {
		try {
			const { title, type, slug, image, description, price, tags } = req.body;
			await Course.create({
				title,
				type,
				slug: slugify(slug, { lower: true, replacement: '-' }),
				image,
				description,
				user: req.user._id,
				price,
				tags,
				images: image,
			});
			req.flash('success', `دوره ${title} با موفقیت ایجاد شد`);
			res.redirect('/admin/courses');
		} catch (error) {
			next(error);
		}
	}
	//
	async edit(req, res, next) {
		try {
			const foundedCourse = await Course.findById(req.body.courseId);
			if (!foundedCourse) {
				req.flash('error', 'شناسه دوره نامعتبر است');
				return res.redirect(`/admin/courses/${req.body.courseId}/edit`);
			}
			const updatedCourse = await Course.updateOne(
				{ _id: req.body.courseId },
				{
					$set: {
						...req.body,
					},
				}
			);
			if (!updatedCourse) {
				req.flash('error', `عملیات به روز رسانی دوره ${req.body.title} ناموفق بود. دوباره تلاش کنید`);
				return res.redirect(`/admin/courses/${req.body.courseId}/edit`);
			}
			req.flash('success', `دوره ${req.body.title} با موفقیت به روز رسانی شد`);
			return res.redirect(`/admin/courses`);
		} catch (error) {
			next(error);
		}
	}
	//
	async delete(req, res, next) {
		try {
			const { course } = req.body;
			const { id } = req.params;
			const foundedCourse = await Course.findOneAndDelete({
				$and: [{ title: course }, { _id: id }],
			});

			if (!foundedCourse) {
				req.flash('error', `عملیات حذف دوره موفقیت آمیز نبود . لطفا مجدد تلاش کنید.`);
				return res.redirect(`/admin/courses/${req.body.courseId}/delete`);
			}
			req.flash('success', 'دوره با موفقیت حذف شد');
			return res.redirect(`/admin/courses`);
		} catch (error) {
			next(error);
		}
	}
	//
	async getIndexPage(req, res, next) {
		try {
			const title = 'پنل مدیریت | دوره ها';
			const courses = await Course.find({}).lean();
			res.render('admin/course/index', { title, courses });
		} catch (error) {
			next(error);
		}
	}
	//
	getCreateCoursePage(req, res, next) {
		try {
			const title = 'پنل مدیریت | ایجاد دوره';
			res.render('admin/course/create', { title });
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
				req.flash('error', 'آیدی دوره نامعتبر است');
				res.redirect('/admin/courses');
			}
			res.render('admin/course/edit', { title, course });
		} catch (error) {
			next(error);
		}
	}
	//
	async getDeleteCoursePage(req, res, next) {
		try {
			const title = 'پنل مدیریت | حذف دوره';
			const course = await Course.findById(req.params.id).lean();
			if (!course) {
				req.flash('error', 'آیدی دوره نامعتبر است');
				res.redirect('/admin/courses');
			}
			res.render('admin/course/delete', { title, course });
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new CourseController();
