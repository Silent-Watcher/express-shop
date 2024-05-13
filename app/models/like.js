const { Schema, model } = require('mongoose');

const likeSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: 'user' },
		course: { type: Schema.Types.ObjectId, ref: 'course', default: undefined },
		episode: { type: Schema.Types.ObjectId, ref: 'episode', default: undefined },
		comment: { type: Schema.Types.ObjectId, ref: 'comment', default: undefined },
	},
	{ timestamps: true, toJSON: { virtuals: true } }
);

const Like = model('likes', likeSchema);

module.exports = Like;
