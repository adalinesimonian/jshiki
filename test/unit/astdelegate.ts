import ASTDelegate from '../../src/astdelegate'
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
      const delegate = new ASTDelegate()
      const expression = delegate.createUnaryExpression(
        '+',
        delegate.createLiteral({ value: 5 })
      )
      expect(typeof expression).toBe('function')

      expression()
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(5)
    })

    it('should throw an error for disallowed unary operators', () => {
      expect(() => {
        const delegate = new ASTDelegate()
        delegate.createUnaryExpression(
          '&&',
          delegate.createLiteral({ value: true })
        )
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
      const delegate = new ASTDelegate()
      const expression = delegate.createBinaryExpression(
        '+',
        delegate.createLiteral({ value: 5 }),
        delegate.createLiteral({ value: 3 })
      )
      expect(typeof expression).toBe('function')

      expression()

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(5, 3)
    })

    it('should throw an error for disallowed binary operators', () => {
      expect(() => {
        const delegate = new ASTDelegate()
        delegate.createBinaryExpression(
          '@',
          delegate.createLiteral({ value: 5 }),
          delegate.createLiteral({ value: 3 })
        )
      }).toThrowErrorMatchingSnapshot()
    })
  })

  describe('createConditionalExpression', () => {
    it('should wrap expressions with conditional operators', () => {
      const delegate = new ASTDelegate()
      let expression = delegate.createConditionalExpression(
        delegate.createLiteral({ value: true }),
        delegate.createLiteral({ value: 5 }),
        delegate.createLiteral({ value: 3 })
      )
      expect(typeof expression).toBe('function')
      expect(expression()).toBe(5) // true ? 5 : 3

      expression = delegate.createConditionalExpression(
        delegate.createLiteral({ value: false }),
        delegate.createLiteral({ value: 5 }),
        delegate.createLiteral({ value: 3 })
      )
      expect(typeof expression).toBe('function')
      expect(expression()).toBe(3) // false ? 5 : 3

      expression = delegate.createConditionalExpression(
        delegate.createLiteral({ value: '1' }),
        delegate.createLiteral({ value: 5 }),
        delegate.createLiteral({ value: 3 })
      )
      expect(typeof expression).toBe('function')
      expect(expression()).toBe(5) // true ? 5 : 3

      expression = delegate.createConditionalExpression(
        delegate.createLiteral({ value: '' }),
        delegate.createLiteral({ value: 5 }),
        delegate.createLiteral({ value: 3 })
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
      expect(identifier()).toBe('identifier')
    })
  })

  describe('createMemberExpression', () => {
    it('should wrap expressions accessing an object member', () => {
      const delegate = new ASTDelegate()
      const propIdentifier = delegate.createIdentifier('x')
      const property = Object.assign(jest.fn(propIdentifier), propIdentifier)
      const expression = delegate.createMemberExpression(
        '.',
        delegate.createObjectExpression([
          delegate.createProperty(
            'init',
            delegate.createIdentifier('x'),
            delegate.createLiteral({ value: '1' })
          ),
        ]),
        property
      )

      expect(typeof expression).toBe('function')
      expect(expression.object()).toEqual({ x: '1' })
      expect(expression()).toBe('1')
      expect(property).toHaveBeenCalledTimes(1)
    })
  })

  describe('createCallExpression', () => {
    it('should wrap expressions accessing an object member', () => {
      const delegate = new ASTDelegate({
        scope: {
          func: Object.assign(
            function (this: any, x: number, y: number) {
              return x + y + this.z
            },
            { z: 1 }
          ),
        },
      })
      const func = delegate.createIdentifier('func')
      const expression = delegate.createCallExpression(func, [
        delegate.createLiteral({ value: 5 }),
        delegate.createLiteral({ value: 3 }),
      ])

      expect(typeof expression).toBe('function')
      expect(expression()).toBe(5 + 3 + 1)
    })
  })

  describe('createLiteral', () => {
    it('should wrap literals', () => {
      const literal = new ASTDelegate().createLiteral({ value: '1' })

      expect(typeof literal).toBe('function')
      expect(literal()).toBe('1')
    })
  })

  describe('createArrayExpression', () => {
    it('should wrap arrays', () => {
      const delegate = new ASTDelegate()
      const array = delegate.createArrayExpression([
        delegate.createLiteral({ value: '1' }),
        delegate.createLiteral({ value: '2' }),
        delegate.createLiteral({ value: '3' }),
      ])

      expect(typeof array).toBe('function')
      expect(array()).toEqual(['1', '2', '3'])
    })
  })

  describe('createProperty', () => {
    it('should wrap object properties', () => {
      const delegate = new ASTDelegate()
      const key = delegate.createIdentifier('x')
      const value = delegate.createLiteral({ value: '1' })
      const property = delegate.createProperty('init', key, value)

      expect(typeof property).toBe('function')
      expect(property()).toEqual({
        key: 'x',
        value: '1',
      })
    })
  })

  describe('createObjectExpressions', () => {
    it('should wrap object literals', () => {
      const delegate = new ASTDelegate()
      const object = delegate.createObjectExpression([
        delegate.createProperty(
          'init',
          delegate.createIdentifier('x'),
          delegate.createLiteral({ value: '1' })
        ),
        delegate.createProperty(
          'init',
          delegate.createIdentifier('y'),
          delegate.createLiteral({ value: '2' })
        ),
        delegate.createProperty(
          'init',
          delegate.createIdentifier('z'),
          delegate.createLiteral({ value: '3' })
        ),
      ])

      expect(typeof object).toBe('function')
      expect(object()).toEqual({ x: '1', y: '2', z: '3' })
    })
  })

  describe('createTopLevel', () => {
    it('should return an expression', () => {
      const delegate = new ASTDelegate()
      const expression = delegate.createLiteral({ value: '1' })
      const topLevelExpr = delegate.createTopLevel(expression)

      expect(typeof topLevelExpr).toBe('function')
      expect(topLevelExpr()).toBe('1')
    })

    it('should not evaluate the expression', () => {
      const delegate = new ASTDelegate()
      const literal = delegate.createLiteral({ value: '1' })
      const expression = Object.assign(jest.fn(literal), literal)
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
