const Controller = require('app/http/controllers/controller');
const Ticket = require('app/models/ticket.model');
const imageHelper = require('app/helpers/image.helper');

class TicketController extends Controller {
	constructor() {
		super();
	}
	//
	async new(req, res, next) {
		try {
			const { department, title, body } = req.body;
			const newTicket = new Ticket({ body, department, title, sender: req.user._id, status: false });
			newTicket
				.save()
				.then(() => {
					this.alertAndRedirect(req, res, 'success', 'تیکت با موفقیت ارسال شد', '/me/tickets');
				})
				.catch(error => {
					console.log(error);
					this.alertAndRedirect(req, res, 'error', 'خطا در ارسال تیکت', '/me/tickets');
				});
		} catch (error) {
			next(error);
		}
	}
	//
	async uploadImage(req, res, next) {
		try {
			const image = req?.file;
			res.json({
				uploaded: true,
				fileName: image.originalname,
				url: imageHelper.createImageUrlAddr(image.path),
			});
		} catch (error) {
			console.log(error);
			next(error);
		}
	}
	//
	async getIndexPage(req, res, next) {
		try {
			let page = req.query.page ?? 1;
			if (isNaN(page)) return this.alertAndRedirect(req, res, 'error', 'شماره صفحه نامعتبر است', '/me/tickets');
			const tickets = await Ticket.paginate(
				{ sender: req.user._id, respondTo: { $exists: false } },
				{
					select: { title: 1, createdAt: 1, status: 1, department: 1, _id: 1 },
					limit: 6,
					page,
					sort: { createdAt: 'desc' },
					lean: true,
				}
			);
			const openTickets = tickets.docs.filter(ticket => ticket.status == false);
			const closedTickets = tickets.docs.length - openTickets.length;
			res.render('pages/panel/ticket/index', {
				title: 'داشبورد کاربری | تیکت ها',
				tickets,
				openTickets: openTickets.length,
				closedTickets: closedTickets,
			});
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
	//
	async getSingleTicketPage(req, res, next) {
		try {
			const { id: ticketId } = req.params;
			const foundedTicket = await Ticket.findById(ticketId, {
				title: 1,
				body: 1,
				createdAt: 1,
				sender: 1,
				respondent: 1,
				answers: 1,
			})
				.populate([
					{ path: 'sender', select: 'firstName lastName' },
					{ path: 'respondent', select: 'firstName lastName' },
					{ path: 'answers', select: 'body sender', populate: [{ path: 'sender', select: 'firstName lastName' }] },
				])
				.lean();
			if (!foundedTicket) return this.alertAndRedirect(req, res, 'error', 'تیکت یافت نشد', req.headers.referer);
			res.render('pages/panel/ticket/single', {
				title: `داشبورد کاربری | تیکت ${ticketId.toString().slice(-5)}#`,
				ticket: foundedTicket,
			});
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new TicketController();
