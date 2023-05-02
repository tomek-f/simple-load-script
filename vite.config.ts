import { UserConfigExport, defineConfig } from 'vite';

export default defineConfig({
  root: 'browser',
  server: {
    port: 3030,
  },
  preview: {
    port: 8080,
  },
}) satisfies UserConfigExport;
