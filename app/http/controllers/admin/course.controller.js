const sharp = require('sharp');

const fs = require('fs');

const slugify = require('slugify');
const Controller = require('app/http/controllers/controller');
const Course = require('../../../models/course.model');
const { STATIC_FILES_PATH } = require('../../../common/globals');
const path = require('path');
const recursiveReplace = require('../../../helpers/string/recursiveReplace');

class CourseController extends Controller {
	constructor() {
		super();
	}
	//
	async create(req, res, next) {
		try {
			const { title, type, slug, description, price, tags } = req.body;
			const image = req?.file;
			let imageAddrs = [];
			if (image) imageAddrs = Object.values(this.resizeImage(image.path));
			await Course.create({
				title,
				type,
				slug: slugify(slug, { lower: true, replacement: '-' }),
				description,
				user: req.user._id,
				images: imageAddrs ?? [],
				thumbnail: imageAddrs.find(imageAddr => imageAddr.size == '480'),
				price,
				tags,
			});
			return this.flashAndRedirect(req, res, 'success', `دوره ${title} با موفقیت ایجاد شد`, '/admin/courses');
		} catch (error) {
			next({ status: 500, message: `something went wrong !`, stack: error.stack });
		}
	}
	//
	async edit(req, res, next) {
		try {
			const foundedCourse = await Course.findById(req.body.courseId);
			if (!foundedCourse) {
				req.flash('error', 'شناسه دوره نامعتبر است');
				return res.redirect(`/admin/courses/${req.body.courseId}/edit`);
			}
			// add new image
			const image = req?.file;
			let imageAddrs = null;
			if (image) {
				// remove the old images
				this.removeCourseImages(foundedCourse.images);
				imageAddrs = this.resizeImage(image.path);
			}

			const updatedCourse = await Course.updateOne(
				{ _id: req.body.courseId },
				{
					$set: {
						...req.body,
						images: imageAddrs ?? foundedCourse.images,
						thumbnail: imageAddrs?.find(imageAddr => imageAddr.size == '480') ?? foundedCourse.thumbnail,
					},
				}
			);
			if (!updatedCourse) {
				return this.flashAndRedirect(
					req,
					res,
					'error',
					`عملیات به روز رسانی دوره ${req.body.title} ناموفق بود. دوباره تلاش کنید`,
					`/admin/courses/${req.body.courseId}/edit`
				);
			}
			return this.flashAndRedirect(
				req,
				res,
				'success',
				`دوره ${req.body.title} با موفقیت به روز رسانی شد`,
				'/admin/courses'
			);
		} catch (error) {
			next({ status: 500, message: `something went wrong !`, stack: error.stack });
		}
	}
	//
	async delete(req, res, next) {
		try {
			const { course } = req.body;
			const { id } = req.params;
			const foundedCourse = await Course.findOneAndDelete({
				$and: [{ title: course }, { _id: id }],
			});
			if (!foundedCourse) {
				req.flash('error', `عملیات حذف دوره موفقیت آمیز نبود . لطفا مجدد تلاش کنید.`);
				return res.redirect(`/admin/courses/${req.body.courseId}/delete`);
			} else {
				this.removeCourseImages(foundedCourse.images);
				req.flash('success', 'دوره با موفقیت حذف شد');
			}
			return res.redirect(`/admin/courses`);
		} catch (error) {
			next({ status: 500, message: `something went wrong !`, stack: error.stack });
		}
	}
	//
	async getIndexPage(req, res, next) {
		try {
			let page = req.query.page ?? 1;
			if (isNaN(page)) {
				req.flash('شماره صفحه نامعتبر است');
				return res.redirect('/admin/courses/');
			}
			const title = 'پنل مدیریت | دوره ها';
			const courses = await Course.paginate({}, { limit: 4, page, sort: { createdAt: 'desc' }, lean: true });
			return res.render('admin/course/index', { title, courses });
		} catch (error) {
			next({ status: 500, message: `something went wrong !`, stack: error.stack });
		}
	}
	//
	getCreateCoursePage(req, res, next) {
		try {
			const title = 'پنل مدیریت | ایجاد دوره';
			res.render('admin/course/create', { title });
		} catch (error) {
			next(error);
		}
	}
	//
	async getEditCoursePage(req, res, next) {
		try {
			const title = 'پنل مدیریت | ویرایش دوره';
			const course = await Course.findById(req.params.id).lean();
			if (!course) {
				return this.flashAndRedirect(req, res, 'error', 'آیدی دوره نامعتبر است', '/admin/courses');
			}
			res.render('admin/course/edit', { title, course });
		} catch (error) {
			next(error);
		}
	}
	//
	async getDeleteCoursePage(req, res, next) {
		try {
			const title = 'پنل مدیریت | حذف دوره';
			const course = await Course.findById(req.params.id).lean();
			if (!course) {
				req.flash('error', 'آیدی دوره نامعتبر است');
				res.redirect('/admin/courses');
			}
			res.render('admin/course/delete', { title, course });
		} catch (error) {
			next(error);
		}
	}
	removeCourseImages(images) {
		if (images.length > 0) {
			images.forEach(image => {
				let imagePath = image.path.replace('/static/', `${STATIC_FILES_PATH}\\`);
				let optimizedPath = recursiveReplace(imagePath, '\\', '/');
				if (fs.existsSync(optimizedPath)) fs.unlinkSync(optimizedPath);
			});
		}
	}
	createImageUrlAddr(imagePath) {
		return imagePath.replace(`${STATIC_FILES_PATH}\\`, '/static/');
	}
	resizeImage(filePath) {
		const imageInfo = path.parse(filePath);
		const imageSizes = [1080, 720, 480];
		let [image, imgAddr] = [{}, ''];
		let images = [];
		image.path = this.createImageUrlAddr(filePath);
		image.size = 'original';
		images.push(image);
		imageSizes.map(size => {
			imgAddr = path.join(imageInfo.dir, `${imageInfo.name}-${size}${imageInfo.ext}`);
			let image = {};
			image.path = this.createImageUrlAddr(imgAddr);
			image.size = size;
			images.push(image);
			sharp(filePath).resize(size, null, { fit: 'fill' }).toFile(imgAddr);
		});
		return images;
	}
}

module.exports = new CourseController();
