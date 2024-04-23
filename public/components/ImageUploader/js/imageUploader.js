const $ = document,
	fileUploader = $.querySelector('#fileUploader'),
	uploaderTitle = $.querySelector('#uploaderText'),
	uploadInput = $.querySelector('#fileInput');
const uploadButton = $.querySelector('#uploadButton');

fileUploader.addEventListener('dragover', event => {
	event.preventDefault();
	fileUploader.style.borderStyle = 'solid';
	uploaderTitle.textContent = 'عکس را برای آپلود رها کنید';
});

fileUploader.addEventListener('dragleave', event => {
	event.preventDefault();
	uploaderTitle.textContent = 'عکس را داخل باکس بیندازید';
	fileUploader.style.borderStyle = 'dashed';
});

fileUploader.addEventListener('drop', event => {
	event.preventDefault();
	console.log(event);
	console.log(event.dataTransfer);
	uploadInput.value = event.dataTransfer.files;
	validateUploadedImage(event.dataTransfer.files);
});

uploadButton.onclick = () => uploadInput.click();

uploadInput.addEventListener('change', event => {
	validateUploadedImage(event.target.files);
});

function uploadImage(fileUploader, file) {
	let fileReader = new FileReader();
	fileReader.readAsDataURL(file);
	fileReader.onload = event => {
		fileUploader.innerHTML = `<img src='${event.target.result}' alt="">`;
	};
	fileUploader.style.borderStyle = 'solid';
}

function validateUploadedImage(uploadedFiles) {
	if (uploadedFiles.length === 1) {
		let [file, validFileTypes] = [uploadedFiles[0], ['image/jpeg', 'image/png', 'image/jpg']];
		if (!validFileTypes.includes(file.type)) alert('پسوند فایل نادرست است');
		else uploadImage(fileUploader, file);
	} else alert('شما نمیتوانید بیشتر از یه عکس آپلود کنید');
}
