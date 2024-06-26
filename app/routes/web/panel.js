const router = require('express').Router();
const panelController = require('app/http/controllers/panel.controller');
const ticketController = require('app/http/controllers/ticket.controller');
const uploadImage = require('app/config/imageUploader');
const validateImageSize = require('app/validators/imageSize.validator');
const checkDataValidation = require('app/http/middlewares/validation.middleware');
const { validateSenderTicketData } = require('../../validators/ticket.validator');
const getOldData = require('app/http/middlewares/getOldData');
const { validateUserInfoData } = require('../../validators/userInfo.validator');

router.use((req, res, next) => {
	req.app.set('layout', 'layouts/panel');
	next();
});

router.get('/', panelController.getIndexPage);
router.get('/courses', panelController.getCoursesPage);

router.get('/tickets', ticketController.getIndexPage);
router.get('/tickets/new', ticketController.getNewTicketPage);
router.post('/tickets/new', validateSenderTicketData(), checkDataValidation, ticketController.new);
router.get('/tickets/:id', ticketController.getSingleTicketPage);
router.post('/tickets/upload-image', uploadImage.single('upload'), ticketController.uploadImage);

router.get('/transactions', panelController.getTransactionsPage);

router.get('/account', panelController.getAccountPage);
router.post(
	'/account/update',
	uploadImage.single('upload'),
	validateImageSize,
	getOldData,
	validateUserInfoData(),
	checkDataValidation,
	panelController.updateUserInfo
);
module.exports = router;
