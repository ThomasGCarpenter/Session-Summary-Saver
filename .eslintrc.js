module.exports = {
  extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
  // Dictates allowed syntax
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module' // es6 import/export
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  parser: 'babel-eslint', // class properties
  plugins: ['prettier'],
  // Dictates allowed globals
  env: {
    browser: true,
    node: true,
    es6: true,
    jquery: true
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: false
      }
    ],
    // Temporarily disable prop type validation
    'react/prop-types': 0
  },
  globals: {
    Apex: 'writable'
  }
}
