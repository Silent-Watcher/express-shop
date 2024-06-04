const Controller = require('app/http/controllers/controller');
const Role = require('../../../models/role.model');
const Permission = require('../../../models/permission.model');

class PermissionController extends Controller {
	constructor() {
		super();
	}
	//
	async getIndexPage(req, res, next) {
		try {
			let page = req.query.page ?? 1;
			if (isNaN(page))
				return this.flashAndRedirect(req, res, 'error', 'شماره صفحه نامعتبر است', '/admin/users/permissions');
			const roles = await Role.paginate(
				{},
				{ select: { name: 1, _id: 1, label: 1 }, lean: true, limit: 6, page, sort: { createdAt: 'desc' } }
			);
			res.render('admin/role/index', { title: 'پنل مدیریت | نقش های کاربری', roles });
		} catch (error) {
			next(error);
		}
	}
	//
	async getCreateNewPage(req, res, next) {
		try {
			const permissions = await Permission.find({}, { _id: 1, label: 1 }).lean();
			res.render('admin/role/create', { title: 'پنل مدیریت | ایجاد نقش کاربری', permissions });
		} catch (error) {
			next(error);
		}
	}
	//
	async new(req, res, next) {
		try {
			const { name, label, permissions } = req.body;
			const newRole = await Role.create({ name, label, permissions });
			if (!newRole)
				return this.flashAndRedirect(
					req,
					res,
					'error',
					'نقش کاربری ایجاد نشد. لطفا دوباره سعی کنید',
					req.headers.referer
				);
			return this.flashAndRedirect(req, res, 'success', 'نقش کاربری با موفقیت ایجاد شد', '/admin/users/roles');
		} catch (error) {
			console.log(error);
			next(error);
		}
	}
	//
	async getEditPage(req, res, next) {
		try {
			const { id: roleId } = req.params;
			const foundedRole = await Role.findById({ _id: roleId }, { _id: 1, name: 1, label: 1, permissions: 1 })
				.populate([{ path: 'permissions', select: 'label _id name' }])
				.lean();
			if (!foundedRole)
				return this.flashAndRedirect(req, res, 'error', 'نقش کاربری با این شناسه یافت نشد', req.headers.referer);
			// return res.json(foundedRole);
			const permissions = await Permission.find({}, { _id: 1, label: 1, name: 1 }).lean();
			// return res.json({ pers: permissions, rolePers: foundedRole.permissions });
			return res.render('admin/role/edit', { title: 'پنل مدیریت | ویرایش نقش کاربری', role: foundedRole, permissions });
		} catch (error) {
			next(error);
		}
	}
	//
	async edit(req, res, next) {
		try {
			const { id, label, name, permissions } = req.body;
			const result = await Role.findByIdAndUpdate({ _id: id }, { $set: { label, name, permissions } });
			if (!result)
				return this.flashAndRedirect(
					req,
					res,
					'error',
					'عملیات به روز رسانی نقش کاربری انجام نشد',
					req.headers.referer
				);
			return this.flashAndRedirect(req, res, 'success', 'با موفقیت به روز رسانی شد', '/admin/users/roles');
		} catch (error) {
			next(error);
		}
	}
	//
	async getDeletePage(req, res, next) {
		try {
			const { id } = req.params;
			const role = await Role.findById(id, { name: 1, _id: 1 }).lean();
			return res.render('admin/role/delete', { title: 'پنل مدیریت | حذف اجازه دسترسی', role });
		} catch (error) {
			next(error);
		}
	}
	//
	async delete(req, res, next) {
		try {
			const { id } = req.params;
			const result = await Role.findByIdAndDelete(id);
			if (!result)
				return this.flashAndRedirect(
					req,
					res,
					'error',
					'عملیات حذف ناموفق ! لطفا دوباره تلاش کنید',
					req.headers.referer
				);
			return this.flashAndRedirect(req, res, 'success', 'با موفقیت حذف شد', '/admin/users/roles');
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new PermissionController();
