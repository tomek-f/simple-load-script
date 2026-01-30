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
        url: '//code.jquery.com/jquery-2.2.3.js',
    });

    const jquery = window.document.querySelector('script#jquery');
    expect(jquery).toBeNull();
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
        url: '//code.jquery.com/jquery-2.2.3.js',
    });

    const jquery = window.document.querySelector(
        'script#jquery',
    ) as HTMLScriptElement;
    expect(jquery.id).toBe('jquery');
});
