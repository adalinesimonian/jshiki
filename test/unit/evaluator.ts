import Evaluator from '../../src/evaluator'
import * as ESTree from 'estree'

describe('Evaluator', () => {
  describe('Parsing', () => {
    it('should create an expression', () => {
      const expr = new Evaluator().createExpression('1 + 2')
      expect(expr).toBeDefined()
      expect(expr()).toBe(3)
    })

    it('should throw an error if the expression is invalid', () => {
      expect(() =>
        new Evaluator().createExpression('1 +')
      ).toThrowErrorMatchingSnapshot()
    })
  })

  describe('Operator options', () => {
    it('should allow all supported operators by default', () => {
      const evaluator = new Evaluator()
      // Unary operators
      expect(evaluator.createExpression('+2')()).toBe(2)
      expect(evaluator.createExpression('-2')()).toBe(-2)
      expect(evaluator.createExpression('!2')()).toBe(false)
      expect(evaluator.createExpression('~2')()).toBe(-3)

      // Binary operators
      expect(evaluator.createExpression('4 + 2')()).toBe(6)
      expect(evaluator.createExpression('4 - 2')()).toBe(2)
      expect(evaluator.createExpression('4 * 2')()).toBe(8)
      expect(evaluator.createExpression('4 ** 2')()).toBe(16)
      expect(evaluator.createExpression('4 / 2')()).toBe(2)
      expect(evaluator.createExpression('4 % 2')()).toBe(0)
      expect(evaluator.createExpression('4 < 2')()).toBe(false)
      expect(evaluator.createExpression('4 > 2')()).toBe(true)
      expect(evaluator.createExpression('4 <= 2')()).toBe(false)
      expect(evaluator.createExpression('4 >= 2')()).toBe(true)
      expect(evaluator.createExpression('4 == 2')()).toBe(false)
      expect(evaluator.createExpression('4 != 2')()).toBe(true)
      expect(evaluator.createExpression('4 === 2')()).toBe(false)
      expect(evaluator.createExpression('4 !== 2')()).toBe(true)
      expect(evaluator.createExpression('4 | 2')()).toBe(6)
      expect(evaluator.createExpression('4 ^ 2')()).toBe(6)
      expect(evaluator.createExpression('4 & 2')()).toBe(0)
      expect(evaluator.createExpression('4 << 2')()).toBe(16)
      expect(evaluator.createExpression('4 >> 2')()).toBe(1)
      expect(evaluator.createExpression('4 >>> 2')()).toBe(1)

      // Logical operators
      expect(evaluator.createExpression('null && true')()).toBe(null)
      expect(evaluator.createExpression('null || true')()).toBe(true)
      expect(evaluator.createExpression('null ?? true')()).toBe(true)

      // Conditional operator
      expect(evaluator.createExpression('false ? 5 : 3')()).toBe(3)
    })

    it('should support allowing only the specified operators', () => {
      const evaluator = new Evaluator({
        operators: {
          unary: { allow: ['+', '-'] },
          binary: { allow: ['%', '**'] },
          logical: { allow: ['&&'] },
          ternary: true,
        },
      })

      // Unary operators
      expect(evaluator.createExpression('+2')()).toBe(2)
      expect(evaluator.createExpression('-2')()).toBe(-2)
      expect(() =>
        evaluator.createExpression('!2')
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('~2')
      ).toThrowErrorMatchingSnapshot()

      // Binary operators
      expect(() =>
        evaluator.createExpression('4 + 2')
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('4 - 2')
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('4 * 2')
      ).toThrowErrorMatchingSnapshot()
      expect(evaluator.createExpression('4 ** 2')()).toBe(16)
      expect(() =>
        evaluator.createExpression('4 / 2')
      ).toThrowErrorMatchingSnapshot()
      expect(evaluator.createExpression('4 % 2')()).toBe(0)
      expect(() =>
        evaluator.createExpression('4 < 2')
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('4 > 2')
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('4 <= 2')
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('4 >= 2')
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('4 == 2')
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('4 != 2')
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('4 === 2')
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('4 !== 2')
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('4 | 2')
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('4 ^ 2')
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('4 & 2')
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('4 << 2')
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('4 >> 2')
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('4 >>> 2')
      ).toThrowErrorMatchingSnapshot()

      // Logical operators
      expect(evaluator.createExpression('null && true')()).toBe(null)
      expect(() =>
        evaluator.createExpression('null || true')
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('null ?? true')
      ).toThrowErrorMatchingSnapshot()

      // Conditional operator
      expect(evaluator.createExpression('false ? 5 : 3')()).toBe(3)
    })

    it('should support blocking specified operators', () => {
      const evaluator = new Evaluator({
        operators: {
          unary: { block: ['+', '-'] },
          binary: { block: ['%', '**'] },
          logical: { block: ['&&'] },
          ternary: false,
        },
      })

      // Unary operators
      expect(() =>
        evaluator.createExpression('+2')
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('-2')
      ).toThrowErrorMatchingSnapshot()
      expect(evaluator.createExpression('!2')()).toBe(false)
      expect(evaluator.createExpression('~2')()).toBe(-3)

      // Binary operators
      expect(evaluator.createExpression('4 + 2')()).toBe(6)
      expect(evaluator.createExpression('4 - 2')()).toBe(2)
      expect(evaluator.createExpression('4 * 2')()).toBe(8)
      expect(() =>
        evaluator.createExpression('4 ** 2')
      ).toThrowErrorMatchingSnapshot()
      expect(evaluator.createExpression('4 / 2')()).toBe(2)
      expect(() =>
        evaluator.createExpression('4 % 2')
      ).toThrowErrorMatchingSnapshot()
      expect(evaluator.createExpression('4 < 2')()).toBe(false)
      expect(evaluator.createExpression('4 > 2')()).toBe(true)
      expect(evaluator.createExpression('4 <= 2')()).toBe(false)
      expect(evaluator.createExpression('4 >= 2')()).toBe(true)
      expect(evaluator.createExpression('4 == 2')()).toBe(false)
      expect(evaluator.createExpression('4 != 2')()).toBe(true)
      expect(evaluator.createExpression('4 === 2')()).toBe(false)
      expect(evaluator.createExpression('4 !== 2')()).toBe(true)
      expect(evaluator.createExpression('4 | 2')()).toBe(6)
      expect(evaluator.createExpression('4 ^ 2')()).toBe(6)
      expect(evaluator.createExpression('4 & 2')()).toBe(0)
      expect(evaluator.createExpression('4 << 2')()).toBe(16)
      expect(evaluator.createExpression('4 >> 2')()).toBe(1)
      expect(evaluator.createExpression('4 >>> 2')()).toBe(1)

      // Logical operators
      expect(() =>
        evaluator.createExpression('null && true')
      ).toThrowErrorMatchingSnapshot()
      expect(evaluator.createExpression('null || true')()).toBe(true)
      expect(evaluator.createExpression('null ?? true')()).toBe(true)

      // Conditional operator
      expect(() =>
        evaluator.createExpression('false ? 5 : 3')
      ).toThrowErrorMatchingSnapshot()
    })

    it('should throw if providing both an allow and block list', () => {
      expect(
        () =>
          new Evaluator({
            operators: {
              unary: { allow: ['+', '-'], block: ['+', '-'] },
            },
          })
      ).toThrowErrorMatchingSnapshot()
      expect(
        () =>
          new Evaluator({
            operators: {
              binary: { allow: ['+', '-'], block: ['+', '-'] },
            },
          })
      ).toThrowErrorMatchingSnapshot()
      expect(
        () =>
          new Evaluator({
            operators: {
              logical: { allow: ['&&', '??'], block: ['&&', '??'] },
            },
          })
      ).toThrowErrorMatchingSnapshot()
    })

    it('should throw if providing an unsupported operator', () => {
      expect(
        () =>
          new Evaluator({
            operators: {
              unary: { allow: ['invalid'] },
            },
          })
      ).toThrowErrorMatchingSnapshot()
      expect(
        () =>
          new Evaluator({
            operators: {
              unary: { block: ['invalid'] },
            },
          })
      ).toThrowErrorMatchingSnapshot()
      expect(
        () =>
          new Evaluator({
            operators: {
              binary: { allow: ['invalid'] },
            },
          })
      ).toThrowErrorMatchingSnapshot()
      expect(
        () =>
          new Evaluator({
            operators: {
              binary: { block: ['invalid'] },
            },
          })
      ).toThrowErrorMatchingSnapshot()
      expect(
        () =>
          new Evaluator({
            operators: {
              logical: { allow: ['invalid'] },
            },
          })
      ).toThrowErrorMatchingSnapshot()
      expect(
        () =>
          new Evaluator({
            operators: {
              logical: { block: ['invalid'] },
            },
          })
      ).toThrowErrorMatchingSnapshot()
    })

    it('should throw if the list is not an array', () => {
      expect(
        () =>
          new Evaluator({
            operators: {
              unary: { allow: 'invalid' as any },
            },
          })
      ).toThrowErrorMatchingSnapshot()
      expect(
        () =>
          new Evaluator({
            operators: {
              unary: { block: 'invalid' as any },
            },
          })
      ).toThrowErrorMatchingSnapshot()
      expect(
        () =>
          new Evaluator({
            operators: {
              binary: { allow: 'invalid' as any },
            },
          })
      ).toThrowErrorMatchingSnapshot()
      expect(
        () =>
          new Evaluator({
            operators: {
              binary: { block: 'invalid' as any },
            },
          })
      ).toThrowErrorMatchingSnapshot()
      expect(
        () =>
          new Evaluator({
            operators: {
              logical: { allow: 'invalid' as any },
            },
          })
      ).toThrowErrorMatchingSnapshot()
      expect(
        () =>
          new Evaluator({
            operators: {
              logical: { block: 'invalid' as any },
            },
          })
      ).toThrowErrorMatchingSnapshot()
    })

    it('should throw if the options do not contain a list', () => {
      expect(
        () =>
          new Evaluator({
            operators: {
              unary: {} as any,
            },
          })
      ).toThrowErrorMatchingSnapshot()
      expect(
        () =>
          new Evaluator({
            operators: {
              unary: {} as any,
            },
          })
      ).toThrowErrorMatchingSnapshot()
      expect(
        () =>
          new Evaluator({
            operators: {
              binary: {} as any,
            },
          })
      ).toThrowErrorMatchingSnapshot()
      expect(
        () =>
          new Evaluator({
            operators: {
              binary: {} as any,
            },
          })
      ).toThrowErrorMatchingSnapshot()
      expect(
        () =>
          new Evaluator({
            operators: {
              logical: {} as any,
            },
          })
      ).toThrowErrorMatchingSnapshot()
      expect(
        () =>
          new Evaluator({
            operators: {
              logical: {} as any,
            },
          })
      ).toThrowErrorMatchingSnapshot()
    })
  })

  describe('Array expressions', () => {
    it('should create an array expression', () => {
      const node: ESTree.ArrayExpression = {
        type: 'ArrayExpression',
        elements: [
          {
            type: 'Literal',
            value: 1,
          },
          null,
          {
            type: 'Literal',
            value: 2,
          },
          {
            type: 'SpreadElement',
            argument: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'Literal',
                  value: 3,
                },
              ],
            },
          },
        ],
      }
      const expr = new Evaluator().createArrayExpression(node)

      expect(typeof expr).toBe('function')
      const result = expr({})
      // eslint-disable-next-line no-sparse-arrays
      expect(result).toEqual([1, , 2, 3])
      const result2: any[] = []
      result.forEach((item: any) => result2.push(item))
      expect(result2).toEqual([1, 2, 3])
    })
  })

  describe('Binary expressions', () => {
    it('should create a binary expression', () => {
      const node: ESTree.BinaryExpression = {
        type: 'BinaryExpression',
        operator: '+',
        left: {
          type: 'Literal',
          value: 1,
        },
        right: {
          type: 'Literal',
          value: 2,
        },
      }
      const expr = new Evaluator().createBinaryExpression(node)

      expect(typeof expr).toBe('function')
      expect(expr({})).toBe(3)
    })

    it('should throw when given an invalid operator', () => {
      const node: ESTree.BinaryExpression = {
        type: 'BinaryExpression',
        operator: 'invalid' as any,
        left: {
          type: 'Literal',
          value: 1,
        },
        right: {
          type: 'Literal',
          value: 2,
        },
      }
      expect(() =>
        new Evaluator().createBinaryExpression(node)
      ).toThrowErrorMatchingSnapshot()
    })
  })

  describe('Call expressions', () => {
    it('should create a call expression', () => {
      const node: ESTree.SimpleCallExpression = {
        type: 'CallExpression',
        optional: false,
        callee: {
          type: 'Identifier',
          name: 'foo',
        },
        arguments: [
          {
            type: 'Literal',
            value: 1,
          },
          {
            type: 'Literal',
            value: 2,
          },
          {
            type: 'SpreadElement',
            argument: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'Literal',
                  value: 3,
                },
                {
                  type: 'Literal',
                  value: 4,
                },
              ],
            },
          },
        ],
      }
      const expr = new Evaluator().createCallExpression(node)

      expect(typeof expr).toBe('function')
      expect(
        expr({
          foo(a: number, b: number, c: number, d: number) {
            return a + b + c + d
          },
        })
      ).toBe(10)
    })
  })

  describe('Chain expressions', () => {
    it('should create a chain expression', () => {
      const node: ESTree.ChainExpression = {
        type: 'ChainExpression',
        expression: {
          type: 'CallExpression',
          optional: true,
          callee: {
            type: 'Identifier',
            name: 'foo',
          },
          arguments: [
            {
              type: 'Literal',
              value: 1,
            },
            {
              type: 'Literal',
              value: 2,
            },
            {
              type: 'SpreadElement',
              argument: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'Literal',
                    value: 3,
                  },
                  {
                    type: 'Literal',
                    value: 4,
                  },
                ],
              },
            },
          ],
        },
      }
      const expr = new Evaluator().createChainExpression(node)
      expect(typeof expr).toBe('function')
      expect(expr({})).toBeUndefined()
      expect(
        expr({
          foo(a: number, b: number, c: number, d: number) {
            return a + b + c + d
          },
        })
      ).toBe(10)
    })
  })

  describe('Conditional expressions', () => {
    it('should create a conditional expression', () => {
      const node: ESTree.ConditionalExpression = {
        type: 'ConditionalExpression',
        test: {
          type: 'Literal',
          value: true,
        },
        consequent: {
          type: 'Literal',
          value: 1,
        },
        alternate: {
          type: 'Literal',
          value: 2,
        },
      }
      const expr = new Evaluator().createConditionalExpression(node)

      expect(typeof expr).toBe('function')
      expect(expr({})).toBe(1)
    })
  })

  describe('Identifiers', () => {
    it('should create an identifier', () => {
      const node: ESTree.Identifier = {
        type: 'Identifier',
        name: 'foo',
      }
      const expr = new Evaluator().createIdentifier(node)
      expect(typeof expr).toBe('function')
      expect(expr({})).toBe('foo')
    })

    it('should evaluate identifiers', () => {
      const node: ESTree.Identifier = {
        type: 'Identifier',
        name: 'foo',
      }
      const expr = new Evaluator().evaluateIfIdentifier(node)
      expect(typeof expr).toBe('function')
      expect(expr({})).toBeUndefined()
      expect(expr({ foo: 1 })).toBe(1)
    })

    it('should evaluate undefined', () => {
      const node: ESTree.Identifier = {
        type: 'Identifier',
        name: 'undefined',
      }
      const expr = new Evaluator().evaluateIfIdentifier(node)
      expect(typeof expr).toBe('function')
      expect(expr({})).toBeUndefined()
      expect(expr({ undefined: 5 })).toBeUndefined()
    })

    it('should evaluate NaN', () => {
      const node: ESTree.Identifier = {
        type: 'Identifier',
        name: 'NaN',
      }
      const expr = new Evaluator().evaluateIfIdentifier(node)
      expect(typeof expr).toBe('function')
      expect(expr({})).toBeNaN()
      expect(expr({ NaN: 5 })).toBeNaN()
    })

    it('should evaluate Infinity', () => {
      const node: ESTree.Identifier = {
        type: 'Identifier',
        name: 'Infinity',
      }
      const expr = new Evaluator().evaluateIfIdentifier(node)
      expect(typeof expr).toBe('function')
      expect(expr({})).toBe(Infinity)
      expect(expr({ Infinity: 5 })).toBe(Infinity)
    })
  })

  describe('Literals', () => {
    it('should create a simple literal', () => {
      const node: ESTree.SimpleLiteral = {
        type: 'Literal',
        value: 1,
      }
      const expr = new Evaluator().createLiteral(node)
      expect(typeof expr).toBe('function')
      expect(expr({})).toBe(1)
    })

    it('should create a regex literal', () => {
      const node: ESTree.RegExpLiteral = {
        type: 'Literal',
        value: /foo/g,
        regex: {
          pattern: 'foo',
          flags: 'g',
        },
      }
      const expr = new Evaluator().createLiteral(node)
      expect(typeof expr).toBe('function')
      expect(expr({})).toEqual(/foo/g)
    })

    it('should create a BigInt literal', () => {
      const node: ESTree.BigIntLiteral = {
        type: 'Literal',
        value: 1n,
        bigint: '1',
      }
      const expr = new Evaluator().createLiteral(node)
      expect(typeof expr).toBe('function')
      expect(expr({})).toBe(1n)
    })
  })

  describe('Logical expressions', () => {
    it('should create a logical expression', () => {
      const node: ESTree.LogicalExpression = {
        type: 'LogicalExpression',
        operator: '&&',
        left: {
          type: 'Literal',
          value: 1,
        },
        right: {
          type: 'Literal',
          value: 0,
        },
      }
      const expr = new Evaluator().createLogicalExpression(node)
      expect(typeof expr).toBe('function')
      expect(expr({})).toBe(0)
    })

    it('should throw when given a logical expression with an invalid operator', () => {
      expect(() =>
        new Evaluator().createLogicalExpression({
          type: 'LogicalExpression',
          operator: 'invalid' as any,
          left: {
            type: 'Identifier',
            name: 'a',
          },
          right: {
            type: 'Identifier',
            name: 'b',
          },
        })
      ).toThrowErrorMatchingSnapshot()
    })
  })

  describe('Member expressions', () => {
    it('should create a member expression', () => {
      const node: ESTree.MemberExpression = {
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: 'foo',
        },
        property: {
          type: 'Identifier',
          name: 'bar',
        },
        computed: false,
        optional: false,
      }
      const expr = new Evaluator().createMemberExpression(node)
      expect(typeof expr).toBe('function')
      expect(expr({ foo: { bar: 1 } })).toBe(1)
    })

    it('should create a computed member expression', () => {
      const node: ESTree.MemberExpression = {
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: 'foo',
        },
        property: {
          type: 'Identifier',
          name: 'bar',
        },
        computed: true,
        optional: false,
      }
      const expr = new Evaluator().createMemberExpression(node)
      expect(typeof expr).toBe('function')
      expect(expr({ foo: { x: 1 }, bar: 'x' })).toBe(1)
    })
  })

  describe('Object expressions', () => {
    it('should create an object expression', () => {
      const node: ESTree.ObjectExpression = {
        type: 'ObjectExpression',
        properties: [
          {
            type: 'Property',
            key: {
              type: 'Identifier',
              name: 'foo',
            },
            value: {
              type: 'Literal',
              value: 1,
            },
            kind: 'init',
            computed: false,
            method: false,
            shorthand: false,
          },
          {
            type: 'Property',
            key: {
              type: 'Identifier',
              name: 'bar',
            },
            value: {
              type: 'Literal',
              value: 2,
            },
            kind: 'init',
            computed: true,
            method: false,
            shorthand: false,
          },
          {
            type: 'SpreadElement',
            argument: {
              type: 'Identifier',
              name: 'baz',
            },
          },
        ],
      }
      const expr = new Evaluator().createObjectExpression(node)
      expect(typeof expr).toBe('function')
      expect(expr({ bar: 'qux', baz: { quux: 3 } })).toEqual({
        foo: 1,
        qux: 2,
        quux: 3,
      })
    })

    it('should throw when given an invalid property type', () => {
      expect(() =>
        new Evaluator().createObjectExpression({
          type: 'ObjectExpression',
          properties: [
            {
              type: 'Identifier',
              name: 'invalid',
            } as any,
          ],
        })
      ).toThrowErrorMatchingSnapshot()
    })
  })

  describe('Tagged template expressions', () => {
    it('should create a tagged template expression', () => {
      const node: ESTree.TaggedTemplateExpression = {
        type: 'TaggedTemplateExpression',
        tag: {
          type: 'Identifier',
          name: 'foo',
        },
        quasi: {
          type: 'TemplateLiteral',
          quasis: [
            {
              type: 'TemplateElement',
              value: {
                raw: '',
                cooked: '',
              },
              tail: false,
            },
            {
              type: 'TemplateElement',
              value: {
                raw: 'bar',
                cooked: 'bar',
              },
              tail: true,
            },
          ],
          expressions: [
            {
              type: 'Literal',
              value: 1,
            },
          ],
        },
      }
      const expr = new Evaluator().createTaggedTemplateExpression(node)
      expect(typeof expr).toBe('function')
      const foo = jest.fn(
        (strings: TemplateStringsArray, expression: number) =>
          `got ${strings.join('')} and ${expression}`
      )
      expect(expr({ foo })).toBe('got bar and 1')
      expect(foo).toHaveBeenCalledWith(
        Object.assign(['', 'bar'], { raw: ['', 'bar'] }),
        1
      )
    })
  })

  describe('Template literals', () => {
    it('should create a template literal', () => {
      const node: ESTree.TemplateLiteral = {
        type: 'TemplateLiteral',
        quasis: [
          {
            type: 'TemplateElement',
            value: {
              raw: 'foo',
              cooked: 'foo',
            },
            tail: false,
          },
          {
            type: 'TemplateElement',
            value: {
              raw: 'bar',
              cooked: 'bar',
            },
            tail: true,
          },
        ],
        expressions: [
          {
            type: 'Literal',
            value: 1,
          },
        ],
      }
      const expr = new Evaluator().createTemplateLiteral(node)
      expect(typeof expr).toBe('function')
      expect(expr({})).toEqual('foo1bar')
    })
  })

  describe('Unary expressions', () => {
    it('should create a unary expression', () => {
      const node: ESTree.UnaryExpression = {
        type: 'UnaryExpression',
        operator: '-',
        argument: {
          type: 'Identifier',
          name: 'foo',
        },
        prefix: true,
      }
      const expr = new Evaluator().createUnaryExpression(node)
      expect(typeof expr).toBe('function')
      expect(expr({ foo: 0 })).toBe(-0)
    })

    it('should throw when given an invalid operator', () => {
      expect(() =>
        new Evaluator().createUnaryExpression({
          type: 'UnaryExpression',
          operator: 'invalid' as any,
          argument: {
            type: 'Identifier',
            name: 'foo',
          },
          prefix: true,
        })
      ).toThrowErrorMatchingSnapshot()
    })
  })
})
