// oxlint-disable sort-keys
import { defineConfig } from 'oxfmt';

// kinda doesn't work
type TEMP_OxfmtConfig = ReturnType<typeof defineConfig>;

const config: TEMP_OxfmtConfig = defineConfig({
    arrowParens: 'always',
    printWidth: 80,
    singleQuote: true,
    trailingComma: 'all',
    semi: true,
    bracketSpacing: true,
    bracketSameLine: false,
    endOfLine: 'lf',
    tabWidth: 4,
    ignorePatterns: ['.agents', 'docs'],
} satisfies TEMP_OxfmtConfig);

export default config;
