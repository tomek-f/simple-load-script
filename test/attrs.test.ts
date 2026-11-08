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

test('add attrs', async (t) => {
    mockScriptLoad(t, window.document.head);

    await simpleLoadScript({
        attrs: { 'data-test': 'test', id: 'jquery' },
        url: URL,
    });

    const jquery = window.document.querySelector('script#jquery');

    assert.ok(jquery instanceof window.HTMLScriptElement);
    assert.strictEqual(jquery.dataset.test, 'test');
    assert.strictEqual(jquery.getAttribute('src'), URL);
});

test('do not add attrs', async (t) => {
    mockScriptLoad(t, window.document.head);

    await simpleLoadScript({ url: URL });

    const script = window.document.querySelector('script');

    assert.ok(script instanceof window.HTMLScriptElement);
    assert.deepStrictEqual(script.getAttributeNames(), ['src']);
});

test('url wins over attrs.src', async (t) => {
    mockScriptLoad(t, window.document.head);

    const script = await simpleLoadScript({
        attrs: { src: 'https://example.com/other.js' },
        url: URL,
    });

    assert.strictEqual(script?.getAttribute('src'), URL);
});
