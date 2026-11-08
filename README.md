# simple-load-script

> Very simple promise based script loader and JSONP

[![CI](https://github.com/tomek-f/simple-load-script/actions/workflows/ci.yml/badge.svg)](https://github.com/tomek-f/simple-load-script/actions/workflows/ci.yml)

## Install

```sh
npm install simple-load-script
# or
pnpm add simple-load-script
```

## Usage

### Async/await

```js
import simpleLoadScript from 'simple-load-script';

try {
    const scriptRef = await simpleLoadScript(
        'https://code.jquery.com/jquery-4.0.0.min.js',
    );

    console.log(scriptRef); // HTMLScriptElement
} catch (err) {
    console.log(err);
}
```

### Promise

```js
import simpleLoadScript from 'simple-load-script';

simpleLoadScript('https://code.jquery.com/jquery-4.0.0.min.js')
    .then((scriptRef) => {
        console.log(scriptRef); // HTMLScriptElement
    })
    .catch((err) => {
        console.log(err);
    });
```

### Config object

```js
import simpleLoadScript from 'simple-load-script';

try {
    const scriptRef = await simpleLoadScript({
        url: 'https://code.jquery.com/jquery-4.0.0.min.js',
        inBody: true,
        attrs: { id: 'one', crossorigin: 'anonymous' },
    });

    console.log(scriptRef); // HTMLScriptElement in document.body, with attrs
} catch (err) {
    console.log(err);
}
```

### Google Maps API

Calls the global callback (`window.gmapiready`).

```js
import simpleLoadScript from 'simple-load-script';

window.gmapiready = () => {
    console.log('Google Maps ready');
};

try {
    const scriptRef = await simpleLoadScript(
        'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&loading=async&callback=gmapiready',
    );

    console.log(scriptRef); // HTMLScriptElement
} catch (err) {
    console.log(err);
}
```

### JSONP

Calls the global callback (`window.handleData`). The script tag is removed after load.

```js
import simpleLoadScript from 'simple-load-script';

window.handleData = (data) => {
    console.log(data);
};

try {
    const scriptRef = await simpleLoadScript({
        url: 'https://example.com/api/data?callback=handleData',
        removeScript: true,
    });

    console.log(scriptRef); // undefined
} catch (err) {
    console.log(err);
}
```

### Array mode - objects and urls

Each item is loaded in parallel and the promise resolves to an array of results (in the same order as the input). It rejects with the first error.

```js
import simpleLoadScript from 'simple-load-script';

try {
    const scriptRefs = await simpleLoadScript([
        'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&loading=async&callback=gmapiready',
        {
            url: 'https://example.com/api/data?callback=handleData',
            removeScript: true,
        },
        'https://code.jquery.com/jquery-4.0.0.min.js',
    ]);

    console.log(scriptRefs); // [HTMLScriptElement, undefined, HTMLScriptElement]
} catch (err) {
    console.log(err);
}
```

> [!NOTE]
> Dynamically inserted scripts are `async`, so in array mode they **execute in the order they finish downloading**, not in array order. If one script depends on another, load them one after another (`await` each call).
>
> JSONP callback names (global functions) must be unique across scripts loaded at the same time.

### Cancel / timeout

Pass an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) to stop waiting. When it's aborted, the script tag is removed and the promise rejects with `signal.reason`. The browser may still download or run a script it has already requested.

```js
import simpleLoadScript from 'simple-load-script';

try {
    await simpleLoadScript({
        url: 'https://code.jquery.com/jquery-4.0.0.min.js',
        signal: AbortSignal.timeout(5000), // reject after 5 s
    });
} catch (err) {
    console.log(err.name); // 'TimeoutError'
}
```

### CommonJS

```js
const simpleLoadScript = require('simple-load-script');
```

### Browser global (UMD)

```html
<script src="https://unpkg.com/simple-load-script@3"></script>
<script>
    window.simpleLoadScript('https://code.jquery.com/jquery-4.0.0.min.js');
</script>
```

## Arguments

`Config | string | (Config | string)[]`

## Return value

- `Promise<HTMLScriptElement>` - the inserted script tag
- `Promise<undefined>` - when `removeScript: true`
- `Promise<(HTMLScriptElement | undefined)[]>` - in array mode

## Config

### Interface

```ts
interface Config {
    url: string;
    attrs?: Record<string, string>;
    inBody?: boolean;
    insertInto?: string | null;
    removeScript?: boolean;
    signal?: AbortSignal;
}
```

### Default values

```js
const defaultConfig = {
    url: '', // required
    attrs: {},
    inBody: false,
    insertInto: null,
    removeScript: false,
    signal: undefined,
};
```

- `url` - script URL (required, non-empty); always wins over `attrs.src`
- `attrs` - attributes to set on the script tag (`type`, `id`, `nonce`, `crossorigin`, `integrity`, &hellip;)
- `inBody` - append to `document.body` instead of `document.head`
- `insertInto` - [CSS selector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) of the element to insert the script into. Overrides `inBody`.
- `removeScript` - remove the script tag after it loads or fails to load; the promise then resolves to `undefined`
- `signal` - `AbortSignal` to cancel waiting (see [Cancel / timeout](#cancel--timeout))

## Errors

The promise rejects with an `Error`:

| Message                                | When                                                                               |
| -------------------------------------- | ---------------------------------------------------------------------------------- |
| `Object with url or url string needed` | argument is missing, `null`, an empty string or an object without `url`            |
| `No DOM element to append script`      | `insertInto` selector matched nothing                                              |
| `Loading script error: <url>`          | the script failed to load; `err.cause` is the DOM `error` event                    |
| `signal.reason`                        | the `signal` was aborted (for example a `TimeoutError` from `AbortSignal.timeout`) |

## Specific import

[Check files](https://www.npmjs.com/package/simple-load-script?activeTab=code) or package.json

## Changelog

[View on github](https://github.com/tomek-f/simple-load-script/blob/master/CHANGELOG.md).
