import { afterEach, beforeEach, expect, test } from 'vitest';
import simpleLoadScript from '../src/index';

beforeEach(() => {
    // Clear any existing scripts before each test
    window.document.head.innerHTML = '';
    window.document.body.innerHTML = '';
});

afterEach(() => {
    // Clean up after each test
    window.document.head.innerHTML = '';
    window.document.body.innerHTML = '';
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
        '//code.jquery.com/jquery-2.2.3.js',
        {
            attrs: { id: 'jquery2' },
            url: '//code.jquery.com/jquery-2.2.2.js',
        },
        {
            attrs: { id: 'jquery3' },
            url: '//code.jquery.com/jquery-2.2.1.js',
        },
    ]);

    expect([a, b, c].length).toBe(3);

    const jquery1 = window.document.querySelector(
        'head script[src="//code.jquery.com/jquery-2.2.3.js"]',
    ) as HTMLScriptElement;
    const jquery2 = window.document.querySelector(
        'script#jquery2',
    ) as HTMLScriptElement;
    const jquery3 = window.document.querySelector(
        'script#jquery3',
    ) as HTMLScriptElement;

    expect(jquery1.getAttribute('src')).toBe(
        '//code.jquery.com/jquery-2.2.3.js',
    );
    expect(jquery2.id).toBe('jquery2');
    expect(jquery3.id).toBe('jquery3');
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
            '//wrong.domain/jquery-2.2.3.js',
            {
                attrs: { id: 'jquery2' },
                url: '//code.jquery.com/jquery-2.2.2.js',
            },
            {
                attrs: { id: 'jquery3' },
                url: '//code.jquery.com/jquery-2.2.1.js',
            },
        ]);
    } catch (err) {
        expect((err as Error).message).toBe('Loading script error');
    }
});
