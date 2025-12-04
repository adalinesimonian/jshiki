import { describe, it, expect, vi } from 'vitest'
import Evaluator from '../../src/evaluator.js'
import * as ESTree from 'estree'

describe('Evaluator', () => {
  describe('Parsing', () => {
    it('should create an expression', () => {
      const expr = new Evaluator().createExpression('1 + 2')
      expect(expr).toBeDefined()
      expect(expr()).toBe(3)
    })

    it('should create an async expression', async () => {
      const expr1 = new Evaluator().createExpression('1 + 2', true)
      expect(expr1).toBeDefined()
      expect(await expr1()).toBe(3)
      const expr2 = new Evaluator().createExpression('y(await x())', true)
      expect(expr2).toBeDefined()
      expect(
        await expr2({ x: async () => 5, y: async (x: any) => typeof x }),
      ).toBe('number')
      const expr3 = new Evaluator().createExpression('y(x())', true)
      expect(expr3).toBeDefined()
      expect(
        await expr3({ x: async () => 5, y: async (x: any) => typeof x }),
      ).toBe('object')
    })

    it('should throw an error if the expression is invalid', () => {
      expect(() =>
        new Evaluator().createExpression('1 +'),
      ).toThrowErrorMatchingSnapshot()
    })

    it('should throw an error if the expression is unsupported', () => {
      expect(() =>
        new Evaluator().createExpression('("x", 5)'),
      ).toThrowErrorMatchingSnapshot()
    })
  })

  describe('Operator options', () => {
    it('should allow all supported operators except typeof, in, and instanceof by default', () => {
      const evaluator = new Evaluator()
      // Unary operators
      expect(evaluator.createExpression('+2')()).toBe(2)
      expect(evaluator.createExpression('-2')()).toBe(-2)
      expect(evaluator.createExpression('!2')()).toBe(false)
      expect(evaluator.createExpression('~2')()).toBe(-3)
      expect(() =>
        evaluator.createExpression('typeof 2')(),
      ).toThrowErrorMatchingSnapshot()

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
      expect(() =>
        evaluator.createExpression('"x" in {x: 5}')(),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('{} instanceof Object')({ Object }),
      ).toThrowErrorMatchingSnapshot()

      // Logical operators
      expect(evaluator.createExpression('null && true')()).toBe(null)
      expect(evaluator.createExpression('null || true')()).toBe(true)
      expect(evaluator.createExpression('null ?? true')()).toBe(true)

      // Conditional operator
      expect(evaluator.createExpression('false ? 5 : 3')()).toBe(3)
    })

    it('should support overriding default options with null', () => {
      const evaluator = new Evaluator({
        operators: {
          unary: null,
          binary: null,
          logical: null,
        },
      })
      // Unary operators
      expect(evaluator.createExpression('+2')()).toBe(2)
      expect(evaluator.createExpression('-2')()).toBe(-2)
      expect(evaluator.createExpression('!2')()).toBe(false)
      expect(evaluator.createExpression('~2')()).toBe(-3)
      expect(evaluator.createExpression('typeof 2')()).toBe('number')

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
      expect(evaluator.createExpression('"x" in {x: 5}')()).toBe(true)
      expect(
        evaluator.createExpression('{} instanceof Object')({ Object }),
      ).toBe(true)

      // Logical operators
      expect(evaluator.createExpression('null && true')()).toBe(null)
      expect(evaluator.createExpression('null || true')()).toBe(true)
      expect(evaluator.createExpression('null ?? true')()).toBe(true)
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
        evaluator.createExpression('!2'),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('~2'),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('typeof 2'),
      ).toThrowErrorMatchingSnapshot()

      // Binary operators
      expect(() =>
        evaluator.createExpression('4 + 2'),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('4 - 2'),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('4 * 2'),
      ).toThrowErrorMatchingSnapshot()
      expect(evaluator.createExpression('4 ** 2')()).toBe(16)
      expect(() =>
        evaluator.createExpression('4 / 2'),
      ).toThrowErrorMatchingSnapshot()
      expect(evaluator.createExpression('4 % 2')()).toBe(0)
      expect(() =>
        evaluator.createExpression('4 < 2'),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('4 > 2'),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('4 <= 2'),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('4 >= 2'),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('4 == 2'),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('4 != 2'),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('4 === 2'),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('4 !== 2'),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('4 | 2'),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('4 ^ 2'),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('4 & 2'),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('4 << 2'),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('4 >> 2'),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('4 >>> 2'),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('"x" in {x: 5}')(),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('{} instanceof Object')({ Object }),
      ).toThrowErrorMatchingSnapshot()

      // Logical operators
      expect(evaluator.createExpression('null && true')()).toBe(null)
      expect(() =>
        evaluator.createExpression('null || true'),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('null ?? true'),
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
        evaluator.createExpression('+2'),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('-2'),
      ).toThrowErrorMatchingSnapshot()
      expect(evaluator.createExpression('!2')()).toBe(false)
      expect(evaluator.createExpression('~2')()).toBe(-3)
      expect(evaluator.createExpression('typeof 2')()).toBe('number')

      // Binary operators
      expect(evaluator.createExpression('4 + 2')()).toBe(6)
      expect(evaluator.createExpression('4 - 2')()).toBe(2)
      expect(evaluator.createExpression('4 * 2')()).toBe(8)
      expect(() =>
        evaluator.createExpression('4 ** 2'),
      ).toThrowErrorMatchingSnapshot()
      expect(evaluator.createExpression('4 / 2')()).toBe(2)
      expect(() =>
        evaluator.createExpression('4 % 2'),
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
      expect(evaluator.createExpression('"x" in {x: 5}')()).toBe(true)
      expect(
        evaluator.createExpression('{} instanceof Object')({ Object }),
      ).toBe(true)

      // Logical operators
      expect(() =>
        evaluator.createExpression('null && true'),
      ).toThrowErrorMatchingSnapshot()
      expect(evaluator.createExpression('null || true')()).toBe(true)
      expect(evaluator.createExpression('null ?? true')()).toBe(true)

      // Conditional operator
      expect(() =>
        evaluator.createExpression('false ? 5 : 3'),
      ).toThrowErrorMatchingSnapshot()
    })

    it('should throw if providing both an allow and block list', () => {
      expect(
        () =>
          new Evaluator({
            operators: {
              unary: { allow: ['+', '-'], block: ['+', '-'] },
            },
          }),
      ).toThrowErrorMatchingSnapshot()
      expect(
        () =>
          new Evaluator({
            operators: {
              binary: { allow: ['+', '-'], block: ['+', '-'] },
            },
          }),
      ).toThrowErrorMatchingSnapshot()
      expect(
        () =>
          new Evaluator({
            operators: {
              logical: { allow: ['&&', '??'], block: ['&&', '??'] },
            },
          }),
      ).toThrowErrorMatchingSnapshot()
    })

    it('should throw if providing an unsupported operator', () => {
      expect(
        () =>
          new Evaluator({
            operators: {
              unary: { allow: ['invalid'] },
            },
          }),
      ).toThrowErrorMatchingSnapshot()
      expect(
        () =>
          new Evaluator({
            operators: {
              unary: { block: ['invalid'] },
            },
          }),
      ).toThrowErrorMatchingSnapshot()
      expect(
        () =>
          new Evaluator({
            operators: {
              binary: { allow: ['invalid'] },
            },
          }),
      ).toThrowErrorMatchingSnapshot()
      expect(
        () =>
          new Evaluator({
            operators: {
              binary: { block: ['invalid'] },
            },
          }),
      ).toThrowErrorMatchingSnapshot()
      expect(
        () =>
          new Evaluator({
            operators: {
              logical: { allow: ['invalid'] },
            },
          }),
      ).toThrowErrorMatchingSnapshot()
      expect(
        () =>
          new Evaluator({
            operators: {
              logical: { block: ['invalid'] },
            },
          }),
      ).toThrowErrorMatchingSnapshot()
    })

    it('should throw if the list is not an array', () => {
      expect(
        () =>
          new Evaluator({
            operators: {
              unary: { allow: 'invalid' as any },
            },
          }),
      ).toThrowErrorMatchingSnapshot()
      expect(
        () =>
          new Evaluator({
            operators: {
              unary: { block: 'invalid' as any },
            },
          }),
      ).toThrowErrorMatchingSnapshot()
      expect(
        () =>
          new Evaluator({
            operators: {
              binary: { allow: 'invalid' as any },
            },
          }),
      ).toThrowErrorMatchingSnapshot()
      expect(
        () =>
          new Evaluator({
            operators: {
              binary: { block: 'invalid' as any },
            },
          }),
      ).toThrowErrorMatchingSnapshot()
      expect(
        () =>
          new Evaluator({
            operators: {
              logical: { allow: 'invalid' as any },
            },
          }),
      ).toThrowErrorMatchingSnapshot()
      expect(
        () =>
          new Evaluator({
            operators: {
              logical: { block: 'invalid' as any },
            },
          }),
      ).toThrowErrorMatchingSnapshot()
    })

    it('should throw if the options do not contain a list', () => {
      expect(
        () =>
          new Evaluator({
            operators: {
              unary: {} as any,
            },
          }),
      ).toThrowErrorMatchingSnapshot()
      expect(
        () =>
          new Evaluator({
            operators: {
              unary: {} as any,
            },
          }),
      ).toThrowErrorMatchingSnapshot()
      expect(
        () =>
          new Evaluator({
            operators: {
              binary: {} as any,
            },
          }),
      ).toThrowErrorMatchingSnapshot()
      expect(
        () =>
          new Evaluator({
            operators: {
              binary: {} as any,
            },
          }),
      ).toThrowErrorMatchingSnapshot()
      expect(
        () =>
          new Evaluator({
            operators: {
              logical: {} as any,
            },
          }),
      ).toThrowErrorMatchingSnapshot()
      expect(
        () =>
          new Evaluator({
            operators: {
              logical: {} as any,
            },
          }),
      ).toThrowErrorMatchingSnapshot()
    })
  })

  describe('Syntax options', () => {
    it('should allow all supported syntax by default', () => {
      const evaluator = new Evaluator()

      expect(evaluator.createExpression('a.b.c')({ a: { b: { c: 1 } } })).toBe(
        1,
      )
      expect(
        evaluator.createExpression('a?.b?.c')({ a: { b: { c: 1 } } }),
      ).toBe(1)
      expect(
        evaluator.createExpression('a["b"]["c"]')({ a: { b: { c: 1 } } }),
      ).toBe(1)
      expect(
        evaluator.createExpression('a?.["b"]?.["c"]')({ a: { b: { c: 1 } } }),
      ).toBe(1)
      expect(evaluator.createExpression('a()')({ a: () => 1 })).toBe(1)
      expect(evaluator.createExpression('a?.()')({ a: () => 1 })).toBe(1)
      expect(
        evaluator.createExpression('tag`a${b}`')({
          b: 1,
          tag: (strings: TemplateStringsArray, expression: number) =>
            `got ${strings.join('')} and ${expression}`,
        }),
      ).toBe('got a and 1')

      expect(evaluator.createExpression('`a ${b}`')({ b: 1 })).toBe('a 1')
      expect(evaluator.createExpression('{ a: 1 }')()).toEqual({ a: 1 })
      // eslint-disable-next-line no-sparse-arrays
      expect(evaluator.createExpression('[1, , 3]')()).toEqual([1, , 3])
      expect(evaluator.createExpression('/x/g')()).toEqual(/x/g)
    })

    it('should allow syntax when corresponding option is set to true', () => {
      const evaluator = new Evaluator({
        syntax: {
          memberAccess: true,
          calls: true,
          taggedTemplates: true,
          templates: true,
          objects: true,
          arrays: true,
          regexes: true,
        },
      })

      expect(evaluator.createExpression('a.b.c')({ a: { b: { c: 1 } } })).toBe(
        1,
      )
      expect(
        evaluator.createExpression('a?.b?.c')({ a: { b: { c: 1 } } }),
      ).toBe(1)
      expect(
        evaluator.createExpression('a["b"]["c"]')({ a: { b: { c: 1 } } }),
      ).toBe(1)
      expect(
        evaluator.createExpression('a?.["b"]?.["c"]')({ a: { b: { c: 1 } } }),
      ).toBe(1)
      expect(evaluator.createExpression('a()')({ a: () => 1 })).toBe(1)
      expect(evaluator.createExpression('a?.()')({ a: () => 1 })).toBe(1)
      expect(
        evaluator.createExpression('tag`a${b}`')({
          b: 1,
          tag: (strings: TemplateStringsArray, expression: number) =>
            `got ${strings.join('')} and ${expression}`,
        }),
      ).toBe('got a and 1')

      expect(evaluator.createExpression('`a ${b}`')({ b: 1 })).toBe('a 1')
      expect(evaluator.createExpression('{ a: 1 }')()).toEqual({ a: 1 })
      // eslint-disable-next-line no-sparse-arrays
      expect(evaluator.createExpression('[1, , 3]')()).toEqual([1, , 3])
      expect(evaluator.createExpression('/x/g')()).toEqual(/x/g)
    })

    it('should block syntax when corresponding option is set to false', () => {
      const evaluator = new Evaluator({
        syntax: {
          memberAccess: false,
          calls: false,
          taggedTemplates: false,
          templates: false,
          objects: false,
          arrays: false,
          regexes: false,
        },
      })

      expect(() =>
        evaluator.createExpression('a.b.c'),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('a?.b?.c'),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('a["b"]["c"]'),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('a?.["b"]?.["c"]'),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('a()'),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('a?.()'),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('tag`a${b}`'),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('`a ${b}`'),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('{ a: 1 }'),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('[1, , 3]'),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluator.createExpression('/x/g'),
      ).toThrowErrorMatchingSnapshot()
    })
  })

  describe('Expression creation', () => {
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
        const expr = new Evaluator().createArrayExpression(node, false)

        expect(typeof expr).toBe('function')
        const result: any = expr({})
        // eslint-disable-next-line no-sparse-arrays
        expect(result).toEqual([1, , 2, 3])
        const result2: any[] = []
        result.forEach((item: any) => result2.push(item))
        expect(result2).toEqual([1, 2, 3])
      })
      it('should create an async array expression', async () => {
        const node: ESTree.ArrayExpression = {
          type: 'ArrayExpression',
          elements: [
            {
              type: 'Literal',
              value: 1,
            },
            null,
            {
              type: 'AwaitExpression',
              argument: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'foo',
                },
                arguments: [],
                optional: false,
              },
            },
            {
              type: 'SpreadElement',
              argument: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'AwaitExpression',
                    argument: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'bar',
                      },
                      arguments: [],
                      optional: false,
                    },
                  },
                ],
              },
            },
          ],
        }
        const expr = new Evaluator().createArrayExpression(node, true)

        expect(typeof expr).toBe('function')
        const result = await expr({ foo: async () => 2, bar: async () => 3 })
        // eslint-disable-next-line no-sparse-arrays
        expect(result).toEqual({ value: [1, , 2, 3] })
        const result2: any[] = []
        ;(result.value as any[]).forEach((item: any) => result2.push(item))
        expect(result2).toEqual([1, 2, 3])
      })
    })

    describe('Await expressions', () => {
      it('should create an await expression', async () => {
        const node: ESTree.AwaitExpression = {
          type: 'AwaitExpression',
          argument: {
            type: 'CallExpression',
            callee: {
              type: 'Identifier',
              name: 'foo',
            },
            arguments: [],
            optional: false,
          },
        }
        const expr = new Evaluator().createAwaitExpression(node, true)

        expect(typeof expr).toBe('function')
        const result = await expr({ foo: async () => 2 })
        expect(result).toEqual({ value: 2 })
      })

      it('should throw if async is false', () => {
        const node: ESTree.AwaitExpression = {
          type: 'AwaitExpression',
          argument: {
            type: 'CallExpression',
            callee: {
              type: 'Identifier',
              name: 'foo',
            },
            arguments: [],
            optional: false,
          },
        }
        expect(() =>
          new Evaluator().createAwaitExpression(node, false),
        ).toThrowErrorMatchingSnapshot()
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
        const expr = new Evaluator().createBinaryExpression(node, false)

        expect(typeof expr).toBe('function')
        expect(expr({})).toBe(3)
      })

      it('should create an async binary expression', async () => {
        const node: ESTree.BinaryExpression = {
          type: 'BinaryExpression',
          operator: '+',
          left: {
            type: 'Literal',
            value: 1,
          },
          right: {
            type: 'AwaitExpression',
            argument: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'func',
              },
              arguments: [],
              optional: false,
            },
          },
        }
        const expr = new Evaluator().createBinaryExpression(node, true)

        expect(typeof expr).toBe('function')
        expect(await expr({ func: async () => 2 })).toEqual({ value: 3 })
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
          new Evaluator().createBinaryExpression(node, false),
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
        const expr = new Evaluator().createCallExpression(node, false)

        expect(typeof expr).toBe('function')
        expect(
          expr({
            foo(a: number, b: number, c: number, d: number) {
              return a + b + c + d
            },
          }),
        ).toBe(10)
      })

      it('should create an async call expression', async () => {
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
              type: 'AwaitExpression',
              argument: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'bar',
                },
                arguments: [],
                optional: false,
              },
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
        const expr = new Evaluator().createCallExpression(node, true)

        expect(typeof expr).toBe('function')
        expect(
          await expr({
            foo(a: number, b: number, c: number, d: number) {
              return a + b + c + d
            },
            bar: async () => 2,
          }),
        ).toEqual({ value: 10 })
      })

      it('should create an optional call expression', () => {
        const node: ESTree.CallExpression = {
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
        }
        const expr = new Evaluator().createCallExpression(node, false)

        expect(typeof expr).toBe('function')
        expect(
          expr({
            foo(a: number, b: number, c: number, d: number) {
              return a + b + c + d
            },
          }),
        ).toBe(10)
        expect(expr({})).toBe(undefined)
      })

      it('should create an async optional call expression', async () => {
        const node: ESTree.CallExpression = {
          type: 'CallExpression',
          optional: true,
          callee: {
            type: 'Identifier',
            name: 'foo',
          },
          arguments: [
            {
              type: 'AwaitExpression',
              argument: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'bar',
                },
                arguments: [],
                optional: false,
              },
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
        const expr = new Evaluator().createCallExpression(node, true)

        expect(typeof expr).toBe('function')
        expect(
          await expr({
            foo(a: number, b: number, c: number, d: number) {
              return a + b + c + d
            },
            bar: async () => 1,
          }),
        ).toEqual({ value: 10 })
        expect(await expr({ bar: async () => 1 })).toEqual({ value: undefined })
      })

      it('should create a call expression with a member expression callee', () => {
        const node: ESTree.CallExpression = {
          type: 'CallExpression',
          callee: {
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
          },
          optional: false,
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
        const expr = new Evaluator().createCallExpression(node, false)

        expect(typeof expr).toBe('function')
        expect(
          expr({
            foo: {
              bar(a: number, b: number, c: number, d: number) {
                return a + b + c + d
              },
            },
          }),
        ).toBe(10)
      })

      it('should create an async call expression with a member expression callee', async () => {
        const node: ESTree.CallExpression = {
          type: 'CallExpression',
          callee: {
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
          },
          optional: false,
          arguments: [
            {
              type: 'AwaitExpression',
              argument: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'baz',
                },
                arguments: [],
                optional: false,
              },
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
        const expr = new Evaluator().createCallExpression(node, true)

        expect(typeof expr).toBe('function')
        expect(
          await expr({
            foo: {
              bar(a: number, b: number, c: number, d: number) {
                return a + b + c + d
              },
            },
            baz: async () => 1,
          }),
        ).toEqual({ value: 10 })
      })

      it('should create a call expression with a member expression callee with a computed property', () => {
        const node: ESTree.CallExpression = {
          type: 'CallExpression',
          callee: {
            type: 'MemberExpression',
            object: {
              type: 'Identifier',
              name: 'foo',
            },
            property: {
              type: 'Literal',
              value: 'bar',
            },
            computed: true,
            optional: false,
          },
          optional: false,
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
        const expr = new Evaluator().createCallExpression(node, false)

        expect(typeof expr).toBe('function')
        expect(
          expr({
            foo: {
              bar(a: number, b: number, c: number, d: number) {
                return a + b + c + d
              },
            },
          }),
        ).toBe(10)
      })

      it('should create an async call expression with a member expression callee with a computed property', async () => {
        const node: ESTree.CallExpression = {
          type: 'CallExpression',
          callee: {
            type: 'MemberExpression',
            object: {
              type: 'Identifier',
              name: 'foo',
            },
            property: {
              type: 'AwaitExpression',
              argument: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'baz',
                },
                arguments: [],
                optional: false,
              },
            },
            computed: true,
            optional: false,
          },
          optional: false,
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
        const expr = new Evaluator().createCallExpression(node, true)

        expect(typeof expr).toBe('function')
        expect(
          await expr({
            foo: {
              bar(a: number, b: number, c: number, d: number) {
                return a + b + c + d
              },
            },
            baz: async () => 'bar',
          }),
        ).toEqual({ value: 10 })
      })

      it('should create a call expression with an optional member expression callee', () => {
        const node: ESTree.CallExpression = {
          type: 'CallExpression',
          callee: {
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
            optional: true,
          },
          optional: false,
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
        const expr = new Evaluator().createCallExpression(node, false)

        expect(typeof expr).toBe('function')
        expect(
          expr({
            foo: {
              bar(a: number, b: number, c: number, d: number) {
                return a + b + c + d
              },
            },
          }),
        ).toBe(10)
        expect(expr({})).toBeUndefined()
      })

      it('should create an async call expression with an optional member expression callee', async () => {
        const node: ESTree.CallExpression = {
          type: 'CallExpression',
          callee: {
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
            optional: true,
          },
          optional: false,
          arguments: [
            {
              type: 'AwaitExpression',
              argument: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'baz',
                },
                arguments: [],
                optional: false,
              },
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
        const expr = new Evaluator().createCallExpression(node, true)

        expect(typeof expr).toBe('function')
        expect(
          await expr({
            foo: {
              bar(a: number, b: number, c: number, d: number) {
                return a + b + c + d
              },
            },
            baz: async () => 1,
          }),
        ).toEqual({ value: 10 })
        expect(await expr({ baz: async () => 1 })).toEqual({ value: undefined })
      })

      it('should create an optional call expression with a member expression callee', () => {
        const node: ESTree.CallExpression = {
          type: 'CallExpression',
          callee: {
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
          },
          optional: true,
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
        const expr = new Evaluator().createCallExpression(node, false)

        expect(typeof expr).toBe('function')
        expect(
          expr({
            foo: {
              bar(a: number, b: number, c: number, d: number) {
                return a + b + c + d
              },
            },
          }),
        ).toBe(10)
        expect(expr({ foo: {} })).toBeUndefined()
      })

      it('should create an async optional call expression with a member expression callee', async () => {
        const node: ESTree.CallExpression = {
          type: 'CallExpression',
          callee: {
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
          },
          optional: true,
          arguments: [
            {
              type: 'AwaitExpression',
              argument: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'baz',
                },
                arguments: [],
                optional: false,
              },
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
        const expr = new Evaluator().createCallExpression(node, true)

        expect(typeof expr).toBe('function')
        expect(
          await expr({
            foo: {
              bar(a: number, b: number, c: number, d: number) {
                return a + b + c + d
              },
            },
            baz: async () => 1,
          }),
        ).toEqual({ value: 10 })
        expect(
          await expr({
            foo: {},
            baz: async () => 1,
          }),
        ).toEqual({ value: undefined })
      })

      it('should create an optional call expression with an optional member expression callee', () => {
        const node: ESTree.CallExpression = {
          type: 'CallExpression',
          callee: {
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
            optional: true,
          },
          optional: true,
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
        const expr = new Evaluator().createCallExpression(node, false)

        expect(typeof expr).toBe('function')
        expect(
          expr({
            foo: {
              bar(a: number, b: number, c: number, d: number) {
                return a + b + c + d
              },
            },
          }),
        ).toBe(10)
        expect(
          expr({
            foo: {},
          }),
        ).toBe(undefined)
        expect(expr({})).toBe(undefined)
      })

      it('should create an async optional call expression with an optional member expression callee', async () => {
        const node: ESTree.CallExpression = {
          type: 'CallExpression',
          callee: {
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
            optional: true,
          },
          optional: true,
          arguments: [
            {
              type: 'AwaitExpression',
              argument: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'baz',
                },
                arguments: [],
                optional: false,
              },
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
        const expr = new Evaluator().createCallExpression(node, true)

        expect(typeof expr).toBe('function')
        expect(
          await expr({
            foo: {
              bar(a: number, b: number, c: number, d: number) {
                return a + b + c + d
              },
            },
            baz: async () => 1,
          }),
        ).toEqual({ value: 10 })
        expect(
          await expr({
            foo: {},
            baz: async () => 1,
          }),
        ).toEqual({ value: undefined })
        expect(
          await expr({
            baz: async () => 1,
          }),
        ).toEqual({ value: undefined })
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
        const expr = new Evaluator().createChainExpression(node, false)
        expect(typeof expr).toBe('function')
        expect(expr({})).toBeUndefined()
        expect(
          expr({
            foo(a: number, b: number, c: number, d: number) {
              return a + b + c + d
            },
          }),
        ).toBe(10)
      })

      it('should create an async chain expression', async () => {
        const node: ESTree.ChainExpression = {
          type: 'ChainExpression',
          expression: {
            type: 'CallExpression',
            optional: true,
            callee: {
              type: 'AwaitExpression',
              argument: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'foo',
                },
                arguments: [],
                optional: false,
              },
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
        const expr = new Evaluator().createChainExpression(node, true)
        expect(typeof expr).toBe('function')
        expect(await expr({ foo: async () => undefined })).toEqual({
          value: undefined,
        })
        expect(
          await expr({
            foo: async () => (a: number, b: number, c: number, d: number) => {
              return a + b + c + d
            },
          }),
        ).toEqual({ value: 10 })
      })
    })

    describe('Conditional expressions', () => {
      it('should create a conditional expression', () => {
        const node: ESTree.ConditionalExpression = {
          type: 'ConditionalExpression',
          test: {
            type: 'Identifier',
            name: 'foo',
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
        const expr = new Evaluator().createConditionalExpression(node, false)

        expect(typeof expr).toBe('function')
        expect(expr({ foo: true })).toBe(1)
        expect(expr({ foo: false })).toBe(2)
      })

      it('should create an async conditional expression', async () => {
        const node: ESTree.ConditionalExpression = {
          type: 'ConditionalExpression',
          test: {
            type: 'AwaitExpression',
            argument: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'foo',
              },
              arguments: [],
              optional: false,
            },
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
        const expr = new Evaluator().createConditionalExpression(node, true)

        expect(typeof expr).toBe('function')
        expect(await expr({ foo: async () => true })).toEqual({ value: 1 })
        expect(await expr({ foo: async () => false })).toEqual({ value: 2 })
      })
    })

    describe('Identifiers', () => {
      it('should create an identifier', () => {
        const node: ESTree.Identifier = {
          type: 'Identifier',
          name: 'foo',
        }
        const expr = new Evaluator().createIdentifier(node, false)
        expect(typeof expr).toBe('function')
        expect(expr({})).toBe('foo')
      })

      it('should create an identifier with async set to true', async () => {
        const node: ESTree.Identifier = {
          type: 'Identifier',
          name: 'foo',
        }
        const expr = new Evaluator().createIdentifier(node, true)
        expect(typeof expr).toBe('function')
        expect(await expr({})).toEqual({ value: 'foo' })
      })

      it('should evaluate identifiers', () => {
        const node: ESTree.Identifier = {
          type: 'Identifier',
          name: 'foo',
        }
        const expr = new Evaluator().evaluateIfIdentifier(node, false)
        expect(typeof expr).toBe('function')
        expect(expr({})).toBeUndefined()
        expect(expr({ foo: 1 })).toBe(1)
      })

      it('should evaluate identifiers with async set to true', async () => {
        const node: ESTree.Identifier = {
          type: 'Identifier',
          name: 'foo',
        }
        const expr = new Evaluator().evaluateIfIdentifier(node, true)
        expect(typeof expr).toBe('function')
        expect(await expr({})).toEqual({ value: undefined })
        expect(await expr({ foo: 1 })).toEqual({ value: 1 })
      })

      it('should evaluate undefined', () => {
        const node: ESTree.Identifier = {
          type: 'Identifier',
          name: 'undefined',
        }
        const expr = new Evaluator().evaluateIfIdentifier(node, false)
        expect(typeof expr).toBe('function')
        expect(expr({})).toBeUndefined()
        expect(expr({ undefined: 5 })).toBeUndefined()
      })

      it('should evaluate undefined asynchronously', async () => {
        const node: ESTree.Identifier = {
          type: 'Identifier',
          name: 'undefined',
        }
        const expr = new Evaluator().evaluateIfIdentifier(node, true)
        expect(typeof expr).toBe('function')
        expect(await expr({})).toEqual({ value: undefined })
        expect(await expr({ undefined: 5 })).toEqual({ value: undefined })
      })

      it('should evaluate NaN', () => {
        const node: ESTree.Identifier = {
          type: 'Identifier',
          name: 'NaN',
        }
        const expr = new Evaluator().evaluateIfIdentifier(node, false)
        expect(typeof expr).toBe('function')
        expect(expr({})).toBeNaN()
        expect(expr({ NaN: 5 })).toBeNaN()
      })

      it('should evaluate NaN asynchronously', async () => {
        const node: ESTree.Identifier = {
          type: 'Identifier',
          name: 'NaN',
        }
        const expr = new Evaluator().evaluateIfIdentifier(node, true)
        expect(typeof expr).toBe('function')
        expect(await expr({})).toEqual({ value: NaN })
        expect(await expr({ NaN: 5 })).toEqual({ value: NaN })
      })

      it('should evaluate Infinity', () => {
        const node: ESTree.Identifier = {
          type: 'Identifier',
          name: 'Infinity',
        }
        const expr = new Evaluator().evaluateIfIdentifier(node, false)
        expect(typeof expr).toBe('function')
        expect(expr({})).toBe(Infinity)
        expect(expr({ Infinity: 5 })).toBe(Infinity)
      })

      it('should evaluate Infinity asynchronously', async () => {
        const node: ESTree.Identifier = {
          type: 'Identifier',
          name: 'Infinity',
        }
        const expr = new Evaluator().evaluateIfIdentifier(node, true)
        expect(typeof expr).toBe('function')
        expect(await expr({})).toEqual({ value: Infinity })
        expect(await expr({ Infinity: 5 })).toEqual({ value: Infinity })
      })
    })

    describe('Literals', () => {
      it('should create a simple literal', () => {
        const node: ESTree.SimpleLiteral = {
          type: 'Literal',
          value: 1,
        }
        const expr = new Evaluator().createLiteral(node, false)
        expect(typeof expr).toBe('function')
        expect(expr({})).toBe(1)
      })

      it('should create a simple literal with async set to true', async () => {
        const node: ESTree.SimpleLiteral = {
          type: 'Literal',
          value: 1,
        }
        const expr = new Evaluator().createLiteral(node, true)
        expect(typeof expr).toBe('function')
        expect(await expr({})).toEqual({ value: 1 })
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
        const expr = new Evaluator().createLiteral(node, false)
        expect(typeof expr).toBe('function')
        expect(expr({})).toEqual(/foo/g)
      })

      it('should create a BigInt literal', () => {
        const node: ESTree.BigIntLiteral = {
          type: 'Literal',
          value: 1n,
          bigint: '1',
        }
        const expr = new Evaluator().createLiteral(node, false)
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
        const expr = new Evaluator().createLogicalExpression(node, false)
        expect(typeof expr).toBe('function')
        expect(expr({})).toBe(0)
      })

      it('should create an async logical expression', async () => {
        const node: ESTree.LogicalExpression = {
          type: 'LogicalExpression',
          operator: '&&',
          left: {
            type: 'AwaitExpression',
            argument: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'foo',
              },
              arguments: [],
              optional: false,
            },
          },
          right: {
            type: 'Literal',
            value: 0,
          },
        }
        const expr = new Evaluator().createLogicalExpression(node, true)
        expect(typeof expr).toBe('function')
        expect(await expr({ foo: async () => 1 })).toEqual({ value: 0 })
      })

      it('should throw when given a logical expression with an invalid operator', () => {
        expect(() =>
          new Evaluator().createLogicalExpression(
            {
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
            },
            false,
          ),
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
        const expr = new Evaluator().createMemberExpression(node, false)
        expect(typeof expr).toBe('function')
        expect(expr({ foo: { bar: 1 } })).toBe(1)
      })

      it('should create an async member expression', async () => {
        const node: ESTree.MemberExpression = {
          type: 'MemberExpression',
          object: {
            type: 'AwaitExpression',
            argument: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'foo',
              },
              arguments: [],
              optional: false,
            },
          },
          property: {
            type: 'Identifier',
            name: 'bar',
          },
          computed: false,
          optional: false,
        }
        const expr = new Evaluator().createMemberExpression(node, true)
        expect(typeof expr).toBe('function')
        expect(await expr({ foo: async () => ({ bar: 1 }) })).toEqual({
          value: 1,
        })
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
        const expr = new Evaluator().createMemberExpression(node, false)
        expect(typeof expr).toBe('function')
        expect(expr({ foo: { x: 1 }, bar: 'x' })).toBe(1)
      })

      it('should create an async computed member expression', async () => {
        const node: ESTree.MemberExpression = {
          type: 'MemberExpression',
          object: {
            type: 'Identifier',
            name: 'foo',
          },
          property: {
            type: 'AwaitExpression',
            argument: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'bar',
              },
              arguments: [],
              optional: false,
            },
          },
          computed: true,
          optional: false,
        }
        const expr = new Evaluator().createMemberExpression(node, true)
        expect(typeof expr).toBe('function')
        expect(await expr({ foo: { x: 1 }, bar: async () => 'x' })).toEqual({
          value: 1,
        })
      })

      it('should create an optional member expression', () => {
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
          optional: true,
        }
        const expr = new Evaluator().createMemberExpression(node, false)
        expect(typeof expr).toBe('function')
        expect(expr({ foo: { bar: 1 } })).toBe(1)
        expect(expr({})).toBeUndefined()
      })

      it('should create an async optional member expression', async () => {
        const node: ESTree.MemberExpression = {
          type: 'MemberExpression',
          object: {
            type: 'AwaitExpression',
            argument: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'foo',
              },
              arguments: [],
              optional: false,
            },
          },
          property: {
            type: 'Identifier',
            name: 'bar',
          },
          computed: false,
          optional: true,
        }
        const expr = new Evaluator().createMemberExpression(node, true)
        expect(typeof expr).toBe('function')
        expect(await expr({ foo: async () => ({ bar: 1 }) })).toEqual({
          value: 1,
        })
        expect(await expr({ foo: async () => undefined })).toEqual({
          value: undefined,
        })
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
        const expr = new Evaluator().createObjectExpression(node, false)
        expect(typeof expr).toBe('function')
        expect(expr({ bar: 'qux', baz: { quux: 3 } })).toEqual({
          foo: 1,
          qux: 2,
          quux: 3,
        })
      })

      it('should create an async object expression', async () => {
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
                type: 'AwaitExpression',
                argument: {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'quuz',
                  },
                  arguments: [],
                  optional: false,
                },
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
        const expr = new Evaluator().createObjectExpression(node, true)
        expect(typeof expr).toBe('function')
        expect(
          await expr({ bar: 'qux', baz: { quux: 3 }, quuz: async () => 1 }),
        ).toEqual({
          value: {
            foo: 1,
            qux: 2,
            quux: 3,
          },
        })
      })

      it('should throw when given an invalid property type', () => {
        expect(() =>
          new Evaluator().createObjectExpression(
            {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Identifier',
                  name: 'invalid',
                } as any,
              ],
            },
            false,
          ),
        ).toThrowErrorMatchingSnapshot()
        expect(() =>
          new Evaluator().createObjectExpression(
            {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Identifier',
                  name: 'invalid',
                } as any,
              ],
            },
            true,
          ),
        ).toThrowErrorMatchingSnapshot()
      })

      it('should throw when given an invalid property kind', () => {
        expect(() =>
          new Evaluator().createObjectExpression(
            {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  method: false,
                  shorthand: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  kind: 'get',
                  value: {
                    type: 'FunctionExpression',
                    id: null,
                    generator: false,
                    async: false,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ReturnStatement',
                          argument: {
                            type: 'Literal',
                            value: 5,
                            raw: '5',
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
            false,
          ),
        ).toThrowErrorMatchingSnapshot()
        expect(() =>
          new Evaluator().createObjectExpression(
            {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  method: false,
                  shorthand: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  kind: 'get',
                  value: {
                    type: 'FunctionExpression',
                    id: null,
                    generator: false,
                    async: false,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ReturnStatement',
                          argument: {
                            type: 'Literal',
                            value: 5,
                            raw: '5',
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
            true,
          ),
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
        const expr = new Evaluator().createTaggedTemplateExpression(node, false)
        expect(typeof expr).toBe('function')
        const foo = vi.fn(
          (strings: TemplateStringsArray, expression: number) =>
            `got ${strings.join('')} and ${expression}`,
        )
        expect(expr({ foo })).toBe('got bar and 1')
        expect(foo).toHaveBeenCalledWith(
          Object.assign(['', 'bar'], { raw: ['', 'bar'] }),
          1,
        )
      })

      it('should create an async tagged template expression', async () => {
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
                type: 'AwaitExpression',
                argument: {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'quuz',
                  },
                  arguments: [],
                  optional: false,
                },
              },
            ],
          },
        }
        const expr = new Evaluator().createTaggedTemplateExpression(node, true)
        expect(typeof expr).toBe('function')
        const foo = vi.fn(
          (strings: TemplateStringsArray, expression: number) =>
            `got ${strings.join('')} and ${expression}`,
        )
        expect(await expr({ foo, quuz: async () => 1 })).toEqual({
          value: 'got bar and 1',
        })
        expect(foo).toHaveBeenCalledWith(
          Object.assign(['', 'bar'], { raw: ['', 'bar'] }),
          1,
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
        const expr = new Evaluator().createTemplateLiteral(node, false)
        expect(typeof expr).toBe('function')
        expect(expr({})).toEqual('foo1bar')
      })

      it('should create an async template literal', async () => {
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
              type: 'AwaitExpression',
              argument: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'quuz',
                },
                arguments: [],
                optional: false,
              },
            },
          ],
        }
        const expr = new Evaluator().createTemplateLiteral(node, true)
        expect(typeof expr).toBe('function')
        expect(await expr({ quuz: async () => 1 })).toEqual({
          value: 'foo1bar',
        })
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
        const expr = new Evaluator().createUnaryExpression(node, false)
        expect(typeof expr).toBe('function')
        expect(expr({ foo: 0 })).toBe(-0)
      })

      it('should create an async unary expression', async () => {
        const node: ESTree.UnaryExpression = {
          type: 'UnaryExpression',
          operator: '-',
          argument: {
            type: 'AwaitExpression',
            argument: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'foo',
              },
              arguments: [],
              optional: false,
            },
          },
          prefix: true,
        }
        const expr = new Evaluator().createUnaryExpression(node, true)
        expect(typeof expr).toBe('function')
        expect(await expr({ foo: async () => 0 })).toEqual({ value: -0 })
      })

      it('should throw when given an invalid operator', () => {
        expect(() =>
          new Evaluator().createUnaryExpression(
            {
              type: 'UnaryExpression',
              operator: 'invalid' as any,
              argument: {
                type: 'Identifier',
                name: 'foo',
              },
              prefix: true,
            },
            false,
          ),
        ).toThrowErrorMatchingSnapshot()
      })
    })
  })
})
