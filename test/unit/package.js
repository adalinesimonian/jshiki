/* global describe, it, before, after */

var chai = require('chai')
var expect = chai.expect
var sinon = require('sinon')

chai.use(require('sinon-chai'))

var pkg = require('../../package.json')
var index = require('../../index')
var Expression = require('../../expression')
var esprima = require('../../lib/esprima')

describe('Package', () => {
  it('should point to index.js', () => {
    expect(pkg.main).to.equal('index.js')
  })

  it('should export a parse function', () => {
    expect(index).to.include.keys('parse')
    expect(index.parse).to.be.a('function')
  })

  describe('parse', () => {
    before(() => sinon.stub(esprima, 'parse'))
    after(() => esprima.parse.restore())

    it('should parse expressions using the given options', () => {
      index.parse('x', { scope: { x: '1' } })

      expect(esprima.parse).to.have.been.calledWith('x', sinon.match({
        scope: { x: '1' }
      }))
    })

    it('should return an expression', () => {
      var expression = index.parse('x', { scope: { x: '1' } })

      expect(expression).to.be.an.instanceOf(Expression)
    })
  })
})
