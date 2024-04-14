const isUserAuthenticate = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.flash('error', 'لطفا وارد حساب کاربری خود شوید');
		return res.redirect('/');
	}
	next();
};

const redirectIfAuthenticate = (req, res, next) => (req.isAuthenticated() ? res.redirect('/') : next());

function checkUserIsAdmin(req, res, next) {
	if (!req.user.admin) {
		req.flash('error', 'شما به پنل مدیریت دسترسی ندارید');
		return res.redirect('/');
	}
	next();
}

module.exports = { isUserAuthenticate, redirectIfAuthenticate, checkUserIsAdmin };
