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

test('load array ok', async () => {
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

    const [a, b, c] = await simpleLoadScript([
        '//code.jquery.com/jquery-4.0.0.js',
        {
            attrs: { id: 'jquery2' },
            url: '//code.jquery.com/jquery-3.7.1.js',
        },
        {
            attrs: { id: 'jquery3' },
            url: '//code.jquery.com/jquery-3.7.0.js',
        },
    ]);

    assert.strictEqual([a, b, c].length, 3);

    const jquery1 = window.document.querySelector(
        'head script[src="//code.jquery.com/jquery-4.0.0.js"]',
    ) as HTMLScriptElement;
    const jquery2 = window.document.querySelector(
        'script#jquery2',
    ) as HTMLScriptElement;
    const jquery3 = window.document.querySelector(
        'script#jquery3',
    ) as HTMLScriptElement;

    assert.strictEqual(
        jquery1.getAttribute('src'),
        '//code.jquery.com/jquery-4.0.0.js',
    );
    assert.strictEqual(jquery2.id, 'jquery2');
    assert.strictEqual(jquery3.id, 'jquery3');
});

test('load array error', async () => {
    // Mock script loading by triggering error event
    const originalAppendChild = window.document.head.appendChild.bind(
        window.document.head,
    );
    window.document.head.appendChild = function (node: Node) {
        const result = originalAppendChild(node);
        if (node.nodeName === 'SCRIPT') {
            const script = node as HTMLScriptElement;
            setTimeout(() => {
                if (script.src.includes('wrong.domain')) {
                    script.dispatchEvent(new Event('error'));
                } else {
                    script.dispatchEvent(new Event('load'));
                }
            }, 0);
        }
        return result;
    } as any;

    try {
        await simpleLoadScript([
            '//wrong.domain/jquery-4.0.0.js',
            {
                attrs: { id: 'jquery2' },
                url: '//code.jquery.com/jquery-3.7.1.js',
            },
            {
                attrs: { id: 'jquery3' },
                url: '//code.jquery.com/jquery-3.7.0.js',
            },
        ]);
    } catch (err) {
        assert.strictEqual((err as Error).message, 'Loading script error');
    }
});
