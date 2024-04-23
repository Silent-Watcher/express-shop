const path = require('path');

const sha1 = require('sha1');

const multer = require('multer');
const { IMAGES_MIME_TYPES, COURSE_IMAGES_BASE_PATH } = require('../common/globals');
const { mkdirp } = require('mkdirp');
const _2MB = 2 * 1024 * 1024;

const courseImagesStorage = multer.diskStorage({
	// eslint-disable-next-line no-unused-vars
	destination: async (req, file, cb) => {
		try {
			const now = new Date();
			const [year, month, day] = [now.getFullYear().toString(), now.getMonth().toString(), now.getDay().toString()];
			const uploadPath = path.join(COURSE_IMAGES_BASE_PATH, year, month, day);
			await mkdirp(uploadPath);
			cb(null, uploadPath);
		} catch (error) {
			cb(new Error({ status: 500, message: 'خطا در مسیر بارگذاری عکس های دوره' }));
		}
	},
	filename: (req, file, cb) => {
		// check for the right mime type
		if (!IMAGES_MIME_TYPES.includes(file.mimetype)) cb({ status: 406, message: 'فرمت تصویر نامعتبر است' });
		//check for the right size
		// hash the file name
		const fileName = sha1(file.filename + new Date().getTime().toString()) + path.extname(file.originalname);
		return cb(null, fileName);
	},
});

const uploadCourseImage = multer({ storage: courseImagesStorage, limits: { fileSize: _2MB } });

module.exports = { uploadCourseImage };