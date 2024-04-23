const { Schema, model } = require('mongoose');

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
		images: { type: [String], required: false, default: [] },
	},
	{ timestamps: true }
);

const Course = model('course', courseSchema);

module.exports = Course;
