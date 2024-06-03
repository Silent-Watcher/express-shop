const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const permissionSchema = new Schema({
	name: { type: String, required: true, unique: true, trim: true },
	label: { type: String, required: true },
});

permissionSchema.plugin(mongoosePaginate);

const Permission = model('permission', permissionSchema);

module.exports = Permission;
