'use strict';

var fs = require('fs');
var path = require('path');

var binBuild = require('bin-build');
var EOL = require('os').EOL;
var rimraf = require('rimraf');
var spawn = require('child_process').spawn;
var test = require('tape');

var pkg = require('./package.json');

var SOURCE_URL = require('./lib').SOURCE_URL;
var VERSION = require('./lib').VERSION;

test('The package entry point', function(t) {
  t.plan(3);

  // var pscStdout = '';
  //
  // spawn(require('./').psc)
  //   .on('close', function() {
  //     t.ok(/__superclass_Prelude/.test(pscStdout), 'should expose a path to psc binary.');
  //   })
  //   .stdout
  //     .on('data', function(data) {
  //       pscStdout += data;
  //     })
  //     .setEncoding('utf8');

  var pscDocsStdout = '';

  spawn(require('./')['psc-docs'], ['--help'])
    .on('close', function() {
      t.ok(/Usage: psc-docs/.test(pscDocsStdout), 'should expose a path to psc-docs binary.');
    })
    .stdout
      .on('data', function(data) {
        pscDocsStdout += data;
      })
      .setEncoding('utf8');

  var psciStdout = '';

  spawn(require('./').psci, ['--help'])
    .on('close', function() {
      t.ok(/Usage: psci/.test(psciStdout), 'should expose a path to psci binary.');
    })
    .stdout
      .on('data', function(data) {
        psciStdout += data;
      })
      .setEncoding('utf8');

  var pscBundleStdout = '';

  spawn(require('./')['psc-bundle'], ['--help'])
    .on('close', function() {
      t.ok(
        /Usage: psc-bundle/.test(pscBundleStdout),
        'should expose a path to psc-bundle binary.'
      );
    })
    .stdout
      .on('data', function(data) {
        pscBundleStdout += data;
      })
      .setEncoding('utf8');

  // var pscPublishStdout = '';
  //
  // spawn(require('./')['psc-publish'], ['--help'])
  //   .on('close', function() {
  //     t.ok(
  //       /Usage: psc-publish/.test(pscPublishStdout),
  //       'should expose a path to psc-publish binary.'
  //     );
  //   })
  //   .stdout
  //     .on('data', function(data) {
  //       pscPublishStdout += data;
  //     })
  //     .setEncoding('utf8');
});

[
  'psc',
  'psc-docs',
  'psci',
  'psc-bundle'
  // 'psc-publish'
].forEach(function(binName) {
  test('"' + binName + '" command', function(t) {
    t.plan(1);

    spawn('node', [path.resolve(pkg.bin[binName]), '--version'])
      .stdout
        .on('data', function(version) {
          t.equal(version, VERSION + '.0' + EOL, 'should run ' + binName + ' binary.');
        })
        .setEncoding('utf8');
  });
});

test('Build script', function(t) {
  t.plan(6);

  var tmpDir = path.join(__dirname, 'tmp');

  rimraf.sync(tmpDir);

  binBuild()
    .src(SOURCE_URL)
    .cmd('cabal update')
    .cmd('cabal install --bindir ' + tmpDir)
    .run(function(runErr) {
      /* istanbul ignore if */
      if (runErr) {
        process.stderr.write(runErr.message);
        t.fail(runErr);
        return;
      }

      fs.readdir(tmpDir, function(readErr, filePaths) {
        t.strictEqual(readErr, null, 'should create a directory.');
        t.notEqual(filePaths.indexOf('psc'), -1, 'should compile psc binary.');
        t.notEqual(filePaths.indexOf('psc-docs'), -1, 'should compile psc-docs binary.');
        t.notEqual(filePaths.indexOf('psci'), -1, 'should compile psci binary.');
        t.notEqual(filePaths.indexOf('psc-bundle'), -1, 'should compile psc-bundle binary.');
        t.notEqual(filePaths.indexOf('psc-publish'), -1, 'should compile psc-publish binary.');
      });
    });
});
