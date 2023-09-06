import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
    input: './src/index.ts',
    plugins: [terser(), typescript({ include: ['./src/index.ts'] })],
    output: [
        { file: './dist/index.cjs.js', format: 'cjs', exports: 'default' },
        { file: './dist/index.es.js', format: 'es' },
        {
            file: './dist/index.umd.js',
            format: 'umd',
            name: 'simpleLoadScript',
        },
    ],
    watch: {
        include: './src/**',
    },
};
