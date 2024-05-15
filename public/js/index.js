'use strict';

function replaceEnglishWithPersianNumbers(inputString) {
	const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

	const englishNumbers = /[0-9]/g;

	return inputString.replace(englishNumbers, function (match) {
		return persianNumbers[parseInt(match)];
	});
}

window.addEventListener('load', () => {
	const numbers = document.querySelectorAll('.number');
	const closeButton = document.querySelector('.btn-close');

	// convert numbers to persian format
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
	if (closeButton != null) {
		closeButton.addEventListener('click', e => {
			let parent = e.target.parentElement;
			parent.remove();
		});
	}
});

// scroll to top
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

window.onscroll = function () {
	if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
		scrollToTopBtn.style.right = '20px';
		scrollToTopBtn.style.bottom = '20px';
	} else {
		scrollToTopBtn.style.right = '-100px';
		scrollToTopBtn.style.bottom = '-100px';
	}
};

function scrollToTop() {
	document.body.scrollTop = 0; // For Safari
	document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
}

scrollToTopBtn.addEventListener('click', scrollToTop);

window.addEventListener('scroll', function () {
	const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
	const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;

	const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;

	const progress = document.querySelector('.progress');
	progress.style.borderImage = `conic-gradient(#007bff ${scrollPercentage}%, transparent 0) 1`;
});
