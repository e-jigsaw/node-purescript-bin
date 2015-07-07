# PureScript wrapper for [Node](https://nodejs.org/)

[![NPM version](http://img.shields.io/npm/v/purescript.svg)](https://www.npmjs.com/package/purescript)
[![Build Status](http://img.shields.io/travis/purescript-contrib/node-purescript-bin.svg)](http://travis-ci.org/purescript-contrib/node-purescript-bin)
[![Coverage Status](https://img.shields.io/coveralls/purescript-contrib/node-purescript-bin.svg)](https://coveralls.io/r/purescript-contrib/node-purescript-bin)
[![Dependency Status](https://img.shields.io/david/purescript-contrib/node-purescript-bin.svg)](https://david-dm.org/purescript-contrib/node-purescript-bin)
[![devDependency Status](https://img.shields.io/david/dev/purescript-contrib/node-purescript-bin.svg)](https://david-dm.org/purescript-contrib/node-purescript-bin#info=devDependencies)

[PureScript](http://www.purescript.org/) binary wrapper that makes it seamlessly available via [npm](https://www.npmjs.com/)

## Installation

[Use npm](https://docs.npmjs.com/cli/install).

```sh
npm install purescript
```

## Usage

```javascript
const {execFile} = require('child_process');
const paths = require('purescript');

// On POSIX
paths.psc; //=> '/path/to/proj/node_modules/purescript/vendor/psc'
paths['psc-bundle']; //=> '/path/to/proj/node_modules/purescript/vendor/psc-bundle'
paths['psc-docs']; //=> '/path/to/proj/node_modules/purescript/vendor/psc-docs'
paths['psc-publish']; //=> '/path/to/proj/node_modules/purescript/vendor/psc-publish'
paths.psci; //=> '/path/to/proj/node_modules/purescript/vendor/psci'

execFile(psc, ['input.purs', '--output', 'output.purs'], err => {
  if (err) {
    throw err;
  }

  console.log('Compiled.');
});
```

## API

### require('purescript').psc

Type: `String`

The path to [`psc`](https://github.com/purescript/purescript/wiki/Language-Guide:-Getting-Started#compiler-usage) binary

### require('purescript')['psc-bundle']

Type: `String`

The path to `psc-bundle` binary

### require('purescript')['psc-docs']

Type: `String`

The path to `psc-docs` binary

### require('purescript')['psc-publish']

Type: `String`

The path to `psc-publish` binary

### require('purescript').psci

Type: `String`

The path to [`psci`](https://github.com/purescript/purescript/wiki/PSCi) binary

## CLI

You can use it via CLI by installing it [globally](https://docs.npmjs.com/files/folders#global-installation). 

```sh
npm install -g purescript

psc --help
psc-bundle --help
psc-docs --help
psci --help
psc-publish
```

## License

Copyright (c) 2015 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).
