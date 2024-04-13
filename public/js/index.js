'use strict';
// modal close button
const closeButton = document.querySelector('.btn-close');
closeButton.addEventListener('click', e => {
	let parent = e.target.parentElement;
	parent.remove();
});
