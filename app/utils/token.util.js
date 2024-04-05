const uniqueString = require('unique-string');

async function setRememberToken(res, user) {
	const token = uniqueString();
	res.cookie('remember_token', token, {
		maxAge: 3 * 24 * 3600 * 1000 * 90,
		signed: true,
		httpOnly: true,
	});
	user.rememberToken = token;
	await user.save();
}
module.exports = setRememberToken;
