import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['**/dist/**', '**/node_modules/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
  },
  { languageOptions: { globals: globals.node } },
  eslintPluginUnicorn.configs.recommended,
];
