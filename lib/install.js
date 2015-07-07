'use strict';

var path = require('path');

var binBuild = require('bin-build');
var BinWrapper = require('bin-wrapper');
var eachSeries = require('async-each-series');
var log = require('logalot');
var paths = require('..');
var lib = require('./');

var BASE_URL = 'https://github.com/purescript/purescript/releases/download/v0.7.0/';

var bin = new BinWrapper()
  .src(BASE_URL + 'macos.tar.gz', 'darwin')
  .src(BASE_URL + 'linux64.tar.gz', 'linux')
  .src(BASE_URL + 'win64.tar.gz', 'win32')
  .dest(path.dirname(paths.psc));

eachSeries(Object.keys(paths), function(key, next) {
  bin.use(path.basename(paths[key])).run(['--help'], function(runErr) {
    if (runErr && (
      paths[key].indexOf('psc-publish') === -1 ||
      runErr.message.indexOf('There is a problem with your package') !== -1
    )) {
      log.warn(runErr.message);
      log.warn(key + ' pre-build test failed');
      log.info('compiling from source');

      binBuild()
        .src(lib.SOURCE_URL)
        .cmd('cabal sandbox init --sandbox="' + path.join(bin.dest(), '.cabal-sandbox') + '"')
        .cmd('cabal update')
        .cmd('cabal install --bindir ' + bin.dest())
        .run(function(buildErr) {
          if (buildErr) {
            log.error(buildErr.stack);
          } else {
            log.success(key + ' built successfully');
          }

          next();
        });

      return;
    }

    log.success(key + ' pre-build test passed successfully');
    next();
  });
});
