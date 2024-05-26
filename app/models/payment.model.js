const { Schema, model } = require('mongoose');

const paymentSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: 'user' },
		transid: { type: String, required: true },
		course: { type: [Schema.Types.ObjectId], ref: 'course', default: undefined },
		vip: { type: Boolean, default: false },
		wallet: { type: Boolean, default: false },
		amount: { type: Number, required: true },
		status: { type: Boolean, required: true, default: false },
	},
	{ timestamps: true }
);

const Payment = model('payment', paymentSchema);

module.exports = Payment;
