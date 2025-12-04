import { defineConfig, globalIgnores } from 'eslint/config'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import vitest from '@vitest/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default defineConfig([
  globalIgnores([
    '**/.yarn',
    '**/node_modules',
    '**/dist',
    '**/coverage',
    '**/site',
    'docs/api',
  ]),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      '@vitest': vitest,
    },

    languageOptions: {
      parser: tsParser,
    },

    rules: {
      'no-unused-expressions': 0,
      'no-var': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      'no-redeclare': 'off',
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      'no-dupe-class-members': 'off',
      '@typescript-eslint/no-dupe-class-members': 'error',
      'lines-between-class-members': 'off',
      '@typescript-eslint/no-redeclare': 'error',
    },
  },
])
