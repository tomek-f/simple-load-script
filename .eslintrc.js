module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['google'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'max-len': ['error', 80],
    'operator-linebreak': ['error', 'before'],
    'require-jsdoc': 'off',
    'object-curly-spacing': 'off',
    'operator-linebreak': 'off',
    // eslint-disable-next-line quote-props
    indent: 'off',
  },
};
