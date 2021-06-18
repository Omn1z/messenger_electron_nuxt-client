const path = require('path')
const fs = require('fs')
const cwd = process.cwd();
const ext = fs.existsSync(path.join(cwd, 'tsconfig.json')) ? '.ts' : '.js';
module.exports = {
    webpack: {
        entry: {
            'bridge' : path.join(cwd, 'main', 'helpers', `bridge${ext}`),
        }
    }
}
