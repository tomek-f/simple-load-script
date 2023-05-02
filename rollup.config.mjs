import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: './src/index.ts',
  plugins: [commonjs(), terser(), typescript({ include: ['./src/**'] })],
  output: [
    { file: './dist/index.cjs.js', format: 'cjs', exports: 'default' },
    { file: './dist/index.es.js', format: 'es' },
    { file: './dist/index.umd.js', format: 'umd', name: 'simpleLoadScript' },
  ],
  watch: {
    include: './src/**',
  },
};
