const { body, param } = require('express-validator');
const userController = require('../../../http/controllers/admin/user.controller');
const checkDataValidation = require('../../../http/middlewares/validation.middleware');
const getOldData = require('../../../http/middlewares/getOldData');

const router = require('express').Router();

router.get('/', userController.getIndexPage);

// create a new user
router.get('/new', userController.getCreateNewUserPage);
router.post(
	'/new',
	getOldData,
	body('email').isEmail().withMessage('فرمت ایمیل ارسال شده نادرست است'),
	body('password').trim().escape(),
	checkDataValidation,
	userController.addNew
);

// toggle admin status
router.get(
	'/:id/toggleAdmin',
	param('id').isMongoId().withMessage('شناسه کاربر نامعتبر است'),
	userController.toggleAdmin
);

// edit user info
router.get('/:id/edit', param('id').isMongoId().withMessage('شناسه کاربر نامعتبر است'), userController.edit);

// edit user info
router.get(
	'/:id/delete',
	param('id').isMongoId().withMessage('شناسه کاربر نامعتبر است'),
	userController.getDeleteUserPage
);

router.post('/:id/delete', param('id').isMongoId().withMessage('شناسه کاربر نامعتبر است'), userController.delete);

module.exports = router;
