const router = require('express').Router();

router.get('/', (req, res) => {
	res.send('admin dashboard');
});

module.exports = router;
