const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const imageSchema = new Schema({
	size: { type: String, required: true, unique: false },
	path: { type: String, required: true, unique: false },
});

const courseSchema = new Schema(
	{
		title: { type: String, required: true, unique: true },
		user: { type: Schema.Types.ObjectId, ref: 'User' },
		slug: { type: String, required: true, unique: true },
		type: { type: String, enum: ['free', 'paid'], required: true, default: 'free' },
		description: { type: String, required: false },
		price: { type: Number, required: true, default: 0 },
		tags: { type: String, required: false },
		viewCount: { type: Number, default: 0 },
		commentCount: { type: Number, default: 0 },
		time: { type: String, required: true, default: '00:00:00' },
		images: { type: [imageSchema], required: false, default: [] },
		thumbnail: { type: imageSchema, required: false },
	},
	{ timestamps: true }
);

courseSchema.plugin(mongoosePaginate);

const Course = model('course', courseSchema);

module.exports = Course;
