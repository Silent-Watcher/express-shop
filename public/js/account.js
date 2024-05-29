// avatar image uploader

const fileUpload = document.querySelector('.file-upload');
console.log('fileUpload: ', fileUpload);
const uploadButton = document.querySelector('.upload-button');
console.log('uploadButton: ', uploadButton);

const readURL = input => {
	if (input.files && input.files[0]) {
		let reader = new FileReader();

		reader.onload = function (e) {
			document.querySelector('.profile-pic').setAttribute('src', e.target.result);
		};

		reader.readAsDataURL(input.files[0]);
	}
};

fileUpload.addEventListener('change', function () {
	readURL(this);
});

uploadButton.addEventListener('click', () => {
	fileUpload.click();
});

const gravatarOption = document.getElementById('gravatarOption');
const googleOption = document.getElementById('googleOption');
const uploadOption = document.getElementById('uploadOption');

const avatarUploader = document.querySelector('.file-upload');

gravatarOption.addEventListener('change', e => {
	if (e.target.checked) avatarUploader.type = 'text';
});
googleOption.addEventListener('change', e => {
	if (e.target.checked) avatarUploader.type = 'text';
});
uploadOption.addEventListener('change', e => {
	if (e.target.checked) avatarUploader.type = 'file';
});

if (gravatarOption.checked) avatarUploader.type = 'text';
if (googleOption.checked) avatarUploader.type = 'text';
if (uploadOption.checked) avatarUploader.type = 'file';
