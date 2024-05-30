const request = require('superagent');

const httpErrors = require('http-errors');

const homeService = require('app/http/services/home.service');
const Controller = require('app/http/controllers/controller');
const Course = require('../../models/course.model');
const User = require('../../models/user.model');
const recaptcha = require('app/config/recaptcha');
const Comment = require('app/models/comment.model');
const httpStatus = require('http-status');
const Payment = require('../../models/payment.model');
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
				const params = {
					pin: 'sandbox',
					callback: 'http://localhost:3000/cart/payment/checker',
					amount: res.locals.totalCost,
				};
				// send req to payment gateway
				request
					.post('https://panel.aqayepardakht.ir/api/v2/create')
					.send(params)
					.then(async response => {
						let responseObj = JSON.parse(response.text);
						if (responseObj.status == 'success') {
							let payment = new Payment({
								user: req.user._id,
								transid: responseObj.transid,
								amount: res.locals.totalCost,
								course: cartItems,
							});
							await payment.save();
							res.redirect(`https://panel.aqayepardakht.ir/startpay/sandbox/${responseObj.transid}`);
						}
					})
					.catch(error => {
						return res.json(error);
					});
			} else return this.flashAndRedirect(req, res, 'error', 'سبد خرید خالی میباشد', req.headers.referer);
			// return this.flashAndRedirect(req, res, 'error', 'خطا در سرور', req.headers.referer);
		} catch (error) {
			next(error);
		}
	}
	//
	async checkPayment(req, res, next) {
		try {
			const transInfo = req.body;
			if (transInfo?.status != 1) {
				return this.alertAndRedirect(req, res, 'info', 'پرداخت با موفقیت انجام نشد', '/');
			}
			let foundedTrans = await Payment.findOne({ user: req.user._id, transid: transInfo.transid });
			if (!foundedTrans) return this.alertAndRedirect(req, res, 'error', 'داده ارسالی پرداخت نادرست است', '/');
			let verifyParams = {
				pin: 'sandbox',
				amount: foundedTrans.amount,
				transid: foundedTrans.transid,
			};
			const verifyTransResponse = await request.post('https://panel.aqayepardakht.ir/api/v2/verify').send(verifyParams);
			if (verifyTransResponse.status == 200) {
				let responseObj = JSON.parse(verifyTransResponse.text);
				foundedTrans.status = responseObj.code == 1 ? true : false;
				const user = await User.findById(req.user._id, { cartItems: 1, learning: 1 });
				user.learning = user.cartItems;
				user.cartItems = [];
				await user.save();
				await foundedTrans.save();
				return this.alertAndRedirect(req, res, 'success', 'پرداخت با موفقیت انجام شد', '/me/courses');
			} else return this.alertAndRedirect(req, res, 'info', 'پرداخت با موفقیت انجام نشد', '/');
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new HomeController();
