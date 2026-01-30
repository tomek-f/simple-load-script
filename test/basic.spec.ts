import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import simpleLoadScript from '../src/index';

// https://github.com/vitest-dev/vitest/blob/main/examples/puppeteer/test/basic.test.ts
// https://gist.github.com/mizchi/5f67109d0719ef6dd57695e1f528ce8d

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

test('load url ok', async () => {
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

    const scriptRef = await simpleLoadScript(
        '//code.jquery.com/jquery-2.2.3.js',
    );
    expect(scriptRef).toBeDefined();
});

test('load config ok', async () => {
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

    const scriptRef = await simpleLoadScript({
        url: '//code.jquery.com/jquery-2.2.3.js',
    });
    expect(scriptRef).toBeDefined();
});

test('wrong url error', async () => {
    // Mock script loading by triggering error event
    const originalAppendChild = window.document.head.appendChild.bind(
        window.document.head,
    );
    window.document.head.appendChild = function (node: Node) {
        const result = originalAppendChild(node);
        if (node.nodeName === 'SCRIPT') {
            setTimeout(() => {
                (node as HTMLScriptElement).dispatchEvent(new Event('error'));
            }, 0);
        }
        return result;
    } as any;

    try {
        await simpleLoadScript('//wrong.domain/jquery-2.2.3.js');
    } catch (err) {
        expect((err as Error).message).toBe('Loading script error');
    }
});

describe('wrong config error', () => {
    test('no param', async () => {
        try {
            // @ts-expect-error Testing wrong config
            await simpleLoadScript();
        } catch (err) {
            expect((err as Error).message).toBe(
                'Object with url or url string needed',
            );
        }
    });
    test('bad config', async () => {
        try {
            await simpleLoadScript({
                // @ts-expect-error Testing wrong config
                elo: '//code.jquery.com/jquery-2.2.3.js',
            });
        } catch (err) {
            expect((err as Error).message).toBe(
                'Object with url or url string needed',
            );
        }
    });
});
