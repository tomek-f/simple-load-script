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
  server = await preview({ preview: { port: 3000 } });
  page = await browser.newPage();
});

afterAll(async () => {
  await browser.close();
  await new Promise<void>((resolve, reject) => {
    server.httpServer.close((error) => (error ? reject(error) : resolve()));
  });
});

test(
  'removeScript true',
  async () => {
    try {
      await page.goto('http://localhost:3000');
      await page.evaluate(async () => {
        await window.simpleLoadScript({
          url: '//code.jquery.com/jquery-2.2.3.js',
          removeScript: true,
          attrs: { id: 'jquery' },
        });
      });
      const jquery = await page.$('script#jquery');
      const id = await page.evaluate((script) => script?.id, jquery);
      const nodeType = await page.evaluate(
        (script) => script?.nodeType,
        jquery,
      );
      expect(id).toBeUndefined();
      expect(nodeType).toBeUndefined();
    } catch (err) {
      expect(err).toBeUndefined();
    }
  },
  TIMEOUT,
);

test(
  'removeScript false',
  async () => {
    try {
      await page.goto('http://localhost:3000');
      await page.evaluate(async () => {
        await window.simpleLoadScript({
          url: '//code.jquery.com/jquery-2.2.3.js',
          attrs: { id: 'jquery' },
        });
      });
      const jquery = await page.$('script#jquery');
      const id = await page.evaluate((script) => script?.id, jquery);
      expect(id).toBe('jquery');
    } catch (err) {
      expect(err).toBeUndefined();
    }
  },
  TIMEOUT,
);
