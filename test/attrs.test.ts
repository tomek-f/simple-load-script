import { afterEach, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import simpleLoadScript from '../src/index.ts';
import { clearTestEnvironment } from './utils.ts';

beforeEach(() => {
    clearTestEnvironment();
});

afterEach(() => {
    clearTestEnvironment();
});

test('add attrs', async () => {
    // Mock script loading by triggering load event
    const originalAppendChild = window.document.head.appendChild.bind(
        window.document.head,
    );
    window.document.head.appendChild = function (node: Node) {
        const result = originalAppendChild(node);
        if (node.nodeName === 'SCRIPT') {
            setTimeout(() => {
                (node as HTMLScriptElement).dispatchEvent(new Event('load'));
            }, 0);
        }
        return result;
    } as any;

    await simpleLoadScript({
        attrs: { 'data-test': 'test', id: 'jquery' },
        url: '//code.jquery.com/jquery-4.0.0.js',
    });

    const jquery = window.document.querySelector(
        'script#jquery',
    ) as HTMLScriptElement;

    assert.notStrictEqual(jquery, undefined);
    assert.strictEqual(jquery.id, 'jquery');
    assert.strictEqual(jquery.dataset.test, 'test');
    assert.ok(jquery.src.includes('jquery-4.0.0.js'));
});

test('do not add attrs', async () => {
    // Mock script loading by triggering load event
    const originalAppendChild = window.document.head.appendChild.bind(
        window.document.head,
    );
    window.document.head.appendChild = function (node: Node) {
        const result = originalAppendChild(node);
        if (node.nodeName === 'SCRIPT') {
            setTimeout(() => {
                (node as HTMLScriptElement).dispatchEvent(new Event('load'));
            }, 0);
        }
        return result;
    } as any;

    await simpleLoadScript({
        url: '//code.jquery.com/jquery-4.0.0.js',
    });

    const script = window.document.querySelector('script') as HTMLScriptElement;
    const scriptWithId = window.document.querySelector('script#jquery');

    assert.notStrictEqual(script, undefined);
    assert.strictEqual(script.nodeType, 1);
    assert.strictEqual(scriptWithId, null);
    assert.ok(script.src.includes('jquery-4.0.0.js'));
});
