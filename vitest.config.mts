import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: ['vitest.config.unit.mts', 'vitest.config.functional.mts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      reporter: ['text', 'lcov'],
      cleanOnRerun: true,
      reportOnFailure: true,
      thresholds: process.env.CI
        ? {
            statements: 80,
            branches: 80,
            functions: 80,
            lines: 80,
          }
        : {
            statements: 100,
            branches: 100,
            functions: 100,
            lines: 100,
          },
    },
  },
})
