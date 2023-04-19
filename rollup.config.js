const commonJs = require('@rollup/plugin-commonjs');
import { babel } from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
const { terser } = require('rollup-plugin-terser');

module.exports = {
  input: './src/index.ts',
  plugins: [
    typescript(),
    commonJs(),
    terser(),
    babel({
      babelHelpers: 'bundled',
    }),
  ],
  output: [
    { file: './dist/index.cjs.js', format: 'cjs', exports: 'default' },
    { file: './dist/index.es.js', format: 'es' },
    { file: './dist/index.umd.js', format: 'umd', name: 'simpleLoadScript' },
  ],
  watch: {
    include: './src/**',
  },
};
