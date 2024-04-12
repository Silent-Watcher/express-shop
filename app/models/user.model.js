const { Schema, model } = require('mongoose');

const userSchema = new Schema(
	{
		name: { type: String, required: false },
		email: { type: String, required: true, trim: true, unique: true },
		password: { type: String, required: true, trim: true },
		admin: { type: Boolean, required: true, default: false },
		photo: { type: String, required: false },
		rememberToken: { type: String, required: false, default: null },
	},
	{ timestamps: true }
);

const User = model('user', userSchema);

module.exports = User;
