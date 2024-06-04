const Controller = require('app/http/controllers/controller');
const Permission = require('../../../models/permission.model');

class PermissionController extends Controller {
	constructor() {
		super();
	}
	//
	async new(req, res, next) {
		try {
			const { name, label } = req.body;
			const newPermission = await Permission.create({ name, label });
			if (!newPermission)
				return this.flashAndRedirect(req, res, 'error', 'خطا در ایجاد اجازه سطح دسترسی جدید', req.headers.referer);
			return this.flashAndRedirect(
				req,
				res,
				'success',
				'اجازه سطح دسترسی با موفقیت ایجاد شد',
				'/admin/users/permissions'
			);
		} catch (error) {
			next(error);
		}
	}
	//
	async edit(req, res, next) {
		try {
			const { id, label, name } = req.body;
			const foundedPermissionBasedOnName = await Permission.findOne({ name, _id: { $ne: id } }, { _id: 1 }).lean();
			if (foundedPermissionBasedOnName)
				return this.flashAndRedirect(
					req,
					res,
					'error',
					'اجازه سطح دسترسی قبلا با این عنوان تعریف شده است',
					req.headers.referer
				);
			const result = await Permission.findByIdAndUpdate({ _id: id }, { $set: { label, name } });
			if (!result)
				return this.flashAndRedirect(
					req,
					res,
					'error',
					'عملیات به روز رسانی اجازه دسترسی انجام نشد',
					req.headers.referer
				);
			return this.flashAndRedirect(req, res, 'success', 'با موفقیت به روز رسانی شد', '/admin/users/permissions');
		} catch (error) {
			next(error);
		}
	}
	//
	async delete(req, res, next) {
		try {
			const { id } = req.params;
			const result = await Permission.findByIdAndDelete(id);
			if (!result)
				return this.flashAndRedirect(
					req,
					res,
					'error',
					'عملیات حذف ناموفق ! لطفا دوباره تلاش کنید',
					req.headers.referer
				);
			return this.flashAndRedirect(req, res, 'success', 'با موفقیت حذف شد', '/admin/users/permissions');
		} catch (error) {
			next(error);
		}
	}
	//
	async getIndexPage(req, res, next) {
		try {
			let page = req.query.page ?? 1;
			if (isNaN(page))
				return this.flashAndRedirect(req, res, 'error', 'شماره صفحه نامعتبر است', '/admin/users/permissions');
			const permissions = await Permission.paginate(
				{},
				{ select: { name: 1, _id: 1, label: 1 }, lean: true, limit: 6, page, sort: { createdAt: 'desc' } }
			);
			res.render('admin/permission/index', { title: 'پنل مدیریت | اجازه دسترسی', permissions });
		} catch (error) {
			next(error);
		}
	}
	//
	async getDeletePage(req, res, next) {
		try {
			const { id } = req.params;
			const permission = await Permission.findById(id, { name: 1, _id: 1 }).lean();
			return res.render('admin/permission/delete', { title: 'پنل مدیریت | حذف اجازه دسترسی', permission });
		} catch (error) {
			next(error);
		}
	}
	//
	async getEditPage(req, res, next) {
		try {
			const { id: permissionId } = req.params;
			const foundedPermission = await Permission.findById(permissionId, { _id: 1, name: 1, label: 1 }).lean();
			if (!foundedPermission)
				return this.flashAndRedirect(req, res, 'error', 'اجازه دسترسی با این شناسه یافت نشد', req.headers.referer);
			res.render('admin/permission/edit', { title: 'پنل مدیریت | ویرایش اجازه دسترسی', permission: foundedPermission });
		} catch (error) {
			next(error);
		}
	}
	//
	getCreateNewPage(req, res, next) {
		try {
			res.render('admin/permission/create', { title: 'پنل مدیریت | ایجاد اجازه دسترسی' });
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new PermissionController();
