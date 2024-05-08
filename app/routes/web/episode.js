const { param } = require('express-validator');
const episodeController = require('../../http/controllers/episode.controller');
const checkDataValidation = require('app/http/middlewares/validation.middleware');

const router = require('express').Router();

router.get(
	'/download/:episodeId',
	param('episodeId').isMongoId().withMessage('شناسه دوره نامعتبر است'),
	checkDataValidation,
	episodeController.download
);

module.exports = router;
