const dotenv = require('dotenv-safe');
const path = require('path');

dotenv.config({
	path: path.join(process.cwd(), '.env'),
});
