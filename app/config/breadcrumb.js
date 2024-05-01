'use strict';

const getBreadcrumbs = function (url) {
	let rtn = [{ name: 'HOME', url: '/' }],
		acc = '', // accumulative url
		arr = url.substring(1).split('/');

	for (let i = 0; i < arr.length; i++) {
		acc = i != arr.length - 1 ? acc + '/' + arr[i] : null;
		rtn[i + 1] = { name: arr[i].toUpperCase(), url: acc };
	}
	return rtn;
};

module.exports = getBreadcrumbs;
