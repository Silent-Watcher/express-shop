const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const commentSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
		comment: { type: String, required: true },
		isApproved: { type: Boolean, required: true, default: false },
		parent: { type: Schema.Types.ObjectId, ref: 'comment', default: null },
		course: { type: Schema.Types.ObjectId, ref: 'course', default: undefined },
		episode: { type: Schema.Types.ObjectId, ref: 'episode', default: undefined },
	},
	{ timestamps: true, toJSON: { virtuals: true } }
);

commentSchema.virtual('comments', {
	ref: 'comment',
	localField: '_id',
	foreignField: 'parent',
});

commentSchema.virtual('belongsTo', {
	ref: doc => {
		if (doc?.course) return 'course';
		else if (doc?.episode) return 'episode';
	},
	localField: doc => {
		if (doc?.course) return 'course';
		else if (doc?.episode) return 'episode';
	},
	foreignField: '_id',
	justOne: true,
});

commentSchema.plugin(mongoosePaginate);

const Comment = model('comment', commentSchema);

module.exports = Comment;
