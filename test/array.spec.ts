import { afterAll, beforeAll, expect, test } from 'vitest';
import { preview } from 'vite';
import type { PreviewServer } from 'vite';
import type { Browser, Page } from 'playwright';
import { chromium } from 'playwright';
import { TIMEOUT } from './constants';

let browser: Browser;
let server: PreviewServer;
let page: Page;

beforeAll(async () => {
    browser = await chromium.launch({ headless: true });
    server = await preview({ preview: { port: 3005 } });
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
    'load array ok',
    async () => {
        try {
            await page.goto('http://localhost:3005');
            const scriptRefs = await page.evaluate(async () => {
                const [a, b, c] = await window.simpleLoadScript([
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
                return [a, b, c];
            });
            expect(scriptRefs.length).toBe(3);
            const jquery1 = await page.$(
                'head script[src="//code.jquery.com/jquery-2.2.3.js"]',
            );
            const jquery2 = await page.$('script#jquery2');
            const jquery3 = await page.$('script#jquery3');
            const src1 = await page.evaluate(
                (script) => script?.getAttribute('src'),
                jquery1,
            );
            const id2 = await page.evaluate((script) => script?.id, jquery2);
            const id3 = await page.evaluate((script) => script?.id, jquery3);
            expect(src1).toBe('//code.jquery.com/jquery-2.2.3.js');
            expect(id2).toBe('jquery2');
            expect(id3).toBe('jquery3');
        } catch (err) {
            expect(err).toBeUndefined();
        }
    },
    TIMEOUT,
);

test(
    'load array error',
    async () => {
        try {
            await page.goto('http://localhost:3005');
            await page.evaluate(async () => {
                await window.simpleLoadScript([
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
            });
        } catch (err) {
            expect(
                (err as Error).message.includes('Error: Loading script error'),
            ).toBe(true);
        }
    },
    TIMEOUT,
);
