'use strict';

var path = require('path');

var toExecutableName = require('to-executable-name');

[
  'psc',
  'psc-bundle',
  'psc-docs',
  'psc-publish',
  'psci'
].forEach(function(binName) {
  exports[binName] = path.join(__dirname, 'vendor', toExecutableName(binName));
});
