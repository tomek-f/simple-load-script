import { defineConfig } from 'vitest/config';

const config: ReturnType<typeof defineConfig> = defineConfig({
    test: { environment: 'jsdom' },
});

export default config;
