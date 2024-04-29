const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const episodeSchema = new Schema(
	{
		title: { type: String, required: true, unique: true },
		course: { type: Schema.Types.ObjectId, ref: 'Course' },
		courseTitle: { type: String, required: false },
		type: { type: String, enum: ['paid', 'free'], required: true, unique: false, default: 'free' },
		url: { type: String, required: true, unique: true },
		description: { type: String, required: false },
		time: { type: String, required: true, default: '00:00:00' },
		number: { type: Number, required: true, default: 0 },
		viewCount: { type: Number, default: 0 },
		commentCount: { type: Number, default: 0 },
		downloadCount: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

episodeSchema.plugin(mongoosePaginate);

const Episode = model('episode', episodeSchema);

module.exports = Episode;
