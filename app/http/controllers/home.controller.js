const homeService = require('app/http/services/home.service');
const Controller = require('app/http/controllers/controller');

class HomeController extends Controller {
	#service;
	constructor() {
		super();
		this.#service = homeService;
	}
	async index(req, res, next) {
		try {
			const title = 'فروشگاه';
			res.render('index', { errors: req.flash('error'), title, success: req.flash('success') });
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new HomeController();
