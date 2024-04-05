function normalizeStatusCode(status) {
	const code = parseInt(status);

	if (isNaN(code)) {
		throw new Error('Invalid status code. Please provide a valid numeric value.');
	}

	const normalizedCode = Math.max(100, Math.min(code, 599));

	// Check if the normalized code matches the original input
	if (normalizedCode !== code) {
		throw new Error('invalid port range');
	}

	return code;
}

module.exports = normalizeStatusCode;
