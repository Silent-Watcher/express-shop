'use strict';

const tagsWrap = document.querySelector('#courseTagsWrap');
const tagsString = tagsWrap.dataset.tags;

window.addEventListener('load', () => {
	let tags = tagsString.split('/');
	const tagsFragment = document.createDocumentFragment();
	tags.forEach(tag => {
		if (tag.length > 0) {
			let span = document.createElement('span');
			span.className = 'badge mx-2';
			span.style.backgroundColor = '#808080';
			span.innerHTML = tag;
			tagsFragment.append(span);
		}
	});
	tagsWrap.append(tagsFragment);
});
