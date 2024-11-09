# simple-load-script

> Very simple promise based script loader and JSONP

[![.github/workflows/check.yml](https://github.com/tomek-f/simple-load-script/actions/workflows/check.yml/badge.svg)](https://github.com/tomek-f/simple-load-script/actions/workflows/check.yml)

## Usage

### Async/await

```js
import simpleLoadScript from 'simple-load-script';

try {
    const scriptRef = await simpleLoadScript(
        'https://code.jquery.com/jquery-3.7.1.min.js',
    );

    console.log(scriptRef); // HTMLScriptElement
} catch (err) {
    console.log(err);
}
```

### Promise

```js
import simpleLoadScript from 'simple-load-script';

simpleLoadScript('https://code.jquery.com/jquery-3.7.1.min.js')
    .then(function (scriptRef) {
        console.log(scriptRef); // HTMLScriptElement
    })
    .catch(function (err) {
        console.log(err);
    });
```

### Config object

```js
import simpleLoadScript from 'simple-load-script';

try {
    const scriptRef = await simpleLoadScript({
        url: 'https://code.jquery.com/jquery-3.7.1.min.js',
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
import simpleLoadScript from 'simple-load-script';

try {
    const scriptRef = await simpleLoadScript(
        '//maps.googleapis.com/maps/api/js?&callback=gmapiready',
    );

    console.log(scriptRef); // HTMLScriptElement
} catch (err) {
    console.log(err);
}
```

### JSONP

Runs global callback (window.elo)

```js
var simpleLoadScript = require('simple-load-script');

try {
    const scriptRef = await simpleLoadScript({
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
import simpleLoadScript from 'simple-load-script';

try {
    const scriptRefs = await simpleLoadScript([
        '//maps.googleapis.com/maps/api/js?&callback=gmapiready',
        {
            url: '//api.ipinfodb.com/v3/ip-city/?format=json&callback=elo',
            removeScript: true,
        },
        'https://code.jquery.com/jquery-3.7.1.min.js',
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
    inBody: false,
    insertInto: null,
    removeScript: false,
};
```

-   `url` - file to append to body
-   `attrs` - with attributes to append to script tag (`charset`, `type`, `id`, &hellip;)
-   `inBody` - append to `document.body` instead of `document.head`
-   `insertInto` - [CSS selector (an ID, class name, element name, etc.)](https://developer.mozilla.org/en/docs/Web/API/Document/querySelector) to insert the script into. Overrides `inBody` value.
-   `removeScript` - remove script tag after load; it's always removed on an error

## Specific import

[Check files](https://www.npmjs.com/package/simple-load-script?activeTab=code) or package.json

## Changelog

[View on github](https://github.com/tomek-f/simple-load-script/blob/master/changelog.md).

## Misc.

-   uses addEventListener, Array.isArray, for…of, destructuring Promise & Promise.all
