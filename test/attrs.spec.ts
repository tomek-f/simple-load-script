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
  server = await preview({ preview: { port: 3001 } });
  page = await browser.newPage();
});

afterAll(async () => {
  await browser.close();
  await new Promise<void>((resolve, reject) => {
    server.httpServer.close((error) => (error ? reject(error) : resolve()));
  });
});

test(
  'add attrs',
  async () => {
    try {
      await page.goto('http://localhost:3001');
      await page.evaluate(async () => {
        await window.simpleLoadScript({
          url: '//code.jquery.com/jquery-2.2.3.js',
          attrs: { id: 'jquery', 'data-test': 'test' },
        });
      });
      const jquery = await page.$('script#jquery');
      const id = await page.evaluate((script) => script?.id, jquery);
      const dataTest = await page.evaluate(
        (script) => script?.dataset.test,
        jquery,
      );

      expect(id).toBe('jquery');
      expect(dataTest).toBe('test');
    } catch (err) {
      expect(err).toBeUndefined();
    }
  },
  TIMEOUT,
);

test(
  'dom not add attrs',
  async () => {
    try {
      await page.goto('http://localhost:3001');
      await page.evaluate(async () => {
        await window.simpleLoadScript({
          url: '//code.jquery.com/jquery-2.2.3.js',
        });
      });
      const jquery = await page.$('script');
      const jqueryWithId = await page.$('script#jquery');
      const nodeType = await page.evaluate(
        (script) => script?.nodeType,
        jquery,
      );
      const nodeTypeWithId = await page.evaluate(
        (script) => script?.nodeType,
        jqueryWithId,
      );

      expect(nodeType).toBe(1);
      expect(nodeTypeWithId).toBeUndefined();
    } catch (err) {
      expect(err).toBeUndefined();
    }
  },
  TIMEOUT,
);
