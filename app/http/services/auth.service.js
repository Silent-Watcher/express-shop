const Controller = require('app/http/controllers/controller');

class AuthService extends Controller {
	#model;
	constructor() {
		super();
	}
}

module.exports = new AuthService();
