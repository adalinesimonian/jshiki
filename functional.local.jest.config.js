/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const config = Object.assign({}, require('./functional.jest.config'), {
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 100,
      lines: 90,
      statements: 90,
    },
  },
})

module.exports = config
