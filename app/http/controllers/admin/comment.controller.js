// const path = require('path');

// const sendmail = require('../../../config/mail/mailer');
// const mailTemplate = require('../../../config/mail/approvedCommentMail.template');
const Controller = require('app/http/controllers/controller');
const Comment = require('../../../models/comment.model');

class CommentController extends Controller {
	constructor() {
		super();
	}
	async edit(req, res, next) {
		try {
			const { id } = req.params;
			const comment = await Comment.findById(id, { isApproved: 1, _id: 1, course: 1, episode: 1 })
				.populate([
					// { path: 'user', select: 'email' },
					{ path: 'belongsTo', select: 'commentCount' },
				])
				.exec();
			if (!comment)
				return this.flashAndRedirect(req, res, 'error', 'دیدگاه با این شناسه یافت نشد', req.headers.referer);
			const { isApproved } = req.body;
			comment.isApproved = isApproved == '1' ? true : false;
			await comment.save();
			if (comment.isApproved == false) {
				comment.belongsTo.inc('commentCount', -1);
				return this.flashAndRedirect(
					req,
					res,
					'success',
					'دیدگاه از سایت پنهان شد و در مرحله برسی قرار گرفت',
					req.headers.referer
				);
			}
			// sendmail(
			// 	{
			// 		from: 'backendwithali@gmail.com',
			// 		to: comment.user.email,
			// 		subject: 'ثبت دیدگاه',
			// 		html: mailTemplate(''),
			// 		attachments: [
			// 			{
			// 				filename: 'logoMail.png',
			// 				path: path.join(process.cwd(), 'public', 'imgs', 'logoMail.png'),
			// 				cid: 'logo',
			// 			},
			// 		],
			// 	},
			// 	() => {
			// 		return this.flashAndRedirect(req, res, 'success', 'دیدگاه در سایت قرار گرفت', req.headers.referer);
			// 	}
			// );
			comment.belongsTo.inc('commentCount');

			return this.flashAndRedirect(req, res, 'success', 'دیدگاه در سایت قرار داده شد.', req.headers.referer);
		} catch (error) {
			next(error);
		}
	}
	async delete(req, res, next) {
		try {
			const { id } = req.params;
			const comment = await Comment.findById(id).populate(['comments', { path: 'belongsTo' }]);
			if (!comment) return this.flashAndRedirect(req, res, 'error', 'کامنت با این شناسه یافت نشد');

			// remove sub comments if there are any sub comments
			let SubCommentsCount = comment?.comments?.length ?? 0;
			let subCommentsRemovedCount = 0;
			if (SubCommentsCount) {
				comment.comments.forEach(async subComment => {
					let course = await Comment.findByIdAndDelete(subComment._id).lean();
					if (course) subCommentsRemovedCount += 1;
				});
			}

			// remove the main comment
			let result = await Comment.findByIdAndDelete(comment._id);
			if (!result) return this.flashAndRedirect(req, res, 'error', 'خطایی در حذف نظر رخ داد. لطفا مجدد تلاش کنید');

			// update the course comment count value
			let totalCommentsRemoved = subCommentsRemovedCount + 1;
			await comment.belongsTo.inc('commentCount', -1 * totalCommentsRemoved);
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
					{ path: 'course', select: 'title thumbnail slug' },
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
