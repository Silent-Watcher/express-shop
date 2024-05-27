const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ticketSchema = new Schema(
	{
		Sender: { type: Schema.Types.ObjectId, ref: 'user', required: true },
		Respondent: { type: Schema.Types.ObjectId, ref: 'user', default: undefined },
		RespondTo: { type: Schema.Types.ObjectId, ref: 'ticket', default: undefined },
		title: { type: String, required: true, unique: false },
		body: { type: String, required: true, unique: false },
		department: { type: String, enum: ['finance', 'consult', 'admin', 'support'], required: true },
		status: { type: Boolean, default: false, required: true },
	},
	{ timestamps: true }
);

ticketSchema.plugin(mongoosePaginate);

const Ticket = model('ticket', ticketSchema);

module.exports = Ticket;
