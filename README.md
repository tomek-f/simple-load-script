# simple-load-script

> Very simple promise based script loader and JSONP

* tiny
* Promise based ([use polyfill if you need](http://caniuse.com/#feat=promises))
* uses addEventListener (IE9+)

## Installation

```bash
npm install --save simple-load-script
```

## Usage

!!!
WORK IN PROGRESS
!!!

## Arguments

* `url` (optional) - file to append to body
* `options` (required) - options in object

## Options

* `url` (string) - file to append to body
* `inBody` (boolean) - append to `document.body` instead of `document.head`
* `attrs` (object) - with attributes to append to script tag (`charset`, `type`, `id`, &hellip;)
* `callBackName` (string) - callback to add to `window` object; promise is resolved after callback is fired; callback is removed after that
* `dontRemoveCallBack` (boolean) - from `window` after load
* `removeScript` (boolean) - after load (for JSONP, other reasons); it's always removed on error

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

## Promise polyfill

Good example

```bash
npm install es6-promise --save
```

## Changelog

[View on github](https://github.com/tomek-f/simple-load-script/blob/master/changelog.md).
