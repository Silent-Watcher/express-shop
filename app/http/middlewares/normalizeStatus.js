function normalizeStatusCode(status) {
	const code = parseInt(status);

	if (isNaN(code)) throw new Error('Invalid status code. Please provide a valid numeric value.');

	const normalizedCode = Math.max(100, Math.min(code, 599));

	if (code == 11000) throw new Error('duplicate key in mongodb');

	if (normalizedCode !== code) throw new Error('invalid port range');
}

module.exports = normalizeStatusCode;
