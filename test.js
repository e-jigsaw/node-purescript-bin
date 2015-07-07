'use strict';

var fs = require('fs');
var path = require('path');

var binBuild = require('bin-build');
var EOL = require('os').EOL;
var concatStream = require('concat-stream');
var rimraf = require('rimraf');
var spawn = require('child_process').spawn;
var test = require('tape');

var pkg = require('./package.json');
var binaries = pkg.bin;

var SOURCE_URL = require('./lib').SOURCE_URL;
var VERSION = '0.7.0.0';

test('The package entry point', function(t) {
  t.plan(5);

  Object.keys(binaries).forEach(function(binName) {
    var cp = spawn(require('./')[binName], ['--help']);
    if (binName === 'psc-publish') {
      cp.stderr.setEncoding('utf8').pipe(concatStream({encoding: 'string'}, function(msg) {
        t.ok(
          /There is a problem with your package/.test(msg),
          'should expose a path to ' + binName + ' binary.'
        );
      }));

      return;
    }

    cp.stdout.setEncoding('utf8').pipe(concatStream({encoding: 'string'}, function(msg) {
      t.ok(
        new RegExp('Usage: ' + binName).test(msg),
        'should expose a path to ' + binName + ' binary.'
      );
    }));
  });
});

[
  'psc',
  'psc-bundle',
  'psc-docs',
  'psci'
].forEach(function(binName) {
  test('"' + binName + '" command', function(t) {
    t.plan(1);

    spawn('node', [path.resolve(pkg.bin[binName]), '--version'])
      .stdout
        .setEncoding('utf8')
        .pipe(concatStream({encoding: 'string'}, function(version) {
          t.equal(version, VERSION + EOL, 'should run ' + binName + ' binary.');
        }));
  });
});

test('"psc-publish" command', function(t) {
  t.plan(1);

  spawn('node', [path.resolve(pkg.bin['psc-publish'])])
    .stderr
      .setEncoding('utf8')
      .pipe(concatStream({encoding: 'string'}, function(msg) {
        t.ok(/file was not found/.test(msg), 'should run psc-publish binary.');
      }));
});

test('Build script', function(t) {
  t.plan(6);

  var tmpDir = path.join(__dirname, 'tmp');

  rimraf.sync(tmpDir);

  binBuild()
    .src(SOURCE_URL)
    .cmd('cabal sandbox init --sandbox="' + path.join(tmpDir, '.cabal-sandbox') + '"')
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
        Object.keys(binaries).forEach(function(binName) {
          t.notEqual(filePaths.indexOf(binName), -1, 'should compile ' + binName + ' binary.');
        });
      });
    });
});
