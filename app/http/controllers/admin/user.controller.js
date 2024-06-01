const Controller = require('app/http/controllers/controller');
const User = require('../../../models/user.model');
const passwordUtil = require('../../../utils/password.util');

class UserController extends Controller {
	constructor() {
		super();
	}
	//
	async getIndexPage(req, res, next) {
		try {
			let page = req.query.page ?? 1;

			if (isNaN(page)) return req.flashAndRedirect(req, res, 'error', 'شماره صفحه نامعتبر است', '/admin/courses/');

			const users = await User.paginate(
				{ respondTo: { $exists: false } },
				{
					select: { firstName: 1, lastName: 1, admin: 1, avatar: 1, email: 1 },
					limit: 6,
					page,
					sort: { createdAt: 'desc' },
					lean: true,
				}
			);
			// return res.json(users);
			res.render('admin/user/index', { title: 'پنل مدیریت | کاربران', users });
		} catch (error) {
			next(error);
		}
	}
	//
	async getCreateNewUserPage(req, res, next) {
		try {
			res.render('admin/user/create', { title: 'پنل مدیریت | ایجاد کاربر جدید' });
		} catch (error) {
			next(error);
		}
	}
	//
	async addNew(req, res, next) {
		try {
			let { email, password } = req.body;
			// check if a user exists with this email or not
			const foundedUser = await User.findOne({ email }, { _id: 1 }).lean();
			if (foundedUser)
				return this.flashAndRedirect(req, res, 'error', 'کاربری با ایمیل قبلا ثبت نام کرده است', req.headers.referer);
			// hash password
			password = await passwordUtil.hash(password);

			// store in database
			const newUser = await User.create({ email, password });
			if (!newUser) return this.flashAndRedirect(req, res, 'error', 'کاربر ساخته نشد لطفا دوباره سعی کنید');
			return this.flashAndRedirect(req, res, 'success', 'کاربر با موفقیت ایجاد شد', '/admin/users');
		} catch (error) {
			next(error);
		}
	}
	//
	async toggleAdmin(req, res, next) {
		try {
			const { id: userId } = req.params;
			const foundedUser = await User.findById(userId, { admin: 1, _id: 1 });
			if (!foundedUser)
				return this.flashAndRedirect(req, res, 'error', 'کاربری با چنین شناسه ای یافت نشد', req.headers.referer);
			const admins = await User.find({ admin: true }, { _id: 1 }).lean();
			if (admins.length == 1 && foundedUser.admin)
				return this.flashAndRedirect(req, res, 'error', 'سایت حداقل به یک ادمین نیاز دارد', '/admin/users');
			foundedUser.admin = !foundedUser.admin;
			await foundedUser.save();
			return this.flashAndRedirect(
				req,
				res,
				'success',
				`وضعیت به ${foundedUser.admin ? 'ادمین' : 'کاربر عادی'} تغییر کرد`,
				'/admin/users'
			);
		} catch (error) {
			next(error);
		}
	}
	//
	async edit(req, res, next) {
		try {
			const user = await User.findById(req.params.id, { firstName: 1, lastName: 1, avatar: 1, email: 1, photos: 1 });
			res.render('admin/user/edit', { title: 'پنل مدیریت | ویرایش کاربر', user });
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new UserController();
