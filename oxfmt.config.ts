import type { OxfmtConfig } from 'oxfmt';
import { defineConfig } from 'oxfmt';

const config: OxfmtConfig = defineConfig<OxfmtConfig>({
    arrowParens: 'always',
    bracketSameLine: false,
    bracketSpacing: true,
    endOfLine: 'lf',
    ignorePatterns: ['.agents', 'docs'],
    printWidth: 80,
    semi: true,
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'all',
});

export default config;
