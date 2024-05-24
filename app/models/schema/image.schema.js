const { Schema } = require('mongoose');

const imageSchema = new Schema({
	size: { type: String, required: true, unique: false },
	path: { type: String, required: true, unique: false },
});

module.exports = imageSchema;
