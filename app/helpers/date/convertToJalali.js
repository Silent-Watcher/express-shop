const moment = require('moment-jalaali');
moment.loadPersian({ usePersianDigits: true });

const date = time => {
	return moment(time);
};

module.exports = date;
