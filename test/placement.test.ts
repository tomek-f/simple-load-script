import { afterEach, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import simpleLoadScript from '../src/index.ts';
import { clearTestEnvironment, mockScriptLoad } from './utils.ts';

const URL = 'https://code.jquery.com/jquery-4.0.0.js';

beforeEach(() => {
    clearTestEnvironment();
    window.document.body.innerHTML = '<div id="insert"></div>';
});

afterEach(() => {
    clearTestEnvironment();
});

function getInsertDiv(): HTMLElement {
    const div = window.document.querySelector<HTMLElement>('#insert');
    assert.ok(div);
    return div;
}

test('placement head', async (t) => {
    mockScriptLoad(t, window.document.head);

    await simpleLoadScript({ attrs: { id: 'jquery' }, url: URL });

    assert.ok(window.document.querySelector('head script#jquery'));
});

test('placement body', async (t) => {
    mockScriptLoad(t, window.document.body);

    await simpleLoadScript({ attrs: { id: 'jquery' }, inBody: true, url: URL });

    assert.ok(window.document.querySelector('body > script#jquery'));
    assert.strictEqual(window.document.querySelector('head script'), null);
});

test('insertInto ok', async (t) => {
    mockScriptLoad(t, getInsertDiv());

    await simpleLoadScript({
        attrs: { id: 'jquery' },
        insertInto: '#insert',
        url: URL,
    });

    assert.ok(window.document.querySelector('#insert > script#jquery'));
});

test('insertInto overrides inBody', async (t) => {
    mockScriptLoad(t, getInsertDiv());

    await simpleLoadScript({
        attrs: { id: 'jquery' },
        inBody: true,
        insertInto: '#insert',
        url: URL,
    });

    assert.ok(window.document.querySelector('#insert > script#jquery'));
});

test('insertInto error', async () => {
    await assert.rejects(
        simpleLoadScript({
            attrs: { id: 'jquery' },
            insertInto: '#insert1',
            url: URL,
        }),
        { message: 'No DOM element to append script' },
    );
    assert.strictEqual(window.document.querySelector('script'), null);
});
