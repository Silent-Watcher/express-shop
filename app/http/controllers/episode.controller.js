const Controller = require('app/http/controllers/controller');
const Episode = require('../../models/episode.model');

class EpisodeController extends Controller {
	constructor() {
		super();
	}
	async download(req, res, next) {
		try {
			const { episodeId } = req.params;
			const episode = await Episode.findById(episodeId);
			if (!episode) throw { status: 404, message: 'جلسه با این شناسه یافت نشد' };
			res.json(req.params.episodeId);
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new EpisodeController();
