module.exports = {
  ...require('config/eslint-next.js'),
  root: true,
  parserOptions: {
    ecmaVersion: "latest"
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  env: {
    browser: true,
    node: true,
    es6: true
  },
};
