'use strict';
// modal close button
const closeButton = document.querySelector('.btn-close');
if (closeButton != null) {
	closeButton.addEventListener('click', e => {
		let parent = e.target.parentElement;
		parent.remove();
	});
}
