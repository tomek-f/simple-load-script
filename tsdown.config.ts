import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { UserConfig } from 'tsdown';
import { defineConfig } from 'tsdown';

const CJS_DTS = 'index.d.cts';
const ESM_STYLE_EXPORT = 'export { type Config, simpleLoadScript as default };';
const CJS_STYLE_EXPORT = [
    'type _Config = Config;',
    'declare namespace simpleLoadScript {',
    '  export type Config = _Config;',
    '}',
    'export = simpleLoadScript;',
].join('\n');

/**
 * The CJS build sets `module.exports = simpleLoadScript`, but the generated
 * `.d.cts` uses `export default` (the dts plugin only emits `export =` when
 * there are no other exports, and we also export `Config`). Rewrite it so
 * CJS TypeScript users get correct types; `attw` verifies the result.
 */
async function fixCjsTypes(outDir: string): Promise<void> {
    const file = path.join(outDir, CJS_DTS);
    const source = await readFile(file, 'utf8');

    if (!source.includes(ESM_STYLE_EXPORT)) {
        throw new Error(`Unexpected export statement in ${file}`);
    }

    await writeFile(file, source.replace(ESM_STYLE_EXPORT, CJS_STYLE_EXPORT));
}

const config: UserConfig = defineConfig({
    clean: true,
    dts: true,
    entry: ['src/index.ts'],
    format: ['esm', 'cjs', 'iife', 'umd'],
    globalName: 'simpleLoadScript',
    hooks: {
        async 'build:done'({ chunks, options }) {
            if (chunks.some((chunk) => chunk.fileName === CJS_DTS)) {
                await fixCjsTypes(options.outDir);
            }
        },
    },
    minify: true,
    outDir: 'dist',
});

export default config;
