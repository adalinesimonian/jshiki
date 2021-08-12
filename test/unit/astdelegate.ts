import ASTDelegate from '../../src/astdelegate'
import { TokenType } from '../../src/lib/esprima/types'
import operators from '../../src/operators'

describe('AST Delegate', () => {
  it('should export a constructor', () => {
    expect(typeof ASTDelegate).toBe('function')
    expect(typeof ASTDelegate.prototype).toBe('object')
  })

  describe('Constructor', () => {
    it('should create a new instance', () => {
      expect(new ASTDelegate()).toBeInstanceOf(ASTDelegate)
    })

    it('should set scope from options', () => {
      const options = {
        scope: {
          x: '1',
        },
      }
      const delegate = new ASTDelegate(options)

      expect(delegate).toHaveProperty('scope')
      expect(delegate.scope).toBe(options.scope)
      expect(delegate.scope.x).toBe('1')
    })
  })

  describe('createUnaryExpression', () => {
    let spy: jest.SpyInstance<number, [v: any]>

    beforeAll(() => {
      spy = jest.spyOn(operators.unary, '+')
    })

    afterAll(() => {
      spy.mockRestore()
    })

    it('should wrap expressions with unary operators', () => {
      var expression = new ASTDelegate().createUnaryExpression('+', () => 5)
      expect(typeof expression).toBe('function')

      expression()
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(5)
    })

    it('should throw an error for disallowed unary operators', () => {
      expect(() => {
        new ASTDelegate().createUnaryExpression('&&', () => true)
      }).toThrowErrorMatchingSnapshot()
    })
  })

  describe('createBinaryExpression', () => {
    let spy: jest.SpyInstance<any, [l: any, r: any]>

    beforeAll(() => {
      spy = jest.spyOn(operators.binary, '+')
    })

    afterAll(() => {
      spy.mockRestore()
    })

    it('should wrap expressions with binary operators', () => {
      var expression = new ASTDelegate().createBinaryExpression(
        '+',
        () => 5,
        () => 3
      )
      expect(typeof expression).toBe('function')

      expression()

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(5, 3)
    })

    it('should throw an error for disallowed binary operators', () => {
      expect(() => {
        new ASTDelegate().createBinaryExpression(
          '@',
          () => 5,
          () => 3
        )
      }).toThrowErrorMatchingSnapshot()
    })
  })

  describe('createConditionalExpression', () => {
    it('should wrap expressions with conditional operators', () => {
      let expression = new ASTDelegate().createConditionalExpression(
        () => true,
        () => 5,
        () => 3
      )
      expect(typeof expression).toBe('function')
      expect(expression()).toBe(5) // true ? 5 : 3

      expression = new ASTDelegate().createConditionalExpression(
        () => false,
        () => 5,
        () => 3
      )
      expect(typeof expression).toBe('function')
      expect(expression()).toBe(3) // false ? 5 : 3

      expression = new ASTDelegate().createConditionalExpression(
        () => '1',
        () => 5,
        () => 3
      )
      expect(typeof expression).toBe('function')
      expect(expression()).toBe(5) // true ? 5 : 3

      expression = new ASTDelegate().createConditionalExpression(
        () => '',
        () => 5,
        () => 3
      )
      expect(typeof expression).toBe('function')
      expect(expression()).toBe(3) // false ? 5 : 3
    })
  })

  describe('createIdentifier', () => {
    it('should wrap identifiers', () => {
      const identifier = new ASTDelegate({
        scope: {
          identifier: 'value',
        },
      }).createIdentifier('identifier')

      expect(typeof identifier).toBe('function')
      expect(identifier()).toBe('value')
    })

    it('should wrap child identifiers', () => {
      const identifier = new ASTDelegate({
        scope: {
          identifier: 'value',
        },
      }).createIdentifier('identifier')

      expect(typeof identifier).toBe('function')
      expect(identifier({ child: true })).toBe('identifier')
    })
  })

  describe('createMemberExpression', () => {
    it('should wrap expressions accessing an object member', () => {
      const property = jest.fn<string, [options?: { child?: boolean }]>(
        () => 'x'
      )
      const expression = new ASTDelegate().createMemberExpression(
        '.',
        () => ({ x: '1' }),
        property
      )

      expect(typeof expression).toBe('function')
      expect(expression.scope).toEqual({ x: '1' })
      expect(expression()).toBe('1')
      expect(property).toHaveBeenCalledTimes(1)
      expect(property.mock.calls[0][0]).toEqual({ child: true })
    })
  })

  describe('createCallExpression', () => {
    it('should wrap expressions accessing an object member', () => {
      const parent = () =>
        function (this: any, x: number, y: number) {
          return x + y + this.z
        }
      parent.scope = { z: 1 }
      const expression = new ASTDelegate().createCallExpression(parent, [
        () => 5,
        () => 3,
      ])

      expect(typeof expression).toBe('function')
      expect(expression()).toBe(5 + 3 + 1)
    })
  })

  describe('createLiteral', () => {
    it('should wrap literals', () => {
      var literal = new ASTDelegate().createLiteral({
        type: TokenType.StringLiteral,
        value: '1',
        range: [0, 3],
      })

      expect(typeof literal).toBe('function')
      expect(literal()).toBe('1')
    })
  })

  describe('createArrayExpression', () => {
    it('should wrap arrays', () => {
      const array = new ASTDelegate().createArrayExpression([
        () => '1',
        () => '2',
        () => '3',
      ])

      expect(typeof array).toBe('function')
      expect(array()).toEqual(['1', '2', '3'])
    })
  })

  describe('createProperty', () => {
    it('should wrap object properties', () => {
      const key = () => 'x'
      const property = new ASTDelegate().createProperty('init', key, () => '1')

      expect(typeof property).toBe('function')
      expect(property()).toEqual({
        key: 'x',
        value: '1',
      })
    })
  })

  describe('createObjectExpressions', () => {
    it('should wrap object literals', () => {
      const object = new ASTDelegate().createObjectExpression([
        () => ({ key: 'x', value: '1' }),
        () => ({ key: 'y', value: '2' }),
        () => ({ key: 'z', value: '3' }),
      ])

      expect(typeof object).toBe('function')
      expect(object()).toEqual({ x: '1', y: '2', z: '3' })
    })
  })

  describe('createTopLevel', () => {
    it('should return an expression', () => {
      const expression = () => '1'
      const delegate = new ASTDelegate()
      const topLevelExpr = delegate.createTopLevel(expression)

      expect(topLevelExpr).toBe(expression)
      expect(topLevelExpr()).toBe('1')
    })

    it('should not evaluate the expression', () => {
      const expression = jest.fn()
      new ASTDelegate().createTopLevel(expression)
      expect(expression).toHaveBeenCalledTimes(0)
    })
  })

  describe('createThisExpression', () => {
    it('should throw an error', () => {
      expect(() => {
        new ASTDelegate().createThisExpression()
      }).toThrowErrorMatchingSnapshot()
    })
  })
})
