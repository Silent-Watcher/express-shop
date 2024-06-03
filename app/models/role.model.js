const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const roleSchema = new Schema({
	title: { type: String, required: true, trim: true, unique: true },
	label: { type: String, required: true, trim: true },
	permissions: { type: [Schema.Types.ObjectId], ref: 'permission', required: true, default: [] },
});

roleSchema.plugin(mongoosePaginate);

const Role = model('role', roleSchema);

module.exports = Role;
