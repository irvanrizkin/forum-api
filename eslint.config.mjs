import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['**/dist/**', '**/node_modules/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
  },
  { languageOptions: { globals: globals.node } },
  ...tseslint.configs.strict,
  eslintPluginUnicorn.configs.recommended,
];
