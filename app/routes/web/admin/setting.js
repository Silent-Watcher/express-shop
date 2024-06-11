const router = require('express').Router();
const settingController = require('app/http/controllers/admin/settingController');
// const validateImageSize = require('../../../validators/imageSize.validator');
const uploadImage = require('app/config/imageUploader');
const getOldData = require('app/http/middlewares/getOldData');
const gate = require('../../../http/guards/gate.guard');

router.get('/', gate.can('change-settings'), getOldData, settingController.getIndexPage);
router.put('/edit', uploadImage.single('logo'), settingController.update);

module.exports = router;
