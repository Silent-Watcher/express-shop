const homeController = require('app/http/controllers/home.controller');

const router = require('express').Router();

router.get('/', homeController.index);

module.exports = router;
