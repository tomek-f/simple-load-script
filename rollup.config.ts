import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

const config = {
    input: './src/index.ts',
    output: [
        { dir: './dist', exports: 'default', format: 'cjs' },
        { dir: './dist', format: 'es' },
        {
            dir: './dist',
            format: 'umd',
            name: 'simpleLoadScript',
        },
    ],
    plugins: [terser(), typescript({ include: ['./src/index.ts'] })],
    watch: {
        include: './src/**',
    },
};

export default config;
