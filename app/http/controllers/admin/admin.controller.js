const Controller = require('app/http/controllers/controller');
const imageHelper = require('../../../helpers/image.helper');

class AdminController extends Controller {
	constructor() {
		super();
	}
	uploadImage(req, res, next) {
		try {
			const image = req?.file;
			res.send({
				uploaded: true,
				fileName: image.originalname,
				url: imageHelper.createImageUrlAddr(image.path),
			});
		} catch (error) {
			next(error);
		}
	}
	getIndexPage(req, res, next) {
		try {
			res.render('admin/index');
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new AdminController();
