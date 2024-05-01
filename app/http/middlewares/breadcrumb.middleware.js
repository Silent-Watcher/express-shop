'use strict';
const getBreadcrumbs = require('app/config/breadcrumb');

function addBreadcrumbs(req, res, next) {
	req.breadcrumbs = getBreadcrumbs(req.originalUrl);
	next();
}

module.exports = addBreadcrumbs;
