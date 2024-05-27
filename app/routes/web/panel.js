const router = require('express').Router();
const panelController = require('../../http/controllers/panel.controller');
const ticketController = require('../../http/controllers/ticket.controller');

router.use((req, res, next) => {
	req.app.set('layout', 'layouts/panel');
	next();
});

router.get('/', panelController.getIndexPage);
router.get('/courses', panelController.getCoursesPage);

router.get('/tickets', ticketController.getIndexPage);
router.get('/tickets/new', ticketController.getNewTicketPage);

module.exports = router;
