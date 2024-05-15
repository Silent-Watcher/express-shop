'use strict';
const courseLikeBtn = document.querySelector('#courseLikeBtn');
const pageData = document.querySelector('#pageData');
const courseLikes = document.querySelector('#courseLikes');

function loadAndDisplayCourseTags() {
	const tagsWrap = document.querySelector('#courseTagsWrap');
	const tagsString = tagsWrap.dataset.tags;
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
}

function replaceEnglishWithPersianNumbers(inputString) {
	const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

	const englishNumbers = /[0-9]/g;

	return inputString.replace(englishNumbers, function (match) {
		return persianNumbers[parseInt(match)];
	});
}

async function likeCourse(courseId) {
	try {
		const response = await fetch(`/courses/${courseId}/like`, {
			method: 'POST',
		});

		if (response.ok) {
			const data = await response.json();
			const { likesCount, likeStatus } = data;
			courseLikes.innerHTML = replaceEnglishWithPersianNumbers(likesCount.toString());
			if (likeStatus == 'liked') courseLikeBtn.classList.replace('link-dark', 'link-danger');
			else courseLikeBtn.classList.replace('link-danger', 'link-dark');
		} else {
			alert('خطا در به روز رسانی تعداد لایک ها');
		}
	} catch (error) {
		console.error(error);
	}
}

window.addEventListener('load', () => {
	// load and display course tags
	loadAndDisplayCourseTags();
	// like a single course
	courseLikeBtn.addEventListener('click', () => {
		likeCourse(pageData.dataset.courseid);
	});
});
