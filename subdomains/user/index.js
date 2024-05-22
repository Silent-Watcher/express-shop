require('app-module-path').addPath(__dirname);
const expressEjsLayouts = require('express-ejs-layouts');
const express = require('express');
const { STATIC_FILES_PATH, DASHBOARD_VIEW_FILES_PATH } = require('app/common/globals');
const app = express();

app.use(express.static(STATIC_FILES_PATH));
app.set('view engine', 'ejs');
app.set('views', DASHBOARD_VIEW_FILES_PATH);
app.use(expressEjsLayouts);
app.set('layout', 'layout');

app.get('/', (req, res) => {
	res.render('index', { title: 'فروشگاه عطن | داشبورد' });
});

module.exports = app;
