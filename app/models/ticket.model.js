const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ticketSchema = new Schema(
	{
		sender: { type: Schema.Types.ObjectId, ref: 'user', required: true },
		respondent: { type: Schema.Types.ObjectId, ref: 'user', default: undefined },
		respondTo: { type: Schema.Types.ObjectId, ref: 'ticket', default: undefined },
		title: { type: String, unique: false },
		body: { type: String, required: true, unique: false },
		department: { type: String, enum: ['finance', 'consult', 'admin', 'support'] },
		status: { type: Boolean },
	},
	{ timestamps: true, toJSON: { virtuals: true } }
);

ticketSchema.virtual('answers', {
	ref: 'ticket',
	localField: '_id',
	foreignField: 'respondTo',
});

ticketSchema.plugin(mongoosePaginate);

const Ticket = model('ticket', ticketSchema);

module.exports = Ticket;
