import eslint from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import tseslint from 'typescript-eslint'
import vitest from '@vitest/eslint-plugin'

export default defineConfig(
  globalIgnores([
    '**/.yarn',
    '**/.venv',
    '**/node_modules',
    '**/dist',
    '**/coverage',
    '**/site',
    'docs/api',
    'docs/assets/js',
  ]),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  vitest.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
)
