/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const config = Object.assign({}, require('./base.jest.config'), {
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage/functional',
  testMatch: ['<rootDir>/test/functional/**/*.[jt]s?(x)'],
})

module.exports = config
