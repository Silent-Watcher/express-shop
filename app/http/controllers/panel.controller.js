const Controller = require('app/http/controllers/controller');

class PanelController extends Controller {
	constructor() {
		super();
	}

	getIndexPage(req, res, next) {
		try {
			res.render('index', { title: 'فروشگاه عطن | داشبورد کاربری' });
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new PanelController();
