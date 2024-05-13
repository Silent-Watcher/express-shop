const addNewCommentBtn = document.querySelector('#addNewCommentBtn');
const newCommentSection = document.querySelector('#newCommentSection');
const closeNewCommentSectionBtn = document.querySelector('#closeNewCommentSectionBtn');

addNewCommentBtn.addEventListener('click', () => {
	if (newCommentSection.hidden) newCommentSection.hidden = false;
});

closeNewCommentSectionBtn.addEventListener('click', () => {
	newCommentSection.hidden = true;
});
