/// <reference types="vitest" />

import { UserConfigExport, defineConfig } from 'vite';

export default defineConfig({
  test: {
    testTimeout: 60_000,
    hookTimeout: 60_000,
  },
}) satisfies UserConfigExport;
