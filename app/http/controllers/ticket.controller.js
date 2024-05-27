const Controller = require('app/http/controllers/controller');
const Ticket = require('../../models/ticket.model');

class TicketController extends Controller {
	constructor() {
		super();
	}
	//
	async getIndexPage(req, res, next) {
		try {
			const tickets = await Ticket.find(
				{ Sender: req.user._id },
				{ title: 1, createdAt: 1, status: 1, department: 1, _id: 1 }
			).lean();
			res.render('pages/panel/ticket/index', { title: 'داشبورد کاربری | تیکت ها', tickets });
		} catch (error) {
			next(error);
		}
	}
	//
	getNewTicketPage(req, res, next) {
		try {
			res.render('pages/panel/ticket/new', { title: 'داشبورد کاربری | تیکت جدید' });
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new TicketController();
