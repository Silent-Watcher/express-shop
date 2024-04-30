const autoBind = require('auto-bind');

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { STATIC_FILES_PATH } = require('app/common/globals');
const recursiveReplace = require('./string/recursiveReplace');

class ImageHelper {
	// ====================
	constructor() {
		autoBind(this);
	}
	// ====================
	async removeImages(images = []) {
		if (images.length > 0) {
			images.forEach(image => {
				let imagePath = image.path.replace('/static/', `${STATIC_FILES_PATH}\\`);
				let optimizedPath = recursiveReplace(imagePath, '\\', '/');
				if (fs.existsSync(optimizedPath)) fs.unlinkSync(optimizedPath);
			});
		}
	}
	// ====================
	createImageUrlAddr(imagePath) {
		return imagePath.replace(`${STATIC_FILES_PATH}\\`, '/static/');
	}
	// ====================
	resizeImage(filePath) {
		const imageInfo = path.parse(filePath);
		const imageSizes = [1080, 720, 480];
		let [image, imgAddr] = [{}, ''];
		let images = [];
		image.path = this.createImageUrlAddr(filePath);
		image.size = 'original';
		images.push(image);
		imageSizes.map(size => {
			imgAddr = path.join(imageInfo.dir, `${imageInfo.name}-${size}${imageInfo.ext}`);
			let image = {};
			image.path = this.createImageUrlAddr(imgAddr);
			image.size = size;
			images.push(image);
			sharp(filePath).resize(size, null, { fit: 'fill' }).toFile(imgAddr);
		});
		return images;
	}
}

module.exports = new ImageHelper();
