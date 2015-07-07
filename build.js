'use strict';

var assert = require('assert');
var fs = require('fs');

var eachAsync = require('each-async');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

var binaries = require('./package.json').bin;

rimraf('bin/*', function(rmErr) {
  assert.ifError(rmErr);

  mkdirp('bin', function(mkdirErr) {
    assert.ifError(mkdirErr);

    eachAsync(Object.keys(binaries), function(binName, index, cb) {
      fs.writeFile(
        binaries[binName],
        '#!/usr/bin/env node\nrequire(\'../cli.js\')(\'' + binName + '\');\n',
        cb
      );
    }, assert.ifError);
  });
});
