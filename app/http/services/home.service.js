const autoBind = require('auto-bind');
class HomeService {
	constructor() {
		autoBind(this);
	}
}

module.exports = new HomeService();
