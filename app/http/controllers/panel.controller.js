const Payment = require('../../models/payment.model');
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
	//
	async getTransactionsPage(req, res, next) {
		try {
			let page = req.query.page ?? 1;
			if (isNaN(page)) return this.alertAndRedirect(req, res, 'error', 'شماره صفحه نامعتبر است', '/me/tickets');
			const transactions = await Payment.paginate(
				{ user: req.user._id },
				{
					limit: 10,
					page,
					sort: { createdAt: 'desc' },
					lean: true,
				}
			);
			// return res.json(transactions);
			res.render('pages/panel/transactions', { title: 'داشبورد کاربری | تراکنش ها', transactions });
		} catch (error) {
			next(error);
		}
	}
	//
	async getAccountPage(req, res, next) {
		try {
			res.render('pages/panel/account', { title: 'داشبورد کاربری | جزئیات حساب' });
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new PanelController();
