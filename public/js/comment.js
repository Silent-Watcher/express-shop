const addNewCommentBtn = document.querySelector('#addNewCommentBtn');
const newCommentSection = document.querySelector('#newCommentSection');
const closeNewCommentSectionBtn = document.querySelector('#closeNewCommentSectionBtn');
const parentCommentIdInput = document.querySelector('#parentCommentIdInput');

const replyCommentCTAs = document.querySelectorAll('.replyCommentCTA');
const newReplySection = document.querySelector('#newReplySection');
const closeNewReplySectionBtn = document.querySelector('#closeNewReplySectionBtn');

addNewCommentBtn.addEventListener('click', () => {
	if (newCommentSection.hidden) newCommentSection.hidden = false;
});

closeNewCommentSectionBtn.addEventListener('click', () => {
	newCommentSection.hidden = true;
});

closeNewReplySectionBtn.addEventListener('click', () => {
	newReplySection.hidden = true;
});

// replyCommentCTAs.foreEach(replyCommentCTA => {
// 	console.log('replyCommentCTA: ', replyCommentCTA);
// 	replyCommentCTA.addEventListener('click', () => {
// 		if (newReplySection.hidden) newReplySection.hidden = false;
// 	});
// });

replyCommentCTAs.forEach(replyCommentCTA => {
	replyCommentCTA.addEventListener('click', () => {
		if (newReplySection.hidden) newReplySection.hidden = false;
		parentCommentIdInput.value = replyCommentCTA.dataset.commentid;
	});
});
