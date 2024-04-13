const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	service: 'gmail',
	host: 'smtp.gmail.com',
	port: 587,
	secure: false,
	auth: {
		user: 'backendwithali@gmail.com',
		pass: 'mvno uiub ausb ihvt',
	},
});

const sendmail = async (mailDetails, callback) => {
	try {
		const info = await transporter.sendMail(mailDetails);
		callback(info);
	} catch (error) {
		console.log(error, 'error');
	}
};

module.exports = sendmail;
