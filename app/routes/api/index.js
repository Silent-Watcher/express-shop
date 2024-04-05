const router = require('express').Router();

router.get('/api', (req, res) => {
	res.send('hello from api');
});

module.exports = router;
