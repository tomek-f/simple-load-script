import { afterEach, beforeEach, test } from 'node:test';
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

test('removeScript true', async (t) => {
    mockScriptLoad(t, window.document.head);

    const script = await simpleLoadScript({
        attrs: { id: 'jquery' },
        removeScript: true,
        url: URL,
    });

    assert.strictEqual(script, undefined);
    assert.strictEqual(window.document.querySelector('script#jquery'), null);
});

test('removeScript false', async (t) => {
    mockScriptLoad(t, window.document.head);

    const script = await simpleLoadScript({
        attrs: { id: 'jquery' },
        url: URL,
    });

    assert.ok(script instanceof window.HTMLScriptElement);
    assert.strictEqual(window.document.querySelector('script#jquery'), script);
});

test('removeScript true on error removes the tag', async (t) => {
    mockScriptLoad(t, window.document.head, 'error');

    await assert.rejects(
        simpleLoadScript({
            attrs: { id: 'jquery' },
            removeScript: true,
            url: URL,
        }),
    );

    assert.strictEqual(window.document.querySelector('script#jquery'), null);
});

test('removeScript false on error keeps the tag', async (t) => {
    mockScriptLoad(t, window.document.head, 'error');

    await assert.rejects(
        simpleLoadScript({ attrs: { id: 'jquery' }, url: URL }),
    );

    assert.ok(window.document.querySelector('script#jquery'));
});
