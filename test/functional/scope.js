/* global describe, it, global */

var chai = require('chai')
var expect = chai.expect

var jshiki = require('../../index')

var jeval = (expression, scope) =>
  jshiki.parse(expression, { scope: scope }).eval()

var y = '1' // eslint-disable-line no-unused-vars
global.z = '2'

describe('Scope', () => {
  it('should be able to access scoped properties', () => {
    expect(jeval('x', { x: '1' })).to.equal('1')
  })

  it('should be able to invoke scoped functions', () => {
    expect(jeval('x()', { x: () => '1' })).to.equal('1')
  })

  it('should not be able to access global variables', () => {
    expect(jeval('y')).to.equal(undefined)
  })

  it('should not be able to access unscoped variables', () => {
    expect(jeval('z')).to.equal(undefined)
  })
})
