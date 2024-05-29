const { Schema } = require('mongoose');

const avatarSchema = new Schema({
	source: { type: String, required: true, unique: false },
	path: { type: String, required: true, unique: false },
});

module.exports = avatarSchema;
