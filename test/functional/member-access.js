/* global describe, it */

const chai = require('chai')
const expect = chai.expect

const jshiki = require('../../index')

const jeval = (expression, scope) =>
  jshiki.parse(expression, { scope: scope }).eval()

describe('Member Access', () => {
  it('should be able to access string properties', () => {
    expect(jeval("'str'.length")).to.equal(3)
  })

  it('should be able to access array properties', () => {
    expect(jeval('[1, 2, 3].length')).to.equal(3)
  })

  it('should be able to access object properties', () => {
    expect(jeval('({ x: 1 }).x')).to.equal(1)
  })

  it('should be able to invoke number methods', () => {
    expect(jeval('(15).toString(16)')).to.equal('f')
  })

  it('should be able to invoke string methods', () => {
    expect(jeval("' str '.trim()")).to.equal('str')
  })

  it('should be able to invoke array methods', () => {
    expect(jeval("[1, 2, 3].join(', ')")).to.equal('1, 2, 3')
  })
})
