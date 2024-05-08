const { Schema, model } = require('mongoose');

const userSchema = new Schema(
	{
		name: { type: String, required: false },
		email: { type: String, required: true, trim: true, unique: true },
		password: { type: String, required: true, trim: true },
		admin: { type: Boolean, required: true, default: false },
		photo: { type: String, required: false },
		bio: { type: String, required: false },
		rememberToken: { type: String, required: false, default: null },
	},
	{ timestamps: true, toJSON: { virtuals: true } }
);

userSchema.virtual('courses', {
	ref: 'course',
	localField: '_id',
	foreignField: 'user',
});

// eslint-disable-next-line no-unused-vars
userSchema.methods.checkIfLearning = function (course) {
	// TODO: check if a user buy a specific course
	return false;
};
userSchema.methods.isVip = function () {
	// TODO: check if a user became a vip or not
	return false;
};

const User = model('user', userSchema);

module.exports = User;
