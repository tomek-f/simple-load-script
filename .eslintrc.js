module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['google'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
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
