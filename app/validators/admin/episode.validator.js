const { body } = require('express-validator');
const Episode = require('../../models/episode.model');

function validateCreateEpisodeData() {
	return [
		body('title').isString().trim().not().isEmpty().escape().withMessage('عنوان ویدیو جلسه نامعتبر است.'),
		body('type')
			.custom(value => {
				let typeWhiteList = ['vip', 'free', 'paid'];
				return typeWhiteList.includes(value);
			})
			.withMessage('نوع ویدیو نامعتبر است'),
		body('time')
			.custom(value => {
				return value.match('([0-5]{1}[0-9]{1}:){0,2}[0-5]{0,1}[0-9]{1}(\\.\\d+)?');
			})
			.withMessage('مدت زمان دوره یه مقدار نامعتبر است'),
		body('url').isString().withMessage('لینک دانلود دوره نامعتبر است'),
		body('url')
			.custom(async value => {
				let foundedUrl = await Episode.find({ url: value });
				return foundedUrl;
			})
			.withMessage('یک ویدیو با این لینک دانلود قبلا در سایت ثبت شده است'),
		body('number').isNumeric().withMessage('شماره ویدیو باید یه مقدار عددی باشد'),
		body('description').isString().trim().escape().withMessage('متن توضیحات ویدیو معتبر نیست'),
		body('course').isMongoId().withMessage('آیدی مربوط به دوره ویدیو نامعتبر است'),
	];
}

function validateEditCourseData() {
	return [
		body('title').isString().trim().not().isEmpty().escape().withMessage('عنوان ویدیو جلسه نامعتبر است.'),
		body('title')
			.isString()
			.escape()
			.custom(async (value, { req }) => {
				const foundedEpisode = await Episode.findOne(
					{ title: value, course: req.body.course, _id: { $ne: req.body.episodeId } },
					{ title: 1 }
				).lean();
				if (foundedEpisode) throw new Error('چنین جلسه ای با این عنوان قبلا در سایت قرار داده شده است.');
			}),
		body('type')
			.custom(value => {
				let typeWhiteList = ['vip', 'free', 'paid'];
				return typeWhiteList.includes(value);
			})
			.withMessage('نوع ویدیو نامعتبر است'),
		body('time')
			.custom(value => {
				return value.match('([0-5]{1}[0-9]{1}:){0,2}[0-5]{0,1}[0-9]{1}(\\.\\d+)?');
			})
			.withMessage('مدت زمان دوره یه مقدار نامعتبر است'),
		body('url').isString().withMessage('لینک دانلود دوره نامعتبر است'),
		body('url')
			.custom(async value => {
				let foundedUrl = await Episode.find({ url: value });
				return foundedUrl;
			})
			.withMessage('یک ویدیو با این لینک دانلود قبلا در سایت ثبت شده است'),
		body('number').isNumeric().withMessage('شماره ویدیو باید یه مقدار عددی باشد'),
		body('number').custom(async (value, { req }) => {
			const foundedEpisode = await Episode.findOne(
				{ number: value, course: req.body.course, _id: { $ne: req.body.episodeId } },
				{ number: 1 }
			).lean();
			if (foundedEpisode) throw new Error('این شماره ویدیو قبلا استفاده شده است');
		}),
		body('description').isString().trim().escape().withMessage('متن توضیحات ویدیو معتبر نیست'),
		body('course').isMongoId().withMessage('آیدی مربوط به دوره ویدیو نامعتبر است'),
	];
}

module.exports = { validateCreateEpisodeData, validateEditCourseData };
