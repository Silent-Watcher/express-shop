require('app-module-path').addPath(__dirname);
require('app/config/env');

const App = require('app');
const { PORT } = require('./app/common/globals');

new App(PORT);
