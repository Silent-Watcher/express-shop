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
			res.render('index', { errors: req.flash('error') });
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new HomeController();
