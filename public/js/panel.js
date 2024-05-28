const numbers = document.querySelectorAll('.number');
const closeButton = document.querySelectorAll('.btn-close')[1];

function replaceEnglishWithPersianNumbers(inputString) {
	const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

	const englishNumbers = /[0-9]/g;

	inputString = inputString.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
	return inputString.replace(englishNumbers, function (match) {
		return persianNumbers[parseInt(match)];
	});
}

// convert numbers to persian format
numbers.forEach(number => {
	let value = number.dataset.value;
	number.innerHTML = replaceEnglishWithPersianNumbers(value);
});

// select form
const selectElem = document.querySelector('#departmentSelectInput');
// eslint-disable-next-line no-undef
new Choices(selectElem);

// editor
let editorId = document.querySelector('.editor').id;
// eslint-disable-next-line no-undef
CKEDITOR.replace(editorId, {
	language: 'fa',
	uiColor: '#202334',
	filebrowserUploadUrl: '/me/tickets/upload-image',
});

closeButton.addEventListener('click', e => {
	let parent = e.target.parentElement;
	parent.remove();
});
