function isNumeric(value) {
	return !isNaN(value) && typeof value !== 'boolean';
}

module.exports = isNumeric;
