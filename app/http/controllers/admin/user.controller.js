const Controller = require('app/http/controllers/controller');
const User = require('../../../models/user.model');

class UserController extends Controller {
	constructor() {
		super();
	}
	//
	async getIndexPage(req, res, next) {
		try {
			let page = req.query.page ?? 1;

			if (isNaN(page)) return req.flashAndRedirect(req, res, 'error', 'شماره صفحه نامعتبر است', '/admin/courses/');

			const users = await User.paginate(
				{ respondTo: { $exists: false } },
				{
					select: { firstName: 1, lastName: 1, admin: 1, avatar: 1, email: 1 },
					limit: 6,
					page,
					sort: { createdAt: 'desc' },
					lean: true,
				}
			);
			// return res.json(users);
			res.render('admin/user/index', { title: 'پنل مدیریت | کاربران', users });
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new UserController();
