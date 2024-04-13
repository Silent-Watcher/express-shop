function normalizePort(err, req, res, next) {
	try {
		let status = err.status || err.code || err.statusCode || 500;
		const code = parseInt(status);

		if (isNaN(code)) throw new Error('Invalid status code. Please provide a valid numeric value.');

		const normalizedCode = Math.max(100, Math.min(code, 599));

		if (code == 11000) throw new Error('duplicate key in mongodb');

		// Check if the normalized code matches the original input
		if (normalizedCode !== code) throw new Error('invalid port range');

		return next();
	} catch (error) {
		next(error);
	}
}

module.exports = normalizePort;
