const { isUserAuthenticate } = require('app/http/guards/auth.guard');
const homeController = require('app/http/controllers/home.controller');
const authController = require('app/http/controllers/auth.controller');

const router = require('express').Router();

router.get('/', homeController.index);
router.get('/logout', isUserAuthenticate, authController.logout);

module.exports = router;
