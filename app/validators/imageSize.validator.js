const { _1MB } = require('app/common/globals');
const imageHelper = require('app/helpers/image.helper');

const validateImageSize = async (req, res, next) => {
	if (req.file.size > _1MB) {
		await imageHelper.removeImages([{ size: 'original', path: req.file.path }]);
		req.flash('error', 'حجم عکس آپلود شده باید کمتر از 1 مگابایت باشد');
		return res.redirect(req.headers.referer);
	}
	next();
};

module.exports = validateImageSize;
