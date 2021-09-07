/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const config = {
  projects: [
    '<rootDir>/unit.jest.config.js',
    '<rootDir>/functional.jest.config.js',
  ],
}

module.exports = config
