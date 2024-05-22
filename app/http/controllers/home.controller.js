const ZarinpalCheckout = require('zarinpal-checkout');

const httpErrors = require('http-errors');

const homeService = require('app/http/services/home.service');
const Controller = require('app/http/controllers/controller');
const Course = require('../../models/course.model');
const User = require('../../models/user.model');
const recaptcha = require('app/config/recaptcha');
const Comment = require('../../models/comment.model');
const httpStatus = require('http-status');
class HomeController extends Controller {
	#service;
	constructor() {
		super();
		this.#service = homeService;
	}
	async index(req, res, next) {
		try {
			const title = 'فروشگاه';
			const courses = await Course.find({}).lean();
			const latestCourses = await Course.find(
				{},
				{ _id: 0, __v: 0, createdAt: 0, updatedAt: 0, commentCount: 0, viewCount: 0, images: 0, user: 0, tags: 0 }
			)
				.sort({ createdAt: 'desc' })
				.limit(6)
				.lean();
			res.render('index', {
				errors: req.flash('error'),
				title,
				success: req.flash('success'),
				courses: latestCourses,
				courseCount: courses.length,
			});
		} catch (error) {
			next(error);
		}
	}
	//
	getContactUsPage(req, res, next) {
		try {
			const title = 'تماس با ما';
			res.render('pages/contactUs', { title, captcha: recaptcha.render() });
		} catch (error) {
			next(error);
		}
	}
	//
	getAboutUsPage(req, res, next) {
		try {
			const title = 'درباره ما';
			res.render('pages/aboutUs', { title });
		} catch (error) {
			next(error);
		}
	}
	//
	async comment(req, res, next) {
		try {
			const result = await Comment.create({ user: req.user._id, ...req.body });
			if (!result) return this.alertAndRedirect(req, res, 'error', 'خطایی در ثبت نظر رخ داده است', req.headers.referer);
			return this.alertAndRedirect(
				req,
				res,
				'success',
				'دیدگاه با موفقیت ارسال شد. بعد از تایید دیدگاه شما در سایت به نمایش  در میاید',
				req.headers.referer
			);
		} catch (error) {
			next(error);
		}
	}
	//
	async getCartPage(req, res, next) {
		try {
			res.render('pages/cart');
		} catch (error) {
			next(error);
		}
	}
	//
	async addProductToCart(req, res, next) {
		try {
			const { courseId } = req.body;
			const foundedCourse = await Course.findById(courseId, { id: 1 }).lean();
			if (!foundedCourse) throw new httpErrors.BadRequest('شناسه دوره نامعتبر است');
			const user = await User.findById(req.user._id, { cartItems: 1 });
			if (!user) throw new httpErrors.BadRequest('کاربر یافت نشد !');
			if (user.cartItems.indexOf(foundedCourse._id) == -1) {
				user.cartItems.push(foundedCourse._id);
				await user.save();
				return res.json({ status: res.statusCode });
			}
			return res.json({ status: httpStatus.BadRequest });
		} catch (error) {
			next(error);
		}
	}
	//
	async removeProductFromCart(req, res, next) {
		try {
			const { courseId } = req.body;
			const foundedCourse = await Course.findById(courseId, { id: 1 }).lean();
			if (!foundedCourse) throw new httpErrors.BadRequest('شناسه دوره نامعتبر است');
			const user = await User.findById(req.user._id, { cartItems: 1 });
			if (!user) throw new httpErrors.BadRequest('کاربر یافت نشد !');
			if (user.cartItems.indexOf(foundedCourse._id) != -1) {
				user.cartItems = user.cartItems.filter(item => item._id.toString() != foundedCourse._id.toString());
				await user.save();
				return res.json({ status: res.statusCode });
			}
			return res.json({ status: httpStatus.BadRequest });
		} catch (error) {
			next(error);
		}
	}
	//
	payment(req, res, next) {
		try {
			const cartItems = req.user.cartItems;
			if (cartItems.length > 0) {
				// validations before start the payment operation
				cartItems.forEach(async item => {
					const foundedCourse = await Course.findById(item, { _id: 1, type: 1, price: 1, title: 1 }).lean();
					if (!foundedCourse)
						return this.flashAndRedirect(
							req,
							res,
							'error',
							'شناسه دوره های داخل سبد خرید نا معتبر است',
							req.headers.referer
						);
					// check if the user has already bought this course or not
					if (req.user.checkIfLearning(item)) {
						return this.flashAndRedirect(
							req,
							res,
							'error',
							'شما قبلا این دوره را خریداری کرده اید',
							req.headers.referer
						);
					}
					// check if the course is vip with 0 price or just a free course
					if ((item.type == 'vip' && item.price == 0) || item.type == 'free') {
						return this.flashAndRedirect(req, res, 'error', `عملیات خرید برای دوره ${item.title} امکان پذیر نیست`);
					}
				});
				// TODO: start the payment process
				let zarinpal = ZarinpalCheckout.create('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', true);
				zarinpal
					.PaymentRequest({
						Amount: res.locals.totalCost,
						CallbackURL: 'http://localhost:3000/cart/payment/checker',
						Description: 'Hello NodeJS API.',
						Email: req.user.email,
						Mobile: '09120000000',
					})
					.then(function (response) {
						if (response.status == 100) {
							res.redirect(response.url);
						}
					})
					.catch(function (err) {
						console.log(err);
					});
			} else return this.flashAndRedirect(req, res, 'error', 'سبد خرید خالی میباشد', req.headers.referer);
			return this.flashAndRedirect(req, res, 'error', 'خطا در سرور', req.headers.referer);
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new HomeController();
