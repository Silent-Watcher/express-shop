const numbers = document.querySelectorAll('.number');
const closeButton = document.querySelectorAll('.btn-close')[1];

function replaceEnglishWithPersianNumbers(inputString, useSeparator = true) {
	const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

	const englishNumbers = /[0-9]/g;
	if (useSeparator) {
		inputString = inputString.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
	}
	return inputString.replace(englishNumbers, function (match) {
		return persianNumbers[parseInt(match)];
	});
}

const phoneInput = document.querySelector('#phone');
if (phoneInput) {
	phoneInput.value = replaceEnglishWithPersianNumbers(phoneInput.value, false);
}

// convert numbers to persian format
numbers.forEach(number => {
	let value = number.dataset.value;
	number.innerHTML = replaceEnglishWithPersianNumbers(value);
});

if (closeButton) {
	closeButton.addEventListener('click', e => {
		let parent = e.target.parentElement;
		parent.remove();
	});
}
