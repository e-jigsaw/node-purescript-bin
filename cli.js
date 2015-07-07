'use strict';

var spawn = require('child_process').spawn;

module.exports = function(binName) {
  spawn(require('./')[binName], process.argv.slice(2), {stdio: 'inherit'})
    .on('exit', process.exit);
};
