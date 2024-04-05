'use strict';
// eslint-disable-next-line no-unused-vars
function recaptchaCallback() {
	let submitButton = document.querySelector('.submitButton');
	submitButton.disabled = false;
}

// modal close button
const closeButton = document.querySelector('.btn-close');
closeButton.addEventListener('click', e => {
	let parent = e.target.parentElement;
	parent.remove();
});
