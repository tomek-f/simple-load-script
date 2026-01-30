/// <reference types="vitest" />

import type { UserConfigExport } from 'vite';
import { defineConfig } from 'vite';
import { TIMEOUT } from './test/constants';

export default defineConfig({
    test: {
        environment: 'jsdom',
        hookTimeout: TIMEOUT,
        testTimeout: TIMEOUT,
    },
}) satisfies UserConfigExport;
