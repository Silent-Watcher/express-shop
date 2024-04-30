'use strict';
// modal close button
const closeButton = document.querySelector('.btn-close');
if (closeButton != null) {
	closeButton.addEventListener('click', e => {
		let parent = e.target.parentElement;
		parent.remove();
	});
}

function replaceEnglishWithPersianNumbers(inputString) {
	const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

	const englishNumbers = /[0-9]/g;

	return inputString.replace(englishNumbers, function (match) {
		return persianNumbers[parseInt(match)];
	});
}

const coursePrices = Array.from(document.querySelectorAll('.course-price'));
const courseTimes = Array.from(document.querySelectorAll('.course-time'));
window.addEventListener('load', () => {
	coursePrices.forEach(coursePrice => {
		let price = coursePrice.dataset.price;
		coursePrice.innerHTML = replaceEnglishWithPersianNumbers(price);
	});
	courseTimes.forEach(courseTime => {
		let time = courseTime.dataset.time;
		courseTime.innerHTML = replaceEnglishWithPersianNumbers(time);
	});
});
