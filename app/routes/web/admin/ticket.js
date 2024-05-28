const { param } = require('express-validator');
const ticketController = require('../../../http/controllers/admin/ticket.controller');
const { validateRespondentTicketData } = require('../../../validators/ticket.validator');
const checkDataValidation = require('app/http/middlewares/validation.middleware');

const router = require('express').Router();

router.get('/', ticketController.getTicketsPage);

router.get(
	'/:id/reply',
	param('id').isMongoId().withMessage('شناسه تیکت نامعتبر است'),
	ticketController.getReplyTicketPage
);
router.put('/:id/reply', validateRespondentTicketData(), checkDataValidation, ticketController.reply);

module.exports = router;
