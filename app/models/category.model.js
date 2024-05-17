const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const categorySchema = new Schema(
	{
		name: { type: String, required: true, unique: true },
		parent: { type: Schema.Types.ObjectId, ref: 'category', required: false, default: null },
	},
	{ timestamps: true, toJSON: { virtuals: true } }
);

categorySchema.plugin(mongoosePaginate);

const Category = model('category', categorySchema);

module.exports = Category;
