import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
    input: './src/index.ts',
    plugins: [terser(), typescript({ include: ['./src/index.ts'] })],
    output: [
        { dir: './dist', format: 'cjs', exports: 'default' },
        { dir: './dist', format: 'es' },
        {
            dir: './dist',
            format: 'umd',
            name: 'simpleLoadScript',
        },
    ],
    watch: {
        include: './src/**',
    },
};
