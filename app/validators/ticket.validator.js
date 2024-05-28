const Ticket = require('../models/ticket.model');
const User = require('../models/user.model');
const { body } = require('express-validator');
function validateSenderTicketData() {
	return [
		body('title').isString().escape().not().isEmpty().withMessage('برای تیکت خود عنوان بنویسید'),
		body('body').isString().not().isEmpty().withMessage('توضیحات تیکت نامعتبر است'),
		body('department')
			.custom(value => {
				const whiteList = ['finance', 'consult', 'admin', 'support'];
				return whiteList.includes(value);
			})
			.withMessage('نوع دپارتمان تیکت نامعتبر است'),
	];
}

function validateRespondentTicketData() {
	return [
		body('respondent').custom(async value => {
			let foundedUser = await User.findById(value, { _id: 1 }).lean();
			if (!foundedUser) throw new Error('کاربر ارسال کننده پاسخ تیکت یافت نشد');
		}),
		body('respondTo').isMongoId().withMessage('شناسه تیکت شما نامعتبر است'),
		body('respondTo').custom(async (value, { req }) => {
			let foundedTicket = await Ticket.findById(value, { _id: 1 }).lean();
			if (!foundedTicket) throw new Error('تیکت یافت نشد');
			if (foundedTicket._id.toString() != req.params.id) throw new Error('خطا در تطابق شناسه ها');
		}),
		body('status')
			.isString()
			.escape()
			.not()
			.isEmpty()
			.custom(value => {
				let whiteList = ['true', 'false'];
				return whiteList.includes(value);
			})
			.withMessage('وضعیت تیکت نامعتبر است'),
		body('respondent').isMongoId().withMessage('شناسه ارسال کننده پاسخ تیکت نامعتبر است'),
		body('body').isString().not().isEmpty().withMessage('توضیحات تیکت نامعتبر است'),
	];
}

module.exports = { validateSenderTicketData, validateRespondentTicketData };
