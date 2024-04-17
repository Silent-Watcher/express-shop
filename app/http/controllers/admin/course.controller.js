const slugify = require('slugify');
const Controller = require('app/http/controllers/controller');
const Course = require('app/models/course.model');

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
	async getIndexPage(req, res, next) {
		try {
			const title = 'پنل مدیریت | دوره ها';
			const courses = await Course.find({});
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
}

module.exports = new CourseController();
