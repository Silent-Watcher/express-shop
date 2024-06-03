const Controller = require('app/http/controllers/controller');
const User = require('app/models/user.model');
const Course = require('app/models/course.model');
const Comment = require('app/models/comment.model');
const passwordUtil = require('app/utils/password.util');

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
			if (!newUser)
				return this.flashAndRedirect(req, res, 'error', 'کاربر ساخته نشد لطفا دوباره سعی کنید', '/admin/users');
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
	//
	async getDeleteUserPage(req, res, next) {
		try {
			const foundedUser = await User.findById(req.params.id, { _id: 1, firstName: 1, lastName: 1, email: 1 }).lean();
			res.render('admin/user/delete', { title: 'پنل مدیریت | حذف کاربر', user: foundedUser });
		} catch (error) {
			next(error);
		}
	}
	//
	async delete(req, res, next) {
		try {
			const foundedUser = await User.findById(req.params.id, { _id: 1 }).populate([
				{ path: 'courses', select: '_id', populate: [{ path: 'episodes', select: '_id' }] },
				{ path: 'tickets', select: '_id' },
				{ path: 'comments', select: '_id', populate: [{ path: 'comments', select: '_id' }] },
			]);
			if (!foundedUser)
				return this.flashAndRedirect(req, res, 'error', 'کاربری با چنین شناسه ای یافت نشد', '/admin/users');
			// delete user courses and episodes
			if (foundedUser.courses.length) {
				foundedUser.courses.forEach(async course => {
					course.episodes.forEach(async episode => await episode.remove());
					await Course.deleteOne({ _id: course._id });
				});
			}
			// delete user tickets
			if (foundedUser.tickets.length) foundedUser.tickets.forEach(async ticket => await ticket.remove());
			// delete user comments
			if (foundedUser.comments.length) {
				foundedUser.comments.forEach(async comment => {
					// remove sub comments too !
					comment.comments.forEach(async comment => await comment.remove());
					await Comment.deleteOne({ _id: comment._id });
				});
			}
			await User.deleteOne({ _id: foundedUser._id });
			return this.flashAndRedirect(req, res, 'success', 'کاربر با موفقیت حذف شد', '/admin/users');
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new UserController();
