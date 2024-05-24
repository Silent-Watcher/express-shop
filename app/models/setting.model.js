const { Schema, model } = require('mongoose');
const imageSchema = require('./schema/image.schema');

const settingSchema = new Schema({
	appName: { type: String, required: true, default: 'فروشگاه' },
	logo: { type: [imageSchema], required: false },
	favicon: { type: imageSchema, required: false },
});

const Setting = model('setting', settingSchema);

module.exports = Setting;
