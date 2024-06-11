let ConnectRoles = require('connect-roles');
const Permission = require('../../models/permission.model');

let gate = new ConnectRoles({
	failureHandler: function (req, res, action) {
		let accept = req.headers.accept || '';
		req.app.set('layout', 'layouts/error');
		res.status(403);
		if (accept.indexOf('html')) {
			res.render('error', {
				error: {
					status: req.statusCode,
					message: 'شما به این بخش دسترسی ندارید 🤨👺',
					redirectLink: req.headers.referer,
				},
			});
		} else {
			res.send("Access Denied - You don't have permission to: " + action);
		}
	},
});

const permissions = async () => {
	return await Permission.find({}, { name: 1, _id: 1, label: 1 }).populate({ path: 'roles', select: '_id' }).lean();
};

permissions().then(permissions => {
	permissions.forEach(permission => {
		let roles = permission.roles.map(item => item._id);
		gate.use(permission.name, req => {
			return req.isAuthenticated() ? req.user.hasRole(roles) : false;
		});
	});
});

module.exports = gate;
