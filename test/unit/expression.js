/* global describe, it, before, after */

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')

chai.use(require('sinon-chai'))

const ASTDelegate = require('../../astdelegate')
const Expression = require('../../expression')
const esprima = require('../../lib/esprima')

describe('Expression', () => {
  it('should export a constructor', () => {
    expect(Expression).to.be.a('function')

    sinon.stub(esprima, 'parse')

    expect(new Expression()).to.be.an.instanceof(Expression)

    esprima.parse.restore()
  })

  describe('Constructor', () => {
    before(() => sinon.stub(esprima, 'parse'))
    after(() => esprima.parse.restore())

    it('should parse expressions with a delegate with the same options', () => {
      /* eslint-disable no-new */
      new Expression('x', { scope: { x: '1' } })
      /* eslint-enable no-new */

      expect(esprima.parse).to.have.been.calledWith(
        'x',
        sinon.match.instanceOf(ASTDelegate)
      )
      expect(esprima.parse).to.have.been.calledWith(
        'x',
        sinon.match({
          scope: { x: '1' },
        })
      )
    })

    it("should set the instance's eval function", () => {
      expect(new Expression('x').eval).to.be.a('function')
    })
  })

  describe('eval', () => {
    it("should evaluate the delegate's expression", () => {
      var func = sinon.spy(() => '1')
      sinon.stub(esprima, 'parse').callsFake((str, delegate) => {
        delegate.expression = func
      })

      var expression = new Expression('x')
      var result = expression.eval()

      expect(func).to.have.been.called
      expect(result).to.equal('1')

      esprima.parse.restore()
    })

    it('should throw an error if the expression failed to parse', () => {
      var func = sinon.spy(() => '1')
      sinon.stub(esprima, 'parse').throws()

      var expression = new Expression('x')
      var result

      expect(() => {
        result = expression.eval()
      }).to.throw()
      expect(func).to.not.have.been.called
      expect(result).to.not.be.ok

      esprima.parse.restore()
    })
  })
})
