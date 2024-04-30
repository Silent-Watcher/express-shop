const router = require('express').Router();
const episodeController = require('app/http/controllers/admin/episode.controller');
const checkDataValidation = require('app/http/middlewares/validation.middleware');
const getOldData = require('app/http/middlewares/getOldData');
const { validateCreateEpisodeData, validateEditCourseData } = require('app/validators/admin/episode.validator');
const { param, body } = require('express-validator');

// ========== EPISODES PATHS ================
// EPISODE INDEX PAGE
router.get('/', episodeController.getIndexPage);
// CREATE EPISODES
router.get('/create', episodeController.getCreateEpisodePage);
router.post('/create', getOldData, validateCreateEpisodeData(), checkDataValidation, episodeController.create);
// EDIT EPISODES
router.get(
	'/:id/edit',
	param('id').isMongoId().withMessage('شناسه دوره نامعتبر است'),
	checkDataValidation,
	episodeController.getEditCoursePage
);
router.put('/:id/edit', getOldData, validateEditCourseData(), checkDataValidation, episodeController.edit);
// DELETE EPISODES
router.get(
	'/:id/delete',
	param('id').isMongoId().withMessage('شناسه جلسه نامعتبر است'),
	checkDataValidation,
	episodeController.getDeleteEpisodePage
);
router.delete(
	'/:id/delete',
	param('id').isMongoId().withMessage('شناسه جلسه نامعتبر است'),
	body('episode').isString().trim().escape().withMessage('نام جلسه نامعتبر است'),
	checkDataValidation,
	episodeController.delete
);
// =================================

module.exports = router;
