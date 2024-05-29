const Payment = require('../../models/payment.model');
const User = require('../../models/user.model');
const Controller = require('app/http/controllers/controller');
const imageHelper = require('app/helpers/image.helper');

class PanelController extends Controller {
	constructor() {
		super();
	}

	getIndexPage(req, res, next) {
		try {
			res.render('pages/panel/index', { title: 'فروشگاه عطن | داشبورد کاربری' });
		} catch (error) {
			next(error);
		}
	}
	//
	async getCoursesPage(req, res, next) {
		try {
			const { learning } = await User.findById(req.user._id, { learning: 1 }).populate([
				{ path: 'learning', select: 'thumbnail title slug' },
			]);
			res.render('pages/panel/courses', { title: 'داشبورد کاربری | دوره ها', learningCourses: learning });
		} catch (error) {
			next(error);
		}
	}
	//
	async getTransactionsPage(req, res, next) {
		try {
			let page = req.query.page ?? 1;
			if (isNaN(page)) return this.alertAndRedirect(req, res, 'error', 'شماره صفحه نامعتبر است', '/me/tickets');
			const transactions = await Payment.paginate(
				{ user: req.user._id },
				{
					limit: 10,
					page,
					sort: { createdAt: 'desc' },
					lean: true,
				}
			);
			// return res.json(transactions);
			res.render('pages/panel/transactions', { title: 'داشبورد کاربری | تراکنش ها', transactions });
		} catch (error) {
			next(error);
		}
	}
	//
	async getAccountPage(req, res, next) {
		try {
			res.render('pages/panel/account', { title: 'داشبورد کاربری | جزئیات حساب' });
		} catch (error) {
			next(error);
		}
	}
	//
	async updateUserInfo(req, res, next) {
		try {
			// TODO: remove the empty fields
			const { phone, avatarOption, user } = req.body;
			const foundedUser = await User.findById(user, { _id: 1, email: 1, photos: 1, avatar: 1 });
			if (!foundedUser) return this.alertAndRedirect(req, res, 'error', 'شناسه کاربر نامعتبر است', req.headers.referer);
			let imageAddr = null;
			if (avatarOption == 'upload') {
				const image = req?.file;
				// eslint-disable-next-line no-unused-vars
				imageAddr = imageHelper.createImageUrlAddr(image.path);
			} else if (avatarOption == 'gravatar') {
				// eslint-disable-next-line no-unused-vars
				imageAddr = imageHelper.createGravatarUrl(foundedUser.email);
			} else if (avatarOption == 'google') {
				let googleProfile = foundedUser.photos.find(photo => photo.source == 'google');
				imageAddr = googleProfile.path;
			}
			let photos = foundedUser.photos.find(photo => photo.source != avatarOption);
			foundedUser.photos = photos;
			await foundedUser.save();
			// let phoneRegex = /^(\+98|0|98|0098)?([ ]|-|[()]){0,2}9[0-9]([ ]|-|[()]){0,2}(?:[0-9]([ ]|-|[()]){0,2}){8}$/gim;
			// if (phoneRegex.test(phone))
			// 	return this.alertAndRedirect(req, res, 'error', 'شماره موبایل باید ایرانی باشد', req.headers.referer);
			let result = await User.updateOne(
				{ _id: foundedUser._id },
				{
					$set: { ...req.body, phone, avatar: { source: avatarOption, path: imageAddr } },
					$addToSet: { photos: { source: avatarOption, path: imageAddr } },
				}
			);
			if (!result)
				return this.alertAndRedirect(
					req,
					res,
					'error',
					'مشکل در به روز رسانی اطلاعات لطفا دوباره سعی کنید',
					req.headers.referer
				);
			else return this.alertAndRedirect(req, res, 'success', 'اطلاعات با موفقیت به روز رسانی شد', req.headers.referer);
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new PanelController();
