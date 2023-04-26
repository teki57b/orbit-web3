const path = require('path');
const config = require('dotenv').config
module.exports = config({ path: path.resolve(__dirname, '../../.env') });
