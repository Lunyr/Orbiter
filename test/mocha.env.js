const os = require('os');
const path = require('path');

process.env.NODE_ENV = 'test';
process.env.KEY_DIR = path.join(os.tmpdir(), 'keydir');
