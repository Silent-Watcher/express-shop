function toggleReadMore() {
	const content = document.querySelector('.content');
	const layer = document.querySelector('.layer');
	const btn = document.querySelector('.toggle-btn');

	console.log('content.style.height: ', content.style.height);
	if (content.style.height == '250px') {
		layer.style.display = 'none';
		content.style.height = 'auto';
		btn.innerText = 'نمایش کم تر';
	} else {
		layer.style.display = 'block';
		content.style.height = '250px';
		btn.innerText = 'ادامه مطلب';
	}
}

window.addEventListener('load', () => {
	const readMoreButton = document.querySelector('.toggle-btn');
	readMoreButton.addEventListener('click', toggleReadMore);
});
