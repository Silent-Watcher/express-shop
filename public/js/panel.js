const numbers = document.querySelectorAll('.number');
function replaceEnglishWithPersianNumbers(inputString) {
	const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

	const englishNumbers = /[0-9]/g;

	inputString = inputString.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
	return inputString.replace(englishNumbers, function (match) {
		return persianNumbers[parseInt(match)];
	});
}

// convert numbers to persian format
numbers.forEach(number => {
	let value = number.dataset.value;
	number.innerHTML = replaceEnglishWithPersianNumbers(value);
});
