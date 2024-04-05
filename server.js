require('app-module-path').addPath(__dirname);
require('app/config/env');

const App = require('app');
const { PORT } = process.env;

new App(PORT);
