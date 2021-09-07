/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const config = Object.assign({}, require('./unit.jest.config'), {
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
})

module.exports = config
