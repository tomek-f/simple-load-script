import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { preview } from 'vite';
import type { PreviewServer } from 'vite';
import { Browser, Page, chromium } from 'playwright';

// https://github.com/vitest-dev/vitest/blob/main/examples/puppeteer/test/basic.test.ts
// https://gist.github.com/mizchi/5f67109d0719ef6dd57695e1f528ce8d

describe(`browser:${chromium.name()}`, () => {
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

  test('should have the correct title', async () => {
    try {
      await page.goto('http://localhost:3000');
      const button = await page.$('#btn');
      expect(button).toBeDefined();

      let text = await page.evaluate((btn) => btn?.textContent, button);
      expect(text).toBe('Clicked 0 time(s)');

      await button?.click();
      text = await page.evaluate((btn) => btn?.textContent, button);
    } catch (e) {
      console.error(e);
      expect(e).toBeUndefined();
    }
  }, 60_000);
});
