import type { UserConfigExport } from 'vite';
import { defineConfig } from 'vite';

export default defineConfig({
    preview: {
        port: 8080,
    },
    root: 'browser',
    server: {
        port: 3030,
    },
}) satisfies UserConfigExport;
