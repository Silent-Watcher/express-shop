const Controller = require('app/http/controllers/controller');
const Setting = require('../../../models/setting.model');
const { DEFAULT_FAVICON } = require('../../../common/globals');
const imageHelper = require('app/helpers/image.helper');

class SettingController extends Controller {
	constructor() {
		super();
	}
	//
	async getIndexPage(req, res, next) {
		try {
			const [settings] = await Setting.find({}, { appName: 1, logo: 1, _id: 1, favicon: 1 });
			if (!settings) {
				const newSetting = new Setting({ appName: 'فروشگاه' });
				await newSetting.save();
				res.render('admin/setting/index', { title: 'پنل مدیریت | تنظیمات', settings: newSetting });
			} else {
				res.render('admin/setting/index', { title: 'پنل مدیریت | تنظیمات', settings });
			}
		} catch (error) {
			next(error);
		}
	}
	async update(req, res, next) {
		try {
			const { useDefaultImage } = req.body;
			const settings = await Setting.findById(req.body.settingId, { appName: 1, logo: 1 });
			let favicon = settings?.favicon ?? DEFAULT_FAVICON;
			let logoAddrs = null;
			if (useDefaultImage == 'true') {
				logoAddrs = [];
				favicon = DEFAULT_FAVICON;
				await imageHelper.removeImages(settings.logo);
			} else {
				const logo = req?.file;
				if (!settings) {
					return this.flashAndRedirect(
						req,
						res,
						'error',
						'شناسه تنظیمات نامعتبر است',
						`/admin/courses/${req.body.courseId}/edit`
					);
				}
				// add new image
				if (logo) {
					// remove the old images
					await imageHelper.removeImages(settings.logo);
					logoAddrs = imageHelper.resizeImage(logo.path);
					favicon = logoAddrs.find(logoAddr => logoAddr.size == 'original');
				} else {
					//update thumbnail size
					const { favicon: newFaviconSize } = req.body;
					if (newFaviconSize != 'original') {
						favicon = settings.logo.find(logo => logo.size == newFaviconSize);
					} else {
						favicon = settings.logo.find(logo => logo.size == 'original');
					}
				}
			}
			const updatedSettings = await Setting.updateOne(
				{ _id: req.body.settingId },
				{
					$set: {
						...req.body,
						logo: logoAddrs ?? settings.logo,
						favicon,
					},
				}
			);
			if (!updatedSettings) {
				return this.flashAndRedirect(
					req,
					res,
					'error',
					`عملیات به روز رسانی تنظیمات ناموفق بود. دوباره تلاش کنید`,
					`/admin/courses/settings`
				);
			}
			return this.flashAndRedirect(req, res, 'success', `تنظیمات با موفقیت به روز رسانی شد`, '/admin/settings');
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new SettingController();
