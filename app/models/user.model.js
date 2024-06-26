const { Schema, model } = require('mongoose');
// const avatarSchema = require('./schema/avatar.scheme');
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = new Schema(
	{
		firstName: { type: String, required: false, unique: false },
		lastName: { type: String, required: false, unique: false },
		email: { type: String, required: true, trim: true, unique: true },
		phone: { type: String, required: false },
		password: { type: String, required: true, trim: true },
		admin: { type: Boolean, required: true, default: false },
		photos: [{ source: String, path: String }],
		avatar: { source: String, path: String },
		bio: { type: String, required: false },
		roles: { type: [Schema.Types.ObjectId], ref: 'role' },
		rememberToken: { type: String, required: false, default: null },
		learning: { type: [Schema.Types.ObjectId], ref: 'course' },
		likedCourses: { type: [Schema.Types.ObjectId], ref: 'course' },
		cartItems: { type: [Schema.Types.ObjectId], ref: 'course' },
		wallet: { type: Number, required: true, default: 0 },
	},
	{ timestamps: true, toJSON: { virtuals: true } }
);

userSchema.virtual('courses', {
	ref: 'course',
	localField: '_id',
	foreignField: 'user',
});

userSchema.virtual('ratedCourses', {
	ref: 'rating',
	localField: '_id',
	foreignField: 'user',
});

userSchema.virtual('tickets', {
	ref: 'ticket',
	localField: '_id',
	foreignField: 'sender',
});

userSchema.virtual('transactions', {
	ref: 'payment',
	localField: '_id',
	foreignField: 'user',
});

userSchema.virtual('comments', {
	ref: 'comment',
	localField: '_id',
	foreignField: 'user',
});

// eslint-disable-next-line no-unused-vars
userSchema.methods.checkIfLearning = function (courseId) {
	return this.learning.indexOf(courseId) == -1 ? false : true;
};

userSchema.methods.hasRole = function (roles) {
	let result = roles.filter(role => {
		return this.roles.indexOf(role) > -1;
	});
	return !!result.length;
};

userSchema.methods.isVip = function () {
	// TODO: check if a user became a vip or not
	return false;
};

userSchema.plugin(mongoosePaginate);

const User = model('user', userSchema);

module.exports = User;
