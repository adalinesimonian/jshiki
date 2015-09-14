/* global describe, it, global */

var chai = require('chai')
var expect = chai.expect

var jshiki = require('../../index')

var jeval = (expression, scope) =>
  jshiki.parse(expression, { scope: scope }).eval()

describe('Scope', () => {
  it('should be able to access scoped properties', () => {
    expect(jeval('x', { x: '1' })).to.equal('1')
  })

  it('should be able to invoke scoped functions', () => {
    expect(jeval('x()', { x: () => '1' })).to.equal('1')
  })

  it('should not be able to access global variables', () => {
    global.y = '1'
    expect(jeval('y')).to.equal(undefined)
  })

  it('should not be able to access unscoped variables', () => {
    var z = '1' // eslint-disable-line no-unused-vars
    expect(jeval('z')).to.equal(undefined)
  })
})
