const Controller = require('app/http/controllers/controller');
const Ticket = require('app/models/ticket.model');

class TicketController extends Controller {
	constructor() {
		super();
	}
	async reply(req, res, next) {
		try {
			const ticket = await Ticket.findById(req.body.respondTo, { status: 1 });
			const replyTicket = new Ticket({
				body: req.body.body,
				sender: req.body.respondent,
				respondTo: req.body.respondTo,
			});
			await replyTicket.save().catch(() => {
				return this.flashAndRedirect(req, res, 'error', 'خطا در ایجاد تیکت پاسخ', req.headers.referer);
			});
			if (req.body.status == 'true' && ticket.status == false) {
				ticket.status = true;
				await ticket.save().catch(() => {
					return this.flashAndRedirect(req, res, 'error', 'خطا در به روز رسانی وضعیت تیکت', req.headers.referer);
				});
			}
			return this.flashAndRedirect(req, res, 'success', 'پاسخ تیکت با موفقیت ارسال شد', '/admin/tickets');
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
				{ respondTo: { $exists: false } },
				{
					select: { sender: 1, title: 1, department: 1, status: 1 },
					limit: 6,
					page,
					sort: { createdAt: 'desc' },
					lean: true,
					populate: [{ path: 'sender', select: 'firstName lastName email' }],
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
				.populate([{ path: 'sender', select: 'firstName lastName photo email' }])
				.lean();
			res.render('admin/ticket/reply', { title: 'پنل مدیریت | پاسخ به تیکت علی', ticket });
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new TicketController();
