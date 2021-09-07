/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const config = Object.assign({}, require('./base.jest.config'), {
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage/unit',
  testMatch: ['<rootDir>/test/unit/**/*.[jt]s?(x)'],
})

module.exports = config
