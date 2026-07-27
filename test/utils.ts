import { JSDOM } from 'jsdom';

if (!globalThis.window) {
    const dom = new JSDOM('<!doctype html><html><body></body></html>');
    globalThis.window = dom.window as unknown as Window & typeof globalThis;
    // Node's global Event/EventTarget are a different realm than jsdom's, and
    // jsdom's dispatchEvent rejects events not created by its own Event class.
    globalThis.Event = dom.window.Event;
    globalThis.EventTarget = dom.window.EventTarget;
}

/**
 * Clear any existing scripts and content from the document
 */
export function clearTestEnvironment(): void {
    window.document.head.innerHTML = '';
    window.document.body.innerHTML = '';
}
