const bcrypt = require('bcrypt');

const autoBind = require('auto-bind');

class PasswordUtil {
	#rounds = 10;
	#salt;
	constructor() {
		autoBind(this);
		this.#salt = bcrypt.genSaltSync(this.#rounds);
	}
	async hash(pass) {
		try {
			return await bcrypt.hash(pass, this.#salt);
		} catch (error) {
			throw new Error('failed to hash incoming password');
		}
	}
	async compare(pass, hash) {
		try {
			return await bcrypt.compare(pass, hash);
		} catch (error) {
			throw new Error('failed to compare the incoming password');
		}
	}
}

module.exports = new PasswordUtil();
