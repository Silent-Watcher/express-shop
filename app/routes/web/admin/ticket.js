const ticketController = require('../../../http/controllers/admin/ticket.controller');

const router = require('express').Router();

router.get('/', ticketController.getTicketsPage);
router.get('/:id/reply', ticketController.getReplyTicketPage);
router.put('/:id/reply', ticketController.reply);

module.exports = router;
