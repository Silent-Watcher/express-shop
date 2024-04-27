const path = require('path');

module.exports = Object.freeze({
	VIEW_FILES_PATH: path.join(process.cwd(), 'app', 'views'),
	STATIC_FILES_PATH: path.join(process.cwd(), 'public'),
	_24h: 24 * 3600 * 1000,
	_3d: 3 * 24 * 3600 * 1000,
	IMAGES_MIME_TYPES: ['image/svg+xml', 'image/png', 'image/webp', 'image/avif', 'image/jpeg', '	image/webp'],
	COURSE_IMAGES_BASE_PATH: path.join(process.cwd(), 'public', 'uploads', 'courses'),
	DEFAULT_IMAGE_Addr: '/static/imgs/defaultImage.avif',
});
