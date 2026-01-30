import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { preview } from 'vite';
import type { PreviewServer } from 'vite';
import type { Browser, Page } from 'playwright';
import { chromium } from 'playwright';
import { TIMEOUT } from './constants';

// https://github.com/vitest-dev/vitest/blob/main/examples/puppeteer/test/basic.test.ts
// https://gist.github.com/mizchi/5f67109d0719ef6dd57695e1f528ce8d

let browser: Browser;
let server: PreviewServer;
let page: Page;

beforeAll(async () => {
    browser = await chromium.launch({ headless: true });
    server = await preview({ preview: { port: 3000 } });
    page = await browser.newPage();
});

afterAll(async () => {
    await browser.close();
    await new Promise<void>((resolve, reject) => {
        server.httpServer.close((error: unknown) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
});

test(
    'load url ok',
    async () => {
        try {
            await page.goto('http://localhost:3000');
            const ref = await page.evaluate(async () => {
                const scriptRef = await window.simpleLoadScript(
                    '//code.jquery.com/jquery-2.2.3.js',
                );
                return scriptRef;
            });
            expect(ref).toBeDefined();
        } catch (err) {
            expect(err).toBeUndefined();
        }
    },
    TIMEOUT,
);

test(
    'load config ok',
    async () => {
        try {
            await page.goto('http://localhost:3000');
            const ref = await page.evaluate(async () => {
                const scriptRef = await window.simpleLoadScript({
                    url: '//code.jquery.com/jquery-2.2.3.js',
                });
                return scriptRef;
            });
            expect(ref).toBeDefined();
        } catch (err) {
            expect(err).toBeUndefined();
        }
    },
    TIMEOUT,
);

test(
    'wrong url error',
    async () => {
        try {
            await page.goto('http://localhost:3000');
            await page.evaluate(async () => {
                await window.simpleLoadScript('//wrong.domain/jquery-2.2.3.js');
            });
        } catch (err) {
            expect(
                (err as Error).message.includes('Error: Loading script error'),
            ).toBe(true);
        }
    },
    TIMEOUT,
);

describe('wrong config error', () => {
    test(
        'no param',
        async () => {
            try {
                await page.goto('http://localhost:3000');
                await page.evaluate(async () => {
                    // @ts-expect-error Testing wrong config
                    await window.simpleLoadScript();
                });
            } catch (err) {
                expect(
                    (err as Error).message.includes(
                        'Error: Object with url or url string needed',
                    ),
                ).toBe(true);
            }
        },
        TIMEOUT,
    );
    test(
        'bad config',
        async () => {
            try {
                await page.goto('http://localhost:3000');
                await page.evaluate(async () => {
                    await window.simpleLoadScript({
                        // @ts-expect-error Testing wrong config
                        elo: '//code.jquery.com/jquery-2.2.3.js',
                    });
                });
            } catch (err) {
                expect(
                    (err as Error).message.includes(
                        'Error: Object with url or url string needed',
                    ),
                ).toBe(true);
            }
        },
        TIMEOUT,
    );
});
