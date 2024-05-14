function convertToPersianNum(num) {
	const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

	const englishNumbers = /[0-9]/g;

	return num.replace(englishNumbers, function (match) {
		return persianNumbers[parseInt(match)];
	});
}

module.exports = convertToPersianNum;
