const commonJs = require('@rollup/plugin-commonjs');
import { babel } from '@rollup/plugin-babel'
const { terser } = require('rollup-plugin-terser');

module.exports = {
  input: './src/index.js',
  plugins: [
    commonJs(),
    terser(),
    babel({
      babelHelpers: 'bundled',
    }),
  ],
  output: [
    { file: './dist/index.cjs.js', format: 'cjs', exports: 'default' },
    { file: './dist/index.umd.js', format: 'umd', name: 'simpleLoadScript' }
  ],
  watch: {
    include: './src/**',
  },
};
