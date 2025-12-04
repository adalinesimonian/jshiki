import { defineProject } from 'vitest/config'

export default defineProject({
  test: {
    name: 'functional',
    include: ['test/functional/**/*.ts'],
    globals: false,
    environment: 'node',
  },
})
