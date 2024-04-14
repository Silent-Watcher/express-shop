const router = require('express').Router();

router.get('/', (req, res) => {
	res.render('admin/index', { user: req.user });
});

module.exports = router;
