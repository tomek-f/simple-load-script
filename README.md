# simple-load-script

> Very simple promise based script loader and JSONP

## Installation

```bash
npm install --save simple-load-script
```

## Import

```js
// es5 CommonJS
const loadScript = require('simple-load-script');

// es6
const loadScript = require('simple-load-script/es6/simpleLoadScript');

// es5-umd
const loadScript = require('simple-load-script/es5-umd/simpleLoadScript');
```

## Usage

### Promise

```js
import loadScript from 'simple-load-script';

loadScript('//code.jquery.com/jquery-2.2.3.js')
  .then(function (scriptRef) {
    console.log(scriptRef);
  })
  .catch(function (err) {
    console.log(err);
  });
```

### Async/await

```js
import loadScript from 'simple-load-script';

try {
  const scriptRef = loadScript('//code.jquery.com/jquery-2.2.3.js');

  console.log(scriptRef); // HTMLScriptElement
} catch (err) {
  console.log(err);
}
```

### Config object

```js
import loadScript from 'simple-load-script';

try {
  const scriptRef = loadScript({
    url: '//code.jquery.com/jquery-2.2.3.js',
    inBody: true,
    attrs: { id: 'one', charset: 'UTF-8' },
  });

  console.log(scriptRef); // HTMLScriptElement inBody with attrs present
} catch (err) {
  console.log(err);
}
```

### Google Maps API

Runs global callback (window.gmapiready)

```js
import loadScript from 'simple-load-script';

try {
  const scriptRef = loadScript('//maps.googleapis.com/maps/api/js?&callback=gmapiready');

  console.log(scriptRef); // HTMLScriptElement
} catch (err) {
  console.log(err);
}
```

### JSONP

Runs global callback (window.elo)

```js
var loadScript = require('simple-load-script');

try {
  const scriptRef = loadScript({
    url: '//api.ipinfodb.com/v3/ip-city/?format=json&callback=elo',
    removeScript: true,
  });

  console.log(scriptRef); // undefined
} catch (err) {
  console.log(err);
}
```

### Array mode - objects and urls, callBackNames must have unique names

```js
import loadScript from 'simple-load-script';

try {
  const scriptRefs = loadScript([
    '//maps.googleapis.com/maps/api/js?&callback=gmapiready',
    {
      url: '//api.ipinfodb.com/v3/ip-city/?format=json&callback=elo',
      removeScript: true,
    },
    '//code.jquery.com/jquery-2.2.3.js',
  ]);

  console.log(scriptRefs); // HTMLScriptElement[]
} catch (err) {
  console.log(err);
}
```

## Arguments

`Config | string | (Config | string)[]`

## Config

### Interface

```ts
interface Config {
  url: string;
  attrs?: Record<string, string>;
  callBack?: ((scriptRef?: HTMLScriptElement) => void) | null;
  inBody?: boolean;
  insertInto?: string | null;
  removeScript?: boolean;
}
```

### Default values

```js
const defaultConfig = {
  url: '',
  attrs: {},
  callBack: null,
  inBody: false,
  insertInto: null,
  removeScript: false,
};
```

- `url` - file to append to body
- `attrs` - with attributes to append to script tag (`charset`, `type`, `id`, &hellip;)
- `callBack` - additional callback on success
- `inBody` - append to `document.body` instead of `document.head`
- `insertInto` - [CSS selector (an ID, class name, element name, etc.)](https://developer.mozilla.org/en/docs/Web/API/Document/querySelector) to insert the script into. Overrides `inBody` value.
- `removeScript` - remove script tag after load; it's always removed on an error

## Changelog

[View on github](https://github.com/tomek-f/simple-load-script/blob/master/changelog.md).

## Misc.

- uses addEventListener, Array.isArray, for…of, destructuring Promise & Promise.all
