const User = require('app/models/user.model');

async function rememberLogin(req, res, next) {
	if (!req.isAuthenticated()) {
		const rememberToken = req.signedCookies.remember_token;
		if (rememberToken) {
			await User.findOne({ rememberToken })
				.then(user => {
					if (user) {
						req.login(user, err => {
							if (err) next(err);
							return res.redirect('/');
						});
					}
				})
				.catch(err => next(err));
		}
	}
	return next();
}
module.exports = rememberLogin;
