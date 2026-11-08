import { afterEach, beforeEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import simpleLoadScript from '../src/index.ts';
import { clearTestEnvironment, mockScriptLoad } from './utils.ts';

const URL = 'https://code.jquery.com/jquery-4.0.0.js';

beforeEach(() => {
    clearTestEnvironment();
});

afterEach(() => {
    clearTestEnvironment();
});

test('load url ok', async (t) => {
    mockScriptLoad(t, window.document.head);

    const scriptRef = await simpleLoadScript(URL);

    assert.ok(scriptRef instanceof window.HTMLScriptElement);
    assert.strictEqual(scriptRef.getAttribute('src'), URL);
    assert.strictEqual(scriptRef.parentNode, window.document.head);
});

test('load config ok', async (t) => {
    mockScriptLoad(t, window.document.head);

    const scriptRef = await simpleLoadScript({ url: URL });

    assert.ok(scriptRef instanceof window.HTMLScriptElement);
    assert.strictEqual(scriptRef.getAttribute('src'), URL);
});

test('wrong url error', async (t) => {
    mockScriptLoad(t, window.document.head, 'error');
    const url = 'https://wrong.domain/jquery-4.0.0.js';

    await assert.rejects(simpleLoadScript(url), (err: Error) => {
        assert.strictEqual(err.message, `Loading script error: ${url}`);
        assert.ok(err.cause instanceof window.Event);
        return true;
    });
});

test('settles when the script is detached before load', async (t) => {
    mockScriptLoad(t, window.document.head, (script) => {
        script.remove();
        return 'load';
    });

    const scriptRef = await simpleLoadScript({ removeScript: true, url: URL });

    assert.strictEqual(scriptRef, undefined);
});

describe('wrong config error', () => {
    const message = { message: 'Object with url or url string needed' };

    test('no param', async () => {
        // @ts-expect-error Testing wrong config
        await assert.rejects(simpleLoadScript(), message);
    });
    test('null', async () => {
        // @ts-expect-error Testing wrong config
        await assert.rejects(simpleLoadScript(null), message);
    });
    test('empty string', async () => {
        await assert.rejects(simpleLoadScript(''), message);
    });
    test('empty url', async () => {
        await assert.rejects(simpleLoadScript({ url: '' }), message);
    });
    test('bad config', async () => {
        await assert.rejects(
            simpleLoadScript({
                // @ts-expect-error Testing wrong config
                elo: URL,
            }),
            message,
        );
    });
    test('nothing appended', async () => {
        // @ts-expect-error Testing wrong config
        await assert.rejects(simpleLoadScript(null), message);
        assert.strictEqual(window.document.querySelector('script'), null);
    });
});
