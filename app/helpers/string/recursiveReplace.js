function recursiveReplace(inputString, searchValue, replaceValue) {
	const index = inputString.indexOf(searchValue);
	if (index === -1) return inputString;
	const before = inputString.slice(0, index);
	const after = inputString.slice(index + searchValue.length);
	return before + replaceValue + recursiveReplace(after, searchValue, replaceValue);
}

module.exports = recursiveReplace;
