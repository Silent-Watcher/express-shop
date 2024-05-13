const addNewCommentBtn = document.querySelector('#addNewCommentBtn');
const newCommentSection = document.querySelector('#newCommentSection');
const closeNewCommentSectionBtn = document.querySelector('#closeNewCommentSectionBtn');
const replyCommentCTA = document.querySelector('#replyCommentCTA');
const newReplySection = document.querySelector('#newReplySection');
const closeNewReplySectionBtn = document.querySelector('#closeNewReplySectionBtn');

addNewCommentBtn.addEventListener('click', () => {
	if (newCommentSection.hidden) newCommentSection.hidden = false;
});

closeNewCommentSectionBtn.addEventListener('click', () => {
	newCommentSection.hidden = true;
});

replyCommentCTA.addEventListener('click', () => {
	if (newReplySection.hidden) newReplySection.hidden = false;
});

closeNewReplySectionBtn.addEventListener('click', () => {
	newReplySection.hidden = true;
});
