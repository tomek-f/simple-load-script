import type { UserConfig } from 'vite';
import { defineConfig } from 'vite';

const config: UserConfig = defineConfig({ test: { environment: 'jsdom' } });

export default config;
