module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'airbnb',
    'airbnb-typescript',
    'eslint-config-prettier',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: [
    'dist',
    'vite.config.ts',
    'vitest.config.ts',
    'tests',
    '*.cjs',
    '.eslintrc.cjs',
    'eslint.config.js',
    'tailwind.config.js',
    'postcss.config.js',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['react-refresh', 'prettier', '@typescript-eslint', 'react-hooks', 'import'],
  rules: {
    'prettier/prettier': 'error',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/jsx-no-bind': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        '': 'never',
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
        mjs: 'never',
      },
    ],
    'import/no-named-as-default': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'react/function-component-definition': [
      0,
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
  },
  globals: {
    Edit: 'writable',
    console: 'writable',
    _: 'writable',
    $: 'writable',
  },
};
