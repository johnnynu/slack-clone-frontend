module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'airbnb', 'prettier'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'react/jsx-filename-extension': 0,
    'linebreak-style': 0,
    'no-confusing-arrow': 0,
    'implicit-arrow-linebreak': 0,
    'object-curly-newline': 0,
    'react/state-in-constructor': 0,
    'no-unused-state': 0,
    'no-unused-vars': 0,
    'react/destructuring-assignment': 0,
    'react/prop-types': 0,
    'comma-dangle': 0,
    'function-paren-newline': 0,
    'no-unneeded-ternary': 0,
    'arrow-body-style': 0,
    'jsx-props-no-spreading': 0,
    'react/jsx-props-no-spreading': 'off',
    'object-curly-newline': 'off',
    'import/prefer-default-export': 0,
  },
  parser: 'babel-eslint',
  env: {
    browser: 1,
  },
};
