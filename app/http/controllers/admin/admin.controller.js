const Controller = require('app/http/controllers/controller');

class AdminController extends Controller {
	constructor() {
		super();
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
