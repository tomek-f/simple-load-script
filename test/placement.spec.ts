import { afterAll, beforeAll, expect, test } from 'vitest';
import { preview } from 'vite';
import type { PreviewServer } from 'vite';
import { Browser, Page, chromium } from 'playwright';
import { TIMEOUT } from './constants';

let browser: Browser;
let server: PreviewServer;
let page: Page;

beforeAll(async () => {
    browser = await chromium.launch({ headless: true });
    server = await preview({ preview: { port: 3003 } });
    page = await browser.newPage();
});

afterAll(async () => {
    await browser.close();
    await new Promise<void>((resolve, reject) => {
        server.httpServer.close((error: unknown) =>
            error ? reject(error) : resolve(),
        );
    });
});

test(
    'placement head',
    async () => {
        try {
            await page.goto('http://localhost:3003');
            await page.evaluate(async () => {
                await window.simpleLoadScript({
                    url: '//code.jquery.com/jquery-2.2.3.js',
                    attrs: { id: 'jquery' },
                });
            });
            const jquery = await page.$('head script#jquery');
            const id = await page.evaluate((script) => script?.id, jquery);
            expect(id).toBe('jquery');
        } catch (err) {
            expect(err).toBeUndefined();
        }
    },
    TIMEOUT,
);

test(
    'placement body',
    async () => {
        try {
            await page.goto('http://localhost:3003');
            await page.evaluate(async () => {
                await window.simpleLoadScript({
                    url: '//code.jquery.com/jquery-2.2.3.js',
                    attrs: { id: 'jquery' },
                    inBody: true,
                });
            });
            const jquery = await page.$('body script#jquery');
            const id = await page.evaluate((script) => script?.id, jquery);
            expect(id).toBe('jquery');
        } catch (err) {
            expect(err).toBeUndefined();
        }
    },
    TIMEOUT,
);

test(
    'insertInto ok',
    async () => {
        try {
            await page.goto('http://localhost:3003');
            await page.evaluate(async () => {
                await window.simpleLoadScript({
                    url: '//code.jquery.com/jquery-2.2.3.js',
                    attrs: { id: 'jquery' },
                    insertInto: '#insert',
                });
            });
            const jquery = await page.$('#insert script#jquery');
            const id = await page.evaluate((script) => script?.id, jquery);
            expect(id).toBe('jquery');
        } catch (err) {
            expect(err).toBeUndefined();
        }
    },
    TIMEOUT,
);

test(
    'insertInto error',
    async () => {
        try {
            await page.goto('http://localhost:3003');
            await page.evaluate(async () => {
                await window.simpleLoadScript({
                    url: '//code.jquery.com/jquery-2.2.3.js',
                    attrs: { id: 'jquery' },
                    insertInto: '#insert1',
                });
            });
        } catch (err) {
            expect(
                (err as Error).message.includes(
                    'No DOM element to append script',
                ),
            ).toBe(true);
        }
    },
    TIMEOUT,
);
