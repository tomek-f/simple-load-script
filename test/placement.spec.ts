import { afterEach, beforeEach, expect, test } from 'vitest';
import simpleLoadScript from '../src/index';

beforeEach(() => {
    // Clear any existing scripts before each test
    window.document.head.innerHTML = '';
    window.document.body.innerHTML = '<div id="insert"></div>';
});

afterEach(() => {
    // Clean up after each test
    window.document.head.innerHTML = '';
    window.document.body.innerHTML = '';
});

test('placement head', async () => {
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
        'head script#jquery',
    ) as HTMLScriptElement;
    expect(jquery.id).toBe('jquery');
});

test('placement body', async () => {
    // Mock script loading by triggering load event
    const originalAppendChild = window.document.body.appendChild.bind(
        window.document.body,
    );
    window.document.body.appendChild = function (node: Node) {
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
        inBody: true,
        url: '//code.jquery.com/jquery-2.2.3.js',
    });

    const jquery = window.document.querySelector(
        'body script#jquery',
    ) as HTMLScriptElement;
    expect(jquery.id).toBe('jquery');
});

test('insertInto ok', async () => {
    const insertDiv = window.document.querySelector('#insert') as HTMLElement;
    // Mock script loading by triggering load event
    const originalAppendChild = insertDiv.appendChild.bind(insertDiv);
    insertDiv.appendChild = function (node: Node) {
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
        insertInto: '#insert',
        url: '//code.jquery.com/jquery-2.2.3.js',
    });

    const jquery = window.document.querySelector(
        '#insert script#jquery',
    ) as HTMLScriptElement;
    expect(jquery.id).toBe('jquery');
});

test('insertInto error', async () => {
    try {
        await simpleLoadScript({
            attrs: { id: 'jquery' },
            insertInto: '#insert1',
            url: '//code.jquery.com/jquery-2.2.3.js',
        });
    } catch (err) {
        expect((err as Error).message).toBe('No DOM element to append script');
    }
});
