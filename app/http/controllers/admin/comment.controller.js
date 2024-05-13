const Controller = require('app/http/controllers/controller');
const Comment = require('../../../models/comment.model');

class CommentController extends Controller {
	constructor() {
		super();
	}
	async edit(req, res, next) {
		try {
			const { id } = req.params;
			const comment = await Comment.findById(id);
			if (!comment)
				return this.flashAndRedirect(req, res, 'error', 'دیدگاه با این شناسه یافت نشد', req.headers.referer);
			const { isApproved } = req.body;
			comment.isApproved = isApproved == '1' ? true : false;
			await comment.save();
			return this.flashAndRedirect(req, res, 'success', 'وضعیت دیدگاه با موفقیت تغییر کرد', req.headers.referer);
		} catch (error) {
			next(error);
		}
	}
	async delete(req, res, next) {
		try {
			const { id } = req.params;
			const comment = await Comment.findById(id).lean();
			if (!comment) return this.flashAndRedirect(req, res, 'error', 'کامنت با این شناسه یافت نشد');
			let result = await Comment.findByIdAndDelete(id);
			if (!result) return this.flashAndRedirect(req, res, 'error', 'خطایی در حذف نظر رخ داد. لطفا مجدد تلاش کنید');
			return this.flashAndRedirect(req, res, 'success', `نظر با آیدی ${id} با موفقیت حذف شد`, '/admin/comments');
		} catch (error) {
			next(error);
		}
	}
	async getIndexPage(req, res, next) {
		try {
			let page = req.query.page ?? 1;
			if (isNaN(page)) {
				req.flash('شماره صفحه نامعتبر است');
				return res.redirect('/admin/courses/');
			}
			const title = 'پنل مدیریت | نظرات';
			const comments = await Comment.paginate(
				{},
				{
					limit: 4,
					page,
					sort: { createdAt: 'desc' },
					lean: true,
					populate: [
						{ path: 'user', select: 'name photo' },
						{ path: 'course', select: 'title' },
						{ path: 'episode', select: 'title' },
					],
				}
			);
			res.render('admin/comment', { title, comments });
		} catch (error) {
			next(error);
		}
	}
	async getEditPage(req, res, next) {
		try {
			const { id } = req.params;
			const comment = await Comment.findById(id)
				.lean()
				.populate([
					{ path: 'course', select: 'title thumbnail' },
					'episode',
					{ path: 'user', select: 'name photo email' },
				]);
			if (!comment)
				return this.flashAndRedirect(req, res, 'error', 'دیدگاه با این شناسه یافت نشد', req.headers.referer);
			const title = 'پنل مدیریت | تنظیمات دیدگاه';
			res.render('admin/comment/edit', { title, comment });
		} catch (error) {
			next(error);
		}
	}
	async getDeletePage(req, res, next) {
		try {
			const { id } = req.params;
			const title = 'پنل مدیریت | حذف دیدگاه';
			const comment = await Comment.findById(id).lean();
			res.render('admin/comment/delete', { title, comment });
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new CommentController();
