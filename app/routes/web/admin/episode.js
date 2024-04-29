const router = require('express').Router();
const episodeController = require('../../../http/controllers/admin/episode.controller');
const checkDataValidation = require('app/http/middlewares/validation.middleware');
const getOldData = require('app/http/middlewares/getOldData');
const { validateCreateEpisodeData } = require('../../../validators/admin/episode.validator');
// const { param, body } = require('express-validator');
// const episodeController = require('../../../http/controllers/admin/episode.controller');

// ========== EPISODES PATHS ================
// EPISODE INDEX PAGE
router.get('/', episodeController.getIndexPage);
// CREATE EPISODES
router.get('/create', episodeController.getCreateEpisodePage);
router.post('/create', getOldData, validateCreateEpisodeData(), checkDataValidation, episodeController.create);
// EDIT EPISODES
// router.get(
// 	'/:id/edit',
// 	param('id').isMongoId().withMessage('شناسه دوره نامعتبر است'),
// 	checkDataValidation,
// 	episodeController.getEditCoursePage
// );
// router.put('/:id/edit', getOldData, validateEditCourseData(), checkDataValidation, episodeController.edit);
// DELETE EPISODES
// router.get(
// 	'/:id/delete',
// 	param('id').isMongoId().withMessage('شناسه دوره نامعتبر است'),
// 	checkDataValidation,
// 	episodeController.getDeleteCoursePage
// );
// router.delete(
// 	'/:id/delete',
// 	param('id').isMongoId().withMessage('شناسه دوره نامعتبر است'),
// 	body('course').isString().trim().escape().withMessage('نام دوره نامعتبر است'),
// 	checkDataValidation,
// 	episodeController.delete
// );
// =================================

module.exports = router;
