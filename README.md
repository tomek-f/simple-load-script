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

```js
var loadScript = require('simple-load-script');

loadScript('//code.jquery.com/jquery-2.2.3.js')
  .then(function(scriptRef) {
    console.log('success', scriptRef);
  })
  .catch(function(err) {
    console.log(err);
  });
```

```js
var loadScript = require('simple-load-script');

loadScript('//code.jquery.com/jquery-2.2.3.js', {
  inBody: true
})
  .then(function(scriptRef) {
    console.log('success', scriptRef); // 'success', script ref.
  })
  .catch(function(err) {
    console.log(err);
  });
```

```js
var loadScript = require('simple-load-script');

loadScript({
  url: '//code.jquery.com/jquery-2.2.3.js',
  attrs: { id: 'one', charset: 'UTF-8' }
})
  .then(function(scriptRef) {
    console.log('success', scriptRef); // 'success', script ref.
  })
  .catch(function(err) {
    console.log(err);
  });
```

Google Maps API

```js
var loadScript = require('simple-load-script');

loadScript({
  url: '//maps.googleapis.com/maps/api/js?&callback=gmapiready',
  callBackName: 'gmapiready'
})
  .then(function(scriptRef) {
    console.log('success', scriptRef); // 'success', undefined
  })
  .catch(function(err) {
    console.log(err);
  });
```

JSONP

```js
var loadScript = require('simple-load-script');

loadScripts('//api.ipinfodb.com/v3/ip-city/?format=json&callback=elo', {
  callBackName: 'elo',
  removeScript: true
})
  .then(function(scriptRef) {
    console.log('success', scriptRef); // 'success', res
  })
  .catch(function(err) {
    console.log(err);
  });
```

Load more scripts (Promise.all) - urls

```js
var loadScripts = require('simple-load-script').all;

loadScripts(
  '//example.com/test1.js',
  '//example.com/test2.js',
  '//example.com/test3.js'
)
  .then(function(scriptRef) {
    console.log('success', scriptRef); // 'success', res
  })
  .catch(function(err) {
    console.log(err);
  });
```

Load more scripts (Promise.all) - objects and urls, callback must be unique names

```js
var loadScripts = require('simple-load-script').all;

loadScripts(
  {
    url: '//maps.googleapis.com/maps/api/js?&callback=gmapiready',
    callBackName: 'gmapiready'
  },
  {
    url: '//api.ipinfodb.com/v3/ip-city/?format=json&callback=elo',
    callBackName: 'elo',
    removeScript: true
  },
  [
    'https://api.twitter.com/1/statuses/oembed.json?id=507185938620219395&callback=elo2',
    { callBackName: 'elo2' }
  ],
  '//code.jquery.com/jquery-2.2.3.js'
)
  .then(function(scriptRef) {
    console.log('success', scriptRef); // 'success', array
  })
  .catch(function(err) {
    console.log(err);
  });
```

## Arguments

* `url` (optional) - file to append to body
* `options` (required) - options in object

## Options

* `url` (string) - file to append to body
* `inBody` (boolean) - append to `document.body` instead of `document.head`
* `attrs` (object) - with attributes to append to script tag (`charset`, `type`, `id`, &hellip;)
* `callBackName` (string) - callback to add to `window` object; promise is resolved after callback is fired; callback is removed after that; multiple callbacks must have unique names
* `dontRemoveCallBack` (boolean) - from `window` after load; no real use - let me know
* `removeScript` (boolean) - after load (for JSONP, other reasons); it's always removed on error
* `insertInto` (string) - [CSS selector (an ID, class name, element name, etc.)](https://developer.mozilla.org/en/docs/Web/API/Document/querySelector) to insert the script into. Overrides `inBody` value.

## Returned values

* then: resource (JSONP - options.callBackName) script reference in DOM or undefined (options.callBackName, options.removeScript)
* catch: error message

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
