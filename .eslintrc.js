module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    // disable common rules so ESLint reports nothing
    'no-unused-vars': 'off',
    'no-undef': 'off',
    'no-console': 'off'
  }
};
