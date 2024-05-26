const router = require('express').Router();
const homeController = require('../../http/controllers/home.controller');

router.get('/', homeController.getCartPage);
router.post('/add-item', homeController.addProductToCart);
router.delete('/remove-item', homeController.removeProductFromCart);

router.post('/payment', homeController.payment);

// router.get('/payment/checker', homeController.checkPayment);
router.post('/payment/checker', homeController.checkPayment);

module.exports = router;
