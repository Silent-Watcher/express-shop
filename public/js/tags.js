'use strict';

const tagsWrap = document.querySelector('#courseTagsWrap');
const tagsString = tagsWrap.dataset.tags;

function getColor() {
	let r = Math.floor(Math.random() * 255);
	let g = Math.floor(Math.random() * 255);
	let b = Math.floor(Math.random() * 255);
	let color = `rgb(${r} , ${g} , ${b})`;
	return color;
}

window.addEventListener('load', () => {
	let tags = tagsString.split('/');
	const tagsFragment = document.createDocumentFragment();
	tags.forEach(tag => {
		if (tag.length > 0) {
			let span = document.createElement('span');
			span.className = 'badge mx-2';
			span.style.backgroundColor = getColor();
			span.innerHTML = tag;
			tagsFragment.append(span);
		}
	});
	tagsWrap.append(tagsFragment);
});
