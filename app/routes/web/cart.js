const router = require('express').Router();
const { isUserAuthenticate } = require('app/http/guards/auth.guard');
const homeController = require('app/http/controllers/home.controller');

router.get('/', isUserAuthenticate, homeController.getCartPage);
router.post('/add-item', isUserAuthenticate, homeController.addProductToCart);
router.delete('/remove-item', isUserAuthenticate, homeController.removeProductFromCart);

router.post('/payment', homeController.payment);

module.exports = router;
