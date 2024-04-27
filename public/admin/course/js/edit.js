const useDefaultImageInput = document.querySelector('#useDefaultImage');
const editCourseImageSection = document.querySelector('#editCourseImageSection');

useDefaultImageInput.addEventListener('change', event => {
	if (event.target.checked) editCourseImageSection.hidden = true;
	else editCourseImageSection.hidden = false;
});
