const isUserAuthenticate = (req, res, next) => (req.isAuthenticated() ? next() : res.redirect('/'));

const redirectIfAuthenticate = (req, res, next) => (req.isAuthenticated() ? res.redirect('/') : next());

module.exports = { isUserAuthenticate, redirectIfAuthenticate };
