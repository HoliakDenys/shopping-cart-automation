import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-config-prettier/flat';

export default defineConfig([
  globalIgnores(['node_modules', 'playwright-report', 'test-results', 'dist']),
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['tests/**'],
    extends: [playwright.configs['flat/recommended']],
    rules: {
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
    },
  },
  prettier,
]);
