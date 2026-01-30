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
        url: '//code.jquery.com/jquery-2.2.3.js',
    });

    const jquery = window.document.querySelector(
        'script#jquery',
    ) as HTMLScriptElement;

    expect(jquery).toBeDefined();
    expect(jquery.id).toBe('jquery');
    expect(jquery.dataset.test).toBe('test');
    expect(jquery.src).toContain('jquery-2.2.3.js');
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
        url: '//code.jquery.com/jquery-2.2.3.js',
    });

    const script = window.document.querySelector('script') as HTMLScriptElement;
    const scriptWithId = window.document.querySelector('script#jquery');

    expect(script).toBeDefined();
    expect(script.nodeType).toBe(1);
    expect(scriptWithId).toBeNull();
    expect(script.src).toContain('jquery-2.2.3.js');
});
