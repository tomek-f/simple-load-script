import { afterEach, beforeEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import simpleLoadScript from '../src/index.ts';
import { clearTestEnvironment } from './utils.ts';

// https://github.com/vitest-dev/vitest/blob/main/examples/puppeteer/test/basic.test.ts
// https://gist.github.com/mizchi/5f67109d0719ef6dd57695e1f528ce8d

beforeEach(() => {
    clearTestEnvironment();
});

afterEach(() => {
    clearTestEnvironment();
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
        '//code.jquery.com/jquery-4.0.0.js',
    );
    assert.notStrictEqual(scriptRef, undefined);
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
        url: '//code.jquery.com/jquery-4.0.0.js',
    });
    assert.notStrictEqual(scriptRef, undefined);
});

test('wrong url error', async () => {
    // Mock script loading by triggering error event synchronously
    const originalAppendChild = window.document.head.appendChild.bind(
        window.document.head,
    );
    window.document.head.appendChild = function (node: Node) {
        const result = originalAppendChild(node);
        if (node.nodeName === 'SCRIPT') {
            (node as HTMLScriptElement).dispatchEvent(new Event('error'));
        }
        return result;
    } as any;

    await assert.rejects(
        simpleLoadScript('https://wrong.domain/jquery-4.0.0.js'),
        (err: Error) => {
            assert.strictEqual(err.message, 'Loading script error');
            return true;
        },
    );
});

describe('wrong config error', () => {
    test('no param', async () => {
        try {
            // @ts-expect-error Testing wrong config
            await simpleLoadScript();
        } catch (err) {
            assert.strictEqual(
                (err as Error).message,
                'Object with url or url string needed',
            );
        }
    });
    test('bad config', async () => {
        try {
            await simpleLoadScript({
                // @ts-expect-error Testing wrong config
                elo: '//code.jquery.com/jquery-4.0.0.js',
            });
        } catch (err) {
            assert.strictEqual(
                (err as Error).message,
                'Object with url or url string needed',
            );
        }
    });
});
