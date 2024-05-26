const { isUserAuthenticate } = require('app/http/guards/auth.guard');
const homeController = require('app/http/controllers/home.controller');
const authController = require('app/http/controllers/auth/auth.controller');
const validateComment = require('app/validators/comment.validator');
const checkDataValidation = require('app/http/middlewares/validation.middleware');
const cartRouter = require('./cart');

const router = require('express').Router();

router.get('/', homeController.index);
router.get('/logout', isUserAuthenticate, authController.logout);

router.get('/contact-us', homeController.getContactUsPage);
router.get('/about-us', homeController.getAboutUsPage);

router.use('/cart', isUserAuthenticate, cartRouter);

router.post('/comment', isUserAuthenticate, validateComment(), checkDataValidation, homeController.comment);

module.exports = router;
