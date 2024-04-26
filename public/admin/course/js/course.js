'use strict';
const tags = document.getElementById('tags');
const input = document.getElementById('input-tag');
const newCourseTypeInput = document.querySelector('#newCourseType');
const newCoursePriceInput = document.querySelector('#newCoursePrice');
const newCourseTitleInput = document.querySelector('#newCourseTitle');
const courseSlugPreviewValue = document.querySelector('#courseSlugPreviewValue');
const newCourseSlugInput = document.querySelector('#newCourseSlug');

let inputValue = '';

function recursiveReplace(inputString, searchValue, replaceValue) {
	const index = inputString.indexOf(searchValue);
	if (index === -1) return inputString;
	const before = inputString.slice(0, index);
	const after = inputString.slice(index + searchValue.length);
	return before + replaceValue + recursiveReplace(after, searchValue, replaceValue);
}

input.addEventListener('keydown', function (event) {
	if (event.key == 'Enter') {
		event.preventDefault();
		let tagContent = input.value.trim();
		if (!isTagExists(tagContent)) {
			input.value = recursiveReplace(input.value, ' ', '-');
			tagContent = input.value;
			inputValue += input.value + '/';

			const tag = document.createElement('li');
			tag.className = 'd-inline-flex justify-content-between align-items-center';

			if (tagContent != '') {
				tag.innerHTML = `<p class="mb-0">${tagContent}</p>`;

				tag.addEventListener('click', event => {
					inputValue = recursiveReplace(inputValue, `${event.target.innerText}/`, '');
					input.value = inputValue;
					event.target.parentElement.remove();
				});

				tags.appendChild(tag);
				input.value = '';
			}
		}
	}
});

function isTagExists(tag) {
	let tags = inputValue.split('/');
	return tags.includes(tag);
}

input.addEventListener('blur', event => {
	if (tags.children.length == 0) input.value = '';
	else {
		let tagValues = '';
		[...tags.children].forEach(tag => {
			tagValues += tag.innerText + '/';
		});
		event.target.value = tagValues;
	}
});

input.addEventListener('focus', () => {
	input.value = '';
});

newCourseTypeInput.addEventListener('change', event => {
	if (event.target.value == 'free') {
		newCoursePriceInput.value = 0;
		newCoursePriceInput.disabled = true;
	} else newCoursePriceInput.disabled = false;
});

newCourseTitleInput.addEventListener('input', event => {
	let inputValue = event.target.value;
	let slug = recursiveReplace(inputValue, ' ', '-');
	newCourseSlugInput.value = slug;
	courseSlugPreviewValue.innerText = slug;
});

newCourseSlugInput.addEventListener('input', event => {
	let { value } = event.target;
	let slug = recursiveReplace(value, ' ', '-');
	courseSlugPreviewValue.innerText = slug;
});

window.addEventListener('load', () => {
	let tagsStringValue = document.querySelector('#storedTagValues')?.value ?? '';
	if (tagsStringValue.length > 0) {
		let tags = input.value.length > 0 ? input.value.split('/') : tagsStringValue.split('/');
		let tagsFragment = document.createDocumentFragment();
		tags.forEach(tag => {
			if (tag.length > 0) {
				let tagElem = document.createElement('li');
				tagElem.addEventListener('click', event => {
					inputValue = recursiveReplace(tagsStringValue, `${event.target.innerText}/`, '');
					input.value = inputValue;
					console.log(input.value);
					event.target.parentElement.remove();
				});
				tagElem.className = 'd-inline-flex justify-content-between align-items-center';
				tagElem.innerHTML = `<p class="mb-0">${tag}</p>`;
				tagsFragment.append(tagElem);
			}
		});
		document.querySelector('#tags').append(tagsFragment);
	}
});
