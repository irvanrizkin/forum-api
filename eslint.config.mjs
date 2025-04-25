import pluginImport from 'eslint-plugin-import';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
  },
  { languageOptions: { globals: globals.node } },
  ...tseslint.configs.strict,
  eslintPluginUnicorn.configs.recommended,
  {
    plugins: {
      import: pluginImport,
    },
    rules: {
      'no-console': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: ['../*', './*'],
        },
      ],
    },
    settings: {
      'import/resolver': {
        alias: {
          map: [['@', './src']], // adjust '@' and './src' as needed
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  },
];
