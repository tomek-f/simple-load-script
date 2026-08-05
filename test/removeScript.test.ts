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

test('removeScript true', async () => {
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
        attrs: { id: 'jquery' },
        removeScript: true,
        url: '//code.jquery.com/jquery-4.0.0.js',
    });

    const jquery = window.document.querySelector('script#jquery');
    assert.strictEqual(jquery, null);
});

test('removeScript false', async () => {
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
        attrs: { id: 'jquery' },
        url: '//code.jquery.com/jquery-4.0.0.js',
    });

    const jquery = window.document.querySelector(
        'script#jquery',
    ) as HTMLScriptElement;
    assert.strictEqual(jquery.id, 'jquery');
});
