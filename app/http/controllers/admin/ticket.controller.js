const Controller = require('app/http/controllers/controller');
const Ticket = require('../../../models/ticket.model');

class TicketController extends Controller {
	constructor() {
		super();
	}
	reply(req, res, next) {
		try {
			return res.json(req.body);
			// check if the ticket id param is valid
			// check if the sender id is a valid id
			// check if the respondTo value is equal to current ticket id
			// check if the respondent is a true user
			// create a new ticket
			// change the state of ticket status
			// optional: email the user and let them know that we answer their ticket
			// optional: send new notification to user when their ticket is answered
		} catch (error) {
			next(error);
		}
	}
	//
	async getTicketsPage(req, res, next) {
		try {
			let page = req.query.page ?? 1;
			if (isNaN(page)) return this.flashAndRedirect(req, res, 'error', 'شماره صفحه نامعتبر است', '/admin/tickets');
			const tickets = await Ticket.paginate(
				{},
				{
					select: { sender: 1, title: 1, department: 1 },
					limit: 6,
					page,
					sort: { createdAt: 'desc' },
					lean: true,
					populate: [{ path: 'sender', select: 'name' }],
				}
			);
			res.render('admin/ticket/index', { title: 'پنل مدیریت | تیکت ها', tickets });
		} catch (error) {
			next(error);
		}
	}
	//
	async getReplyTicketPage(req, res, next) {
		try {
			const { id: ticketId } = req.params;
			const ticket = await Ticket.findById(ticketId, {
				title: 1,
				body: 1,
				sender: 1,
				createdAt: 1,
				department: 1,
				status: 1,
				_id: 1,
			})
				.populate([{ path: 'sender', select: 'name photo email' }])
				.lean();
			res.render('admin/ticket/reply', { title: 'پنل مدیریت | پاسخ به تیکت علی', ticket });
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new TicketController();
