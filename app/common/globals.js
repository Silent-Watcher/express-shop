const path = require('path');
const Setting = require('../models/setting.model');
const getSettings = async () => {
	const [settings] = await Setting.find({}, { appName: 1, logo: 1, favicon: 1 }).lean();
	return settings;
};

module.exports = Object.freeze({
	VIEW_FILES_PATH: path.join(process.cwd(), 'app', 'views'),
	DASHBOARD_VIEW_FILES_PATH: path.join(process.cwd(), 'subdomains', 'user', 'views'),
	STATIC_FILES_PATH: path.join(process.cwd(), 'public'),
	_24h: 24 * 3600 * 1000,
	_3d: 3 * 24 * 3600 * 1000,
	_1MB: 1e6, // to Bytes
	IMAGES_MIME_TYPES: ['image/svg+xml', 'image/png', 'image/webp', 'image/avif', 'image/jpeg', '	image/webp'],
	COURSE_IMAGES_BASE_PATH: path.join(process.cwd(), 'public', 'uploads', 'courses'),
	DEFAULT_IMAGE_Addr: '/static/imgs/defaultImage.avif',
	DEFAULT_THUMBNAIL: { size: 'original', path: '/static/imgs/defaultImage.avif' },
	DEFAULT_FAVICON: { size: 'original', path: '/static/imgs/defaultImage.avif' },
	PORT: process.env.PORT,
	LOCALES_PATH: path.join(process.cwd(), 'app', 'locales'),
	settings: getSettings(),
});
