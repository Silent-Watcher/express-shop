'use strict';

function replaceEnglishWithPersianNumbers(inputString) {
	const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

	const englishNumbers = /[0-9]/g;

	return inputString.replace(englishNumbers, function (match) {
		return persianNumbers[parseInt(match)];
	});
}

window.addEventListener('load', () => {
	// convert numbers to persian format
	const numbers = document.querySelectorAll('.number');
	numbers.forEach(number => {
		let value = number.dataset.value;
		number.innerHTML = replaceEnglishWithPersianNumbers(value);
	});
	// main page slider
	// eslint-disable-next-line no-undef
	new Swiper('.swiper', {
		direction: 'vertical',
		loop: true,
		pagination: {
			el: '.swiper-pagination',
		},
	});
	// modal close button
	const closeButton = document.querySelector('.btn-close');
	if (closeButton != null) {
		closeButton.addEventListener('click', e => {
			let parent = e.target.parentElement;
			parent.remove();
		});
	}
});
