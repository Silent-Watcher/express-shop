const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const imageSchema = new Schema({
	size: { type: String, required: true, unique: false },
	path: { type: String, required: true, unique: false },
});

const courseSchema = new Schema(
	{
		title: { type: String, required: true, unique: true },
		user: { type: Schema.Types.ObjectId, ref: 'user' },
		slug: { type: String, required: true, unique: true },
		type: { type: String, enum: ['free', 'paid'], required: true, default: 'free' },
		description: { type: String, required: false },
		price: { type: Number, required: true, default: 0 },
		tags: { type: String, required: false },
		viewCount: { type: Number, default: 0 },
		commentCount: { type: Number, default: 0 },
		likeCount: { type: Number, default: 0 },
		time: { type: String, required: true, default: '00:00:00' },
		images: { type: [imageSchema], required: false, default: [] },
		thumbnail: { type: imageSchema, required: false },
	},
	{ timestamps: true, toJSON: { virtuals: true } }
);

courseSchema.virtual('episodes', {
	ref: 'episode',
	localField: '_id',
	foreignField: 'course',
});

courseSchema.virtual('comments', {
	ref: 'comment',
	localField: '_id',
	foreignField: 'course',
});

courseSchema.methods.inc = async function (field, number = 1) {
	this[field] += number;
	await this.save();
};

courseSchema.methods.isLiked = function (user) {
	const isLiked = user.likedCourses.indexOf(this._id) == -1 ? false : true;
	return isLiked;
};

courseSchema.plugin(mongoosePaginate);

const Course = model('course', courseSchema);

module.exports = Course;
