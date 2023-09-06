/// <reference types="vitest" />

import { UserConfigExport, defineConfig } from 'vite';
import { TIMEOUT } from './test/constants';

export default defineConfig({
    test: {
        testTimeout: TIMEOUT,
        hookTimeout: TIMEOUT,
    },
}) satisfies UserConfigExport;
