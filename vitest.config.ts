/// <reference types="vitest" />

import type { UserConfig } from 'vite';
import { defineConfig } from 'vite';
import { TIMEOUT } from './test/constants';

const config: UserConfig = defineConfig({
    test: {
        environment: 'jsdom',
        hookTimeout: TIMEOUT,
        testTimeout: TIMEOUT,
    },
});

export default config;
