# simple-load-script

> Very simple promise based script loader and JSONP

* tiny, only 531 bytes (minified and gzipped)
* Promise based ([use polyfill if you need](http://caniuse.com/#feat=promises))
* uses addEventListener (IE9+)

## Installation

```bash
npm install --save simple-load-script
```

## UMD (CommonJS, AMD, global, ES6)

### CommonJS

```js
var loadScript = require('simple-load-script');

loadScript(/**/);
```

### AMD

```js
define(['simple-load-script'], function(loadScript) {
  loadScript(/**/);
});
```

### Global (in window object)

```js
simpleLoadScript(/**/);
```

### ES6 (ES2015) modules

* loading ES5 module

```js
import loadScript from 'simple-load-script';

loadScript(/**/);
```

## Usage

!!!
WORK IN PROGRESS
!!!

## Promise polyfill

Good example

```bash
npm install es6-promise --save
```

## es6 (es2015) version (non-UMD)

```bash
simple-load-script/modern.js
```

## Changelog

[View on github](https://github.com/tomek-f/simple-load-script/blob/master/changelog.md).
