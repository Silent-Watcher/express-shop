const { Schema, model } = require('mongoose');

const ratingSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
		value: { type: Number, required: true, default: 0 },
		course: { type: Schema.Types.ObjectId, ref: 'course', required: true },
	},
	{ toJSON: { virtuals: true } }
);

const Rating = model('rating', ratingSchema);

module.exports = Rating;
