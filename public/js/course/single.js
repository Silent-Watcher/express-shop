const paidEpisodesWrapper = document.querySelectorAll('.paid-episode');
console.log('paidEpisodesWrapper: ', paidEpisodesWrapper);
paidEpisodesWrapper.forEach(paidEpisodeWrapper => {
	paidEpisodeWrapper.addEventListener('mouseenter', event => {
		let episodeNumber = event.target.firstElementChild.firstElementChild.firstElementChild;
		let lockIcon = episodeNumber.nextElementSibling;
		lockIcon.style.display = 'none';
		episodeNumber.hidden = false;
	});
	paidEpisodeWrapper.addEventListener('mouseleave', event => {
		let episodeNumber = event.target.firstElementChild.firstElementChild.firstElementChild;
		let lockIcon = episodeNumber.nextElementSibling;
		lockIcon.style.display = 'block';
		episodeNumber.hidden = true;
	});
});
