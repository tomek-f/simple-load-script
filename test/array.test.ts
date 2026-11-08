import { afterEach, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import simpleLoadScript from '../src/index.ts';
import { clearTestEnvironment, mockScriptLoad } from './utils.ts';

beforeEach(() => {
    clearTestEnvironment();
});

afterEach(() => {
    clearTestEnvironment();
});

test('load array ok', async (t) => {
    mockScriptLoad(t, window.document.head);

    const [a, b, c] = await simpleLoadScript([
        'https://code.jquery.com/jquery-4.0.0.js',
        {
            attrs: { id: 'jquery2' },
            url: 'https://code.jquery.com/jquery-3.7.1.js',
        },
        {
            attrs: { id: 'jquery3' },
            removeScript: true,
            url: 'https://code.jquery.com/jquery-3.7.0.js',
        },
    ]);

    assert.ok(a instanceof window.HTMLScriptElement);
    assert.strictEqual(
        a.getAttribute('src'),
        'https://code.jquery.com/jquery-4.0.0.js',
    );
    assert.ok(b instanceof window.HTMLScriptElement);
    assert.strictEqual(b.id, 'jquery2');
    assert.strictEqual(c, undefined);
    assert.strictEqual(window.document.querySelector('#jquery3'), null);
});

test('load array error', async (t) => {
    mockScriptLoad(t, window.document.head, (script) =>
        script.src.includes('wrong.domain') ? 'error' : 'load',
    );

    await assert.rejects(
        simpleLoadScript([
            'https://wrong.domain/jquery-4.0.0.js',
            {
                attrs: { id: 'jquery2' },
                url: 'https://code.jquery.com/jquery-3.7.1.js',
            },
        ]),
        {
            message:
                'Loading script error: https://wrong.domain/jquery-4.0.0.js',
        },
    );
});

test('empty array', async () => {
    assert.deepStrictEqual(await simpleLoadScript([]), []);
});
