const Controller = require('app/http/controllers/controller');
const Course = require('../../models/course.model');

class CourseController extends Controller {
	//
	getCoursesPage(req, res, next) {
		try {
			res.render('pages/courses/index.ejs');
		} catch (error) {
			next(error);
		}
	}
	//
	async getSingleCoursePage(req, res, next) {
		try {
			const { courseSlug } = req.params;
			const course = await Course.findOne({ slug: courseSlug }, { images: 0, slug: 0, updatedAt: 0, __v: 0 })
				.populate([{ path: 'episodes' }, { path: 'user', select: 'name' }])
				.exec();
			const title = course.title;
			// res.json(course);
			res.render('pages/courses/single', { title, course });
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new CourseController();
