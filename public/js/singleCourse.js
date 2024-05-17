'use strict';
const courseLikeBtn = document.querySelector('#courseLikeBtn');
const pageData = document.querySelector('#pageData');
const courseLikes = document.querySelector('#courseLikes');
const startInputs = document.querySelectorAll('.startInput');
let canUserRate = document.querySelector('#courseData').dataset.canrate;

function loadAndDisplayCourseTags() {
	const tagsWrap = document.querySelector('#courseTagsWrap');
	const tagsString = tagsWrap?.dataset.tags ?? '';
	if (tagsString.length > 0) {
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
			console.log('data: ', data);
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

async function rateCourse(courseId, value) {
	try {
		const response = await fetch(`/courses/${courseId}/rate`, {
			method: 'POST',

			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ value }),
		});

		return response;
	} catch (error) {
		console.error(error);
	}
}

window.addEventListener('load', () => {
	// load and display course tags
	loadAndDisplayCourseTags();
	// like a single course
	courseLikeBtn.addEventListener('click', async () => {
		await likeCourse(pageData.dataset.courseid);
	});
	// rate a single courses page
	// rating.addEventListener('submit', e => {
	// 	e.preventDefault();
	// 	console.log(e);
	// });
	startInputs.forEach(startInput => {
		startInput.addEventListener('change', async event => {
			if (canUserRate) {
				let response = await rateCourse(pageData.dataset.courseid, event.target.value);
				if (response.ok) {
					canUserRate = false;
					const data = await response.json();
					document.querySelector('#ratesCount').innerHTML = data.totalRates;
					document.querySelector('#courseScore').innerHTML = data.score;
					alert('امتیاز شما با موفقیت ثبت شد');
					return data;
				} else alert('خطا در به روز رسانی دوره ');
			} else {
				alert('شما قبلا به این دوره امتیاز داده اید');
			}
		});
	});
});
