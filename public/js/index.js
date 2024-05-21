'use strict';
/* eslint-disable no-undef */

function replaceEnglishWithPersianNumbers(inputString) {
	const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

	const englishNumbers = /[0-9]/g;

	inputString = inputString.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
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

// remove product item from cart
const removeCourseFromCartBtns = document.querySelectorAll('.removeCourseFromCartBtn');
const removeCourseBtns = document.querySelectorAll('.delete-course');

removeCourseBtns.forEach(btn => {
	btn.addEventListener('click', deleteCourseFromCart);
});
removeCourseFromCartBtns.forEach(btn => {
	btn.addEventListener('click', deleteCourseFromCart);
});

async function deleteCourseFromCart(e) {
	const Toast = Swal.mixin({
		toast: true,
		position: 'top-end',
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		didOpen: toast => {
			toast.onmouseenter = Swal.stopTimer;
			toast.onmouseleave = Swal.resumeTimer;
		},
	});
	const courseId = e.target.parentElement.dataset.courseid;
	const cartItem = e.target.parentElement.parentElement;
	// send ajax request to the server
	const response = await fetch('/cart/remove-item', {
		method: 'delete',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ courseId }),
	});
	if (!response.ok) {
		Toast.fire({
			icon: 'error',
			title: 'حذف محصول با موفقیت انجام نشد',
		});
	}
	cartItem.remove();
	Toast.fire({
		icon: 'success',
		title: 'محصول با موفقیت از سبد خرید حذف شد',
	}).then(() => {
		window.location.reload();
	});
}
