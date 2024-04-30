const path = require('path');

const sha1 = require('sha1');

const multer = require('multer');
const { COURSE_IMAGES_BASE_PATH, IMAGES_MIME_TYPES } = require('../common/globals');
const { mkdirp } = require('mkdirp');

const courseImagesStorage = multer.diskStorage({
	// eslint-disable-next-line no-unused-vars
	destination: async (req, file, cb) => {
		try {
			const now = new Date();
			const [year, month, day] = [now.getFullYear().toString(), now.getMonth().toString(), now.getDay().toString()];
			const uploadPath = path.join(COURSE_IMAGES_BASE_PATH, year, month, day);
			await mkdirp(uploadPath);
			return cb(null, uploadPath);
		} catch (error) {
			return cb(new Error({ status: 500, message: 'خطا در مسیر بارگذاری عکس های دوره' }));
		}
	},
	filename: (req, file, cb) => {
		// check for the right mime type
		if (!IMAGES_MIME_TYPES.includes(file.mimetype)) return cb({ status: 406, message: 'فرمت تصویر نامعتبر است' });
		//check for the right size
		// hash the file name
		const fileName = sha1(file.filename + new Date().getTime().toString()) + path.extname(file.originalname);
		return cb(null, fileName);
	},
});

const uploadCourseImage = multer({ storage: courseImagesStorage });

module.exports = { uploadCourseImage };
