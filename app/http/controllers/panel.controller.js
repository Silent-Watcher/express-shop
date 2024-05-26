const User = require('../../models/user.model');
const Controller = require('app/http/controllers/controller');

class PanelController extends Controller {
	constructor() {
		super();
	}

	getIndexPage(req, res, next) {
		try {
			res.render('pages/panel/index', { title: 'فروشگاه عطن | داشبورد کاربری' });
		} catch (error) {
			next(error);
		}
	}
	//
	async getCoursesPage(req, res, next) {
		try {
			const { learning } = await User.findById(req.user._id, { learning: 1 }).populate([
				{ path: 'learning', select: 'thumbnail title slug' },
			]);
			res.render('pages/panel/courses', { title: 'داشبورد کاربری | دوره ها', learningCourses: learning });
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new PanelController();
