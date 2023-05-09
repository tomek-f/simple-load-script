import { afterAll, beforeAll, expect, test } from 'vitest';
import { preview } from 'vite';
import type { PreviewServer } from 'vite';
import { Browser, Page, chromium } from 'playwright';

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
    server.httpServer.close((error) => (error ? reject(error) : resolve()));
  });
});

// test('example stuff', async () => {
//   try {
//     await page.goto('http://localhost:3000');
//     const button = await page.$('#btn');
//     expect(button).toBeDefined();

//     let text = await page.evaluate((btn) => btn?.textContent, button);
//     expect(text).toBe('Clicked 0 time(s)');

//     await button?.click();
//     text = await page.evaluate((btn) => btn?.textContent, button);
//     expect(text).toBe('Clicked 1 time(s)');
//   } catch (err) {
//     console.error(err);
//     expect(err).toBeUndefined();
//   }
// }, 60_000);

test('proper load', async () => {
  try {
    await page.goto('http://localhost:3000');

    const ref = await page.evaluate(async () => {
      const scriptRef = await window.simpleLoadScript(
        '//code.jquery.com/jquery-2.2.3.js',
      );
      return scriptRef;
    });

    expect(ref).toBeDefined(); // HTMLScriptElement
  } catch (err) {
    expect(err).toBeUndefined();
  }
}, 60_000);

test('error load', async () => {
  try {
    await page.goto('http://localhost:3000');

    const ref = await page.evaluate(async () => {
      const scriptRef = await window.simpleLoadScript(
        '//wrong.domain/jquery-2.2.3.js',
      );
      return scriptRef;
    });

    expect(ref).toBeDefined();
  } catch (err) {
    expect((err as Error).message.includes('Error: Loading script')).toBe(true);
  }
}, 60_000);
