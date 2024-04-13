const { Schema, model } = require('mongoose');

const passwordResetSchema = new Schema(
	{
		email: { type: String, required: true, trim: true, unique: false },
		token: { type: String, required: true, trim: true },
		use: { type: Boolean, required: true, default: false },
	},
	{ timestamps: { updatedAt: false } }
);

const PasswordReset = model('passwordReset', passwordResetSchema);

module.exports = PasswordReset;
