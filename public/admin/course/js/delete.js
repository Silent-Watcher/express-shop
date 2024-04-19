'use strict';

const isOkToDelete = document.querySelector('#isOkToDelete');
const deleteCourseInput = document.querySelector('#deleteCourseInput');
const deleteCourseButton = document.querySelector('#deleteCourseButton');

isOkToDelete.addEventListener('change', e => {
	const deleteFormSection = document.querySelector('.deleteFormSection');
	if (e.target.checked === true) deleteFormSection.hidden = false;
	else deleteFormSection.hidden = true;
});

deleteCourseInput.addEventListener('input', event => {
	if (event.target.value == event.target.dataset.course) {
		deleteCourseButton.disabled = false;
		deleteCourseButton.classList.add('active');
	} else {
		deleteCourseButton.disabled = true;
		deleteCourseButton.classList.remove('active');
	}
});
