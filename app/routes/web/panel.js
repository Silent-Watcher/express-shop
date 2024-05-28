const router = require('express').Router();
const panelController = require('app/http/controllers/panel.controller');
const ticketController = require('app/http/controllers/ticket.controller');
const uploadImage = require('app/config/imageUploader');
const validateImageSize = require('app/validators/imageSize.validator');

router.use((req, res, next) => {
	req.app.set('layout', 'layouts/panel');
	next();
});

router.get('/', panelController.getIndexPage);
router.get('/courses', panelController.getCoursesPage);

router.get('/tickets', ticketController.getIndexPage);
router.get('/tickets/new', ticketController.getNewTicketPage);
router.post('/tickets/new', ticketController.new);
router.get('/tickets/:id', ticketController.getSingleTicketPage);
router.post('/tickets/upload-image', uploadImage.single('upload'), validateImageSize, ticketController.uploadImage);

module.exports = router;
