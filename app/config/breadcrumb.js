'use strict';

const i18next = require('i18next');

const getBreadcrumbs = function (url) {
	let rtn = [{ name: i18next.t('HOME'), url: '/' }],
		acc = '',
		arr = url.substring(1).split('/');

	for (let i = 0; i < arr.length; i++) {
		acc = i != arr.length - 1 ? acc + '/' + arr[i] : null;
		rtn[i + 1] = { name: i18next.t(arr[i].toUpperCase()), url: acc };
	}
	return rtn;
};

module.exports = getBreadcrumbs;
