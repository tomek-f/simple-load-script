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
    server = await preview({ preview: { port: 3003 } });
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
    'placement head',
    async () => {
        try {
            await page.goto('http://localhost:3003');
            await page.evaluate(async () => {
                await window.simpleLoadScript({
                    attrs: { id: 'jquery' },
                    url: '//code.jquery.com/jquery-2.2.3.js',
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
                    attrs: { id: 'jquery' },
                    inBody: true,
                    url: '//code.jquery.com/jquery-2.2.3.js',
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
                    attrs: { id: 'jquery' },
                    insertInto: '#insert',
                    url: '//code.jquery.com/jquery-2.2.3.js',
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
                    attrs: { id: 'jquery' },
                    insertInto: '#insert1',
                    url: '//code.jquery.com/jquery-2.2.3.js',
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
