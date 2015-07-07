'use strict';

var path = require('path');

var toExecutableName = require('to-executable-name');

[
  'psc',
  'psc-docs',
  'psci',
  'psc-bundle'
  // 'psc-publish'
].forEach(function(binName) {
  exports[binName] = path.join(__dirname, 'vendor', toExecutableName(binName));
});
