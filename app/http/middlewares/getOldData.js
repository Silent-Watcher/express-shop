function getOldData(req, res, next) {
	req.flash('formData', req.body);
	next();
}
module.exports = getOldData;
