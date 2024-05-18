const Controller = require('app/http/controllers/controller');
const Category = require('../../../models/category.model');

class CategoryController extends Controller {
	#parents;
	constructor() {
		super();
	}
	// create a new category
	async create(req, res, next) {
		try {
			const { name, parent, slug } = req.body;
			const foundedCategory = await Category.find({ name }, { _id: 1 }).lean();
			if (foundedCategory == [])
				return this.flashAndRedirect(req, res, 'error', 'چنین دسته بندی قبلا تعریف شده است', req.headers.referer);
			const result = await Category.create({ name, parent: parent == 'null' ? null : parent, slug });
			if (!result) return this.flashAndRedirect(req, res, 'error', 'خطا در ایجاد دسته بندی', req.headers.referer);
			return this.flashAndRedirect(req, res, 'success', 'دسته بندی با موفقیت ایجاد شد', '/admin/categories');
		} catch (error) {
			next(error);
		}
	}
	// edit an existing category
	async edit(req, res, next) {
		try {
			const { name, parent, slug } = req.body;
			const { id } = req.params;
			const foundedCategory = await Category.findByIdAndUpdate(id, { $set: { name, parent, slug } });
			if (!foundedCategory)
				return this.flashAndRedirect(req, res, 'error', 'خطا در به روز رسانی دسته بندی', req.headers.referer);
			return this.flashAndRedirect(req, res, 'success', 'با موفقیت به روز رسانی شد', '/admin/categories');
		} catch (error) {
			next(error);
		}
	}
	//
	async delete(req, res, next) {
		try {
			const { id } = req.params;
			const foundedCategory = await Category.findById(id).populate('children');
			if (!foundedCategory)
				return this.flashAndRedirect(req, res, 'error', 'خطا در به روز رسانی دسته بندی', req.headers.referer);
			// remove sub categories
			foundedCategory.children.forEach(async child => await child.deleteOne());
			// remove main category
			await foundedCategory.deleteOne();
			return this.flashAndRedirect(
				req,
				res,
				'success',
				`دسته ${foundedCategory.name} با موفقیت حذف شد`,
				'/admin/categories'
			);
		} catch (error) {
			next(error);
		}
	}
	// get index page for categories section in admin panel
	async getIndexPage(req, res, next) {
		try {
			let page = req.query.page ?? 1;
			if (isNaN(page)) {
				req.flash('error', 'شماره صفحه نامعتبر است');
				return res.redirect('/admin/courses/');
			}
			const title = 'پنل مدیریت | دسته بندی ها';
			const categories = await Category.paginate(
				{},
				{
					limit: 6,
					page,
					sort: { createdAt: 'desc' },
					lean: true,
					populate: [{ path: 'parent', select: 'name' }],
				}
			);
			res.render('admin/category/index', { title, categories });
		} catch (error) {
			next(error);
		}
	}
	// get create category page
	async getCreatePage(req, res, next) {
		try {
			const title = 'پنل مدیریت | ایجاد دسته بندی';
			const parents = await Category.find({ parent: null });
			// return res.json(parents);
			res.render('admin/category/create', { title, parents });
		} catch (error) {
			next(error);
		}
	}
	// get edit page
	async getEditPage(req, res, next) {
		try {
			const category = await Category.findById(req.params.id)
				.lean()
				.populate([{ path: 'parent', select: 'name' }]);
			const parents = await Category.find({ parent: null }).lean();
			const title = 'پنل مدیریت | ویرایش دسته بندی';
			res.render('admin/category/edit', { title, category, parents });
		} catch (error) {
			next(error);
		}
	}
	//
	async getDeletePage(req, res, next) {
		try {
			const title = 'پنل مدیریت | حذف دسته بندی';
			const { id } = req.params;
			const foundedCategory = await Category.findById(id);
			if (!foundedCategory) return this.flashAndRedirect(req, res, 'error', 'شناسه دوره نامعتبر است');
			res.render('admin/category/delete', { title, category: foundedCategory });
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new CategoryController();
