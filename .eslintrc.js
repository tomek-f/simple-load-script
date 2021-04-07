module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': [
    'google',
  ],
  'parserOptions': {
    'ecmaVersion': 12,
    'sourceType': 'module',
  },
  'rules': {
    'max-len': ['error', 120],
    'operator-linebreak': ['error', 'before'],
    'require-jsdoc': 'off',
  },
};
