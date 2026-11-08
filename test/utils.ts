import type { TestContext } from 'node:test';
import { JSDOM } from 'jsdom';

if (!globalThis.window) {
    const dom = new JSDOM('<!doctype html><html><body></body></html>');
    globalThis.window = dom.window as unknown as Window & typeof globalThis;
    // Node's global Event/EventTarget are a different realm than jsdom's, and
    // jsdom's dispatchEvent rejects events not created by its own Event class.
    globalThis.Event = dom.window.Event;
    globalThis.EventTarget = dom.window.EventTarget;
}

type Outcome = 'load' | 'error' | 'none';

/**
 * Clear any existing scripts and content from the document
 */
function clearTestEnvironment(): void {
    window.document.head.innerHTML = '';
    window.document.body.innerHTML = '';
}

/**
 * jsdom does not fetch scripts, so simulate the browser by dispatching
 * `load`/`error` on every script appended to `target`. The mock is restored
 * automatically when the test ends.
 */
function mockScriptLoad(
    t: TestContext,
    target: Element,
    outcome: Outcome | ((script: HTMLScriptElement) => Outcome) = 'load',
): void {
    const original = target.appendChild.bind(target);

    t.mock.method(target, 'appendChild', <T extends Node>(node: T): T => {
        const result = original(node);
        if (node instanceof window.HTMLScriptElement) {
            const resolved =
                typeof outcome === 'function' ? outcome(node) : outcome;
            if (resolved !== 'none') {
                setTimeout(() => {
                    node.dispatchEvent(new window.Event(resolved));
                }, 0);
            }
        }
        return result;
    });
}

export { clearTestEnvironment, mockScriptLoad };
