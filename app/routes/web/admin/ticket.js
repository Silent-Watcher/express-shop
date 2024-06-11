const { param } = require('express-validator');
const ticketController = require('../../../http/controllers/admin/ticket.controller');
const { validateRespondentTicketData } = require('../../../validators/ticket.validator');
const checkDataValidation = require('app/http/middlewares/validation.middleware');
const gate = require('../../../http/guards/gate.guard');

const router = require('express').Router();

router.get('/', ticketController.getTicketsPage);

router.get(
	'/:id/reply',
	gate.can('reply-tickets'),
	param('id').isMongoId().withMessage('شناسه تیکت نامعتبر است'),
	ticketController.getReplyTicketPage
);
router.put('/:id/reply', validateRespondentTicketData(), checkDataValidation, ticketController.reply);

module.exports = router;
