const bcrypt = require('bcrypt');

const fs = require('fs');

const path = require('path');

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
			let videoPath = path.join(process.cwd(), 'public', episode.url);
			if (!fs.existsSync(videoPath)) throw { status: 400, message: 'چنین فایلی برای دانلود وجود ندارد' };
			if (this.checkIfDownloadLinkIsValid(req, episode)) {
				await episode.inc('downloadCount');
				res.download(videoPath);
			}
		} catch (error) {
			next(error);
		}
	}
	checkIfDownloadLinkIsValid(req, episode) {
		const { mac, t } = req.query;
		if (!mac || !t) throw { status: 400, message: 'خطا در لینک دانلود' };
		const now = new Date().getTime();
		let hashInput = `${process.env.DOWNLOAD_LINK_SECRET}${episode._id}${now}`;
		let isAValidLink = bcrypt.compareSync(hashInput, mac);
		if (isAValidLink) return true;
		else throw { status: 400, message: 'خطا در لینک دانلود' };
	}
}

module.exports = new EpisodeController();
