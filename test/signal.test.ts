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

test('already aborted signal rejects without inserting', async () => {
    const controller = new AbortController();
    const reason = new Error('stop');
    controller.abort(reason);

    await assert.rejects(
        simpleLoadScript({ signal: controller.signal, url: URL }),
        (err) => err === reason,
    );
    assert.strictEqual(window.document.querySelector('script'), null);
});

test('abort while loading removes the tag and rejects', async (t) => {
    mockScriptLoad(t, window.document.head, 'none');
    const controller = new AbortController();
    const reason = new Error('stop');

    const promise = simpleLoadScript({
        attrs: { id: 'jquery' },
        signal: controller.signal,
        url: URL,
    });

    assert.ok(window.document.querySelector('script#jquery'));
    controller.abort(reason);

    await assert.rejects(promise, (err) => err === reason);
    assert.strictEqual(window.document.querySelector('script#jquery'), null);
});

test('AbortSignal.timeout works as a timeout', async (t) => {
    mockScriptLoad(t, window.document.head, 'none');

    await assert.rejects(
        simpleLoadScript({ signal: AbortSignal.timeout(10), url: URL }),
        { name: 'TimeoutError' },
    );
    assert.strictEqual(window.document.querySelector('script'), null);
});

test('abort after load does nothing', async (t) => {
    mockScriptLoad(t, window.document.head);
    const controller = new AbortController();

    const script = await simpleLoadScript({
        signal: controller.signal,
        url: URL,
    });
    controller.abort();

    assert.ok(script instanceof window.HTMLScriptElement);
    assert.strictEqual(window.document.querySelector('script'), script);
});
