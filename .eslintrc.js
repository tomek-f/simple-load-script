module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'max-len': ['error', 80],
    // 'operator-linebreak': ['error', 'before'],
    'require-jsdoc': 'off',
    'object-curly-spacing': 'off',
    indent: 'off',
  },
};
