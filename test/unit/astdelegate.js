/* global describe, it, before, after */

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')

chai.use(require('sinon-chai'))

const operators = require('../../operators')
const ASTDelegate = require('../../astdelegate')

describe('AST Delegate', () => {
  it('should export a constructor', () => {
    expect(ASTDelegate).to.be.a('function')
    expect(ASTDelegate.prototype).to.be.an('object')
  })

  describe('Constructor', () => {
    it('should create a new instance', () => {
      expect(new ASTDelegate()).to.be.an.instanceof(ASTDelegate)
    })

    it('should set scope from options', () => {
      var options = {
        scope: {
          x: '1',
        },
      }
      var delegate = new ASTDelegate(options)

      expect(delegate).to.include.keys('scope')
      expect(delegate.scope).to.equal(options.scope)
      expect(delegate.scope.x).to.equal('1')
    })

    it('should not set an expression by default', () => {
      expect(new ASTDelegate().expression).to.not.be.ok
    })
  })

  describe('createUnaryExpression', () => {
    before(() => {
      sinon.spy(operators.unary, '+')
    })

    after(() => {
      operators.unary['+'].restore()
    })

    it('should wrap expressions with unary operators', () => {
      var expression = new ASTDelegate().createUnaryExpression('+', () => 5)
      expect(expression).to.be.a('function')

      expression()
      expect(operators.unary['+']).to.have.been.calledWith(5)
    })

    it('should throw an error for disallowed unary operators', () => {
      expect(() => {
        new ASTDelegate().createUnaryExpression('&&', () => true)
      }).to.throw()
    })
  })

  describe('createBinaryExpression', () => {
    before(() => {
      sinon.spy(operators.binary, '+')
    })

    after(() => {
      operators.binary['+'].restore()
    })

    it('should wrap expressions with binary operators', () => {
      var expression = new ASTDelegate().createBinaryExpression(
        '+',
        () => 5,
        () => 3
      )
      expect(expression).to.be.a('function')

      expression()

      expect(operators.binary['+']).to.have.been.calledWith(5, 3)
    })

    it('should throw an error for disallowed binary operators', () => {
      expect(() => {
        new ASTDelegate().createBinaryExpression(
          '@',
          () => 5,
          () => 3
        )
      }).to.throw()
    })
  })

  describe('createConditionalExpression', () => {
    it('should wrap expressions with conditional operators', () => {
      var expression = new ASTDelegate().createConditionalExpression(
        () => true,
        () => 5,
        () => 3
      )
      expect(expression).to.be.a('function')
      expect(expression()).to.equal(5) // true ? 5 : 3

      expression = new ASTDelegate().createConditionalExpression(
        () => false,
        () => 5,
        () => 3
      )
      expect(expression).to.be.a('function')
      expect(expression()).to.equal(3) // false ? 5 : 3

      expression = new ASTDelegate().createConditionalExpression(
        () => '1',
        () => 5,
        () => 3
      )
      expect(expression).to.be.a('function')
      expect(expression()).to.equal(5) // true ? 5 : 3

      expression = new ASTDelegate().createConditionalExpression(
        () => '',
        () => 5,
        () => 3
      )
      expect(expression).to.be.a('function')
      expect(expression()).to.equal(3) // false ? 5 : 3
    })
  })

  describe('createIdentifier', () => {
    it('should wrap identifiers', () => {
      var identifier = new ASTDelegate({
        scope: {
          identifier: 'value',
        },
      }).createIdentifier('identifier')

      expect(identifier).to.be.a('function')
      expect(identifier()).to.equal('value')
    })

    it('should wrap child identifiers', () => {
      var identifier = new ASTDelegate({
        scope: {
          identifier: 'value',
        },
      }).createIdentifier('identifier')

      expect(identifier).to.be.a('function')
      expect(identifier({ child: true })).to.equal('identifier')
    })
  })

  describe('createMemberExpression', () => {
    it('should wrap expressions accessing an object member', () => {
      var property = sinon.spy(() => 'x')
      var expression = new ASTDelegate().createMemberExpression(
        () => '.',
        () => ({ x: '1' }),
        property
      )

      expect(expression).to.be.a('function')
      expect(expression.scope).to.eql({ x: '1' })
      expect(expression()).to.equal('1')
      expect(property).to.have.been.calledWith({ child: true })
    })
  })

  describe('createCallExpression', () => {
    it('should wrap expressions accessing an object member', () => {
      var parent = () =>
        function (x, y) {
          return x + y + this.z
        }
      parent.scope = { z: 1 }
      var expression = new ASTDelegate().createCallExpression(parent, [
        () => 5,
        () => 3,
      ])

      expect(expression).to.be.a('function')
      expect(expression()).to.equal(5 + 3 + 1)
    })
  })

  describe('createLiteral', () => {
    it('should wrap literals', () => {
      var literal = new ASTDelegate().createLiteral({ value: '1' })

      expect(literal).to.be.a('function')
      expect(literal()).to.equal('1')
    })
  })

  describe('createArrayExpression', () => {
    it('should wrap arrays', () => {
      var array = new ASTDelegate().createArrayExpression([
        () => '1',
        () => '2',
        () => '3',
      ])

      expect(array).to.be.a('function')
      expect(array()).to.eql(['1', '2', '3'])
    })
  })

  describe('createProperty', () => {
    it('should wrap object properties', () => {
      var key = sinon.spy(() => 'x')
      var property = new ASTDelegate().createProperty(null, key, () => '1')
      expect(property).to.be.a('function')
      expect(property()).to.eql({
        key: 'x',
        value: '1',
      })
    })
  })

  describe('createObjectExpressions', () => {
    it('should wrap object literals', () => {
      var object = new ASTDelegate().createObjectExpression([
        () => ({ key: 'x', value: '1' }),
        () => ({ key: 'y', value: '2' }),
        () => ({ key: 'z', value: '3' }),
      ])

      expect(object).to.be.a('function')
      expect(object()).to.eql({ x: '1', y: '2', z: '3' })
    })
  })

  describe('createFilter', () => {
    it('should throw an error', () => {
      expect(() => {
        new ASTDelegate().createFilter('filter', [() => '1', () => '2'])
      }).to.throw()
    })
  })

  describe('createAsExpression', () => {
    it('should set the expression and scope identifier', () => {
      var expression = () => '1'
      var scopeIdentifier = () => ({ x: '1' })
      var delegate = new ASTDelegate()
      delegate.createAsExpression(expression, scopeIdentifier)

      expect(delegate.expression).to.equal(expression)
      expect(delegate.expression()).to.equal('1')
      expect(delegate.scopeIdentifier).to.equal(scopeIdentifier)
      expect(delegate.scopeIdentifier()).to.eql({ x: '1' })
    })

    it('should not evaluate the expression', () => {
      var expression = sinon.spy(() => {})
      new ASTDelegate().createAsExpression(expression, {})
      expect(expression).to.not.have.been.called
    })
  })

  describe('createInExpression', () => {
    it('should set the expression and scope and index identifiers', () => {
      var expression = () => 'x'
      var indexIdentifier = () => 1
      var scopeIdentifier = () => ['1', '2', '3']
      var delegate = new ASTDelegate()
      delegate.createInExpression(scopeIdentifier, indexIdentifier, expression)

      expect(delegate.expression).to.equal(expression)
      expect(delegate.expression()).to.equal('x')
      expect(delegate.indexIdentifier).to.equal(indexIdentifier)
      expect(delegate.indexIdentifier()).to.equal(1)
      expect(delegate.scopeIdentifier).to.equal(scopeIdentifier)
      expect(delegate.scopeIdentifier()).to.eql(['1', '2', '3'])
    })

    it('should not evaluate the expression', () => {
      var expression = sinon.spy(() => {})
      new ASTDelegate().createAsExpression(expression, {})
      expect(expression).to.not.have.been.called
    })
  })

  describe('createTopLevel', () => {
    it('should set the expression', () => {
      var expression = () => '1'
      var delegate = new ASTDelegate()
      delegate.createTopLevel(expression)

      expect(delegate.expression).to.equal(expression)
      expect(delegate.expression()).to.equal('1')
    })

    it('should not evaluate the expression', () => {
      var expression = sinon.spy(() => {})
      new ASTDelegate().createAsExpression(expression, {})
      expect(expression).to.not.have.been.called
    })
  })

  describe('createThisExpression', () => {
    it('should throw an error', () => {
      expect(() => {
        new ASTDelegate().createThisExpression(() => {})
      }).to.throw()
    })
  })
})
