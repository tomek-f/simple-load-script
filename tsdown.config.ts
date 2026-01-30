import type { UserConfig } from 'tsdown';
import { defineConfig } from 'tsdown';

const config: UserConfig = defineConfig({
    clean: true,
    dts: true,
    entry: ['src/index.ts'],
    format: ['esm', 'cjs', 'iife', 'umd'],
    globalName: 'simpleLoadScript',
    minify: true,
    outDir: 'dist',
});

export default config;
