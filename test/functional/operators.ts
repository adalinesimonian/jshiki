import { evaluate, evaluateAsync, parse, parseAsync } from '../../src'

describe('Operators', () => {
  describe('Unary Operators', () => {
    describe('+ (Unary plus)', () => {
      it('should convert to numbers', () => {
        expect(evaluate('+5')).toBe(5)
        expect(evaluate("+'5'")).toBe(5)
        expect(evaluate('+true')).toBe(1)
        expect(evaluate('+false')).toBe(0)
        expect(evaluate('+null')).toBe(0)
      })
    })

    describe('- (Unary negation)', () => {
      it('should negate numbers', () => {
        expect(evaluate('-5')).toBe(-5)
      })
    })

    describe('! (Logical NOT)', () => {
      it('should negate expressions', () => {
        expect(evaluate('!true')).toBe(false)
        expect(evaluate('!false')).toBe(true)
        expect(evaluate('!1')).toBe(false)
        expect(evaluate('!0')).toBe(true)
        expect(evaluate('!!true')).toBe(true)
        expect(evaluate('!!false')).toBe(false)
        expect(evaluate('!!1')).toBe(true)
        expect(evaluate('!!0')).toBe(false)
      })
    })

    describe('~ (Bitwise NOT)', () => {
      it('should invert numbers', () => {
        expect(evaluate('~5')).toBe(-6)
        expect(evaluate('~-15')).toBe(14)
      })
    })

    describe('typeof (Type check)', () => {
      const options = {
        operators: {
          unary: { allow: ['typeof'] },
        },
      }

      it('should return the type of the expression', () => {
        expect(evaluate('typeof 5', options)).toBe('number')
        expect(evaluate('typeof true', options)).toBe('boolean')
        expect(evaluate('typeof "hello"', options)).toBe('string')
        expect(evaluate('typeof null', options)).toBe('object')
        expect(evaluate('typeof undefined', options)).toBe('undefined')
        expect(evaluate('typeof []', options)).toBe('object')
        expect(evaluate('typeof {}', options)).toBe('object')
      })
    })

    describe('Unsupported operators', () => {
      it('should throw an error', () => {
        expect(() => evaluate('delete x.y')).toThrowErrorMatchingSnapshot()
      })
    })
  })

  describe('Binary Operators', () => {
    describe('+ (Addition)', () => {
      it('should add integers', () => {
        expect(evaluate('5 + 3')).toBe(8)
      })

      it('should add floating-point numbers', () => {
        expect(evaluate('5.2 + 3.8')).toBe(9)
      })

      it('should concatenate strings', () => {
        expect(evaluate("'x' + 'y'")).toBe('xy')
      })

      it('should throw when the expression is missing an operand', () => {
        expect(() => parse('a +')).toThrowErrorMatchingSnapshot()
      })
    })

    describe('- (Subtraction)', () => {
      it('should subtract integers', () => {
        expect(evaluate('5 - 3')).toBe(2)
      })

      it('should subtract floating-point numbers', () => {
        expect(evaluate('5.5 - 3.2')).toBe(2.3)
      })

      it('should throw when the expression is missing an operand', () => {
        expect(() => parse('a -')).toThrowErrorMatchingSnapshot()
      })
    })

    describe('* (Multiplication)', () => {
      it('should multiply integers', () => {
        expect(evaluate('5 * 3')).toBe(15)
      })

      it('should multiply floating-point numbers', () => {
        expect(evaluate('5.4 * 3.6')).toBeCloseTo(19.44)
      })

      it('should throw when the expression is missing an operand', () => {
        expect(() => parse('a *')).toThrowErrorMatchingSnapshot()
      })
    })

    describe('** (Exponential)', () => {
      it('should raise first operand to power of second operand', () => {
        expect(evaluate('5 ** 3')).toBe(125)
      })

      it('should exponentiate floating-point numbers', () => {
        expect(evaluate('2.1 ** 3.5')).toBeCloseTo(2.1 ** 3.5)
      })

      it('should throw when the expression is missing an operand', () => {
        expect(() => parse('a **')).toThrowErrorMatchingSnapshot()
      })
    })

    describe('/ (Division)', () => {
      it('should divide integers', () => {
        expect(evaluate('8 / 4')).toBe(2)
        expect(evaluate('5 / 3')).toBeCloseTo(5 / 3)
      })

      it('should divide floating-point numbers', () => {
        expect(evaluate('8.2 / 4.2')).toBeCloseTo(8.2 / 4.2)
        expect(evaluate('5.5 / 3.5')).toBeCloseTo(5.5 / 3.5)
      })

      it('should throw when the expression is missing an operand', () => {
        expect(() => parse('a /')).toThrowErrorMatchingSnapshot()
      })
    })

    describe('% (Modulo)', () => {
      it('should perform modulo on integers', () => {
        expect(evaluate('8 % 4')).toBe(0)
        expect(evaluate('5 % 3')).toBe(2)
      })

      it('should throw when the expression is missing an operand', () => {
        expect(() => parse('a %')).toThrowErrorMatchingSnapshot()
      })
    })

    describe('< (Less than)', () => {
      it('should compare numbers', () => {
        expect(evaluate('8 < 4')).toBe(false)
        expect(evaluate('3 < 5')).toBe(true)
        expect(evaluate('5 < 5')).toBe(false)
      })

      it('should throw when the expression is missing an operand', () => {
        expect(() => parse('a <')).toThrowErrorMatchingSnapshot()
      })
    })

    describe('> (Greater than)', () => {
      it('should compare numbers', () => {
        expect(evaluate('8 > 4')).toBe(true)
        expect(evaluate('3 > 5')).toBe(false)
        expect(evaluate('5 > 5')).toBe(false)
      })

      it('should throw when the expression is missing an operand', () => {
        expect(() => parse('a >')).toThrowErrorMatchingSnapshot()
      })
    })

    describe('<= (Less than or equal to)', () => {
      it('should compare numbers', () => {
        expect(evaluate('8 <= 4')).toBe(false)
        expect(evaluate('3 <= 5')).toBe(true)
        expect(evaluate('5 <= 5')).toBe(true)
      })

      it('should throw when the expression is missing an operand', () => {
        expect(() => parse('a <=')).toThrowErrorMatchingSnapshot()
      })
    })

    describe('>= (Greater than or equal to)', () => {
      it('should compare numbers', () => {
        expect(evaluate('8 >= 4')).toBe(true)
        expect(evaluate('3 >= 5')).toBe(false)
        expect(evaluate('5 >= 5')).toBe(true)
      })

      it('should throw when the expression is missing an operand', () => {
        expect(() => parse('a >=')).toThrowErrorMatchingSnapshot()
      })
    })

    describe('== (Equality)', () => {
      it('should compare numbers', () => {
        expect(evaluate('8 == 4')).toBe(false)
        expect(evaluate('3 == 5')).toBe(false)
        expect(evaluate('5 == 5')).toBe(true)
      })

      it('should compare strings', () => {
        expect(evaluate("'1' == '1'")).toBe(true)
        expect(evaluate("'1' == '2'")).toBe(false)
      })

      it('should compare objects', () => {
        expect(evaluate("{ x: '1' } == { x: '1' }")).toBe(false)
      })

      it('should compare null and undefined', () => {
        expect(evaluate('null == undefined')).toBe(true)
      })

      it('should throw when the expression is missing an operand', () => {
        expect(() => parse('a ==')).toThrowErrorMatchingSnapshot()
      })
    })

    describe('!= (Inequality)', () => {
      it('should compare numbers', () => {
        expect(evaluate('8 != 4')).toBe(true)
        expect(evaluate('3 != 5')).toBe(true)
        expect(evaluate('5 != 5')).toBe(false)
      })

      it('should compare strings', () => {
        expect(evaluate("'1' != '1'")).toBe(false)
        expect(evaluate("'1' != '2'")).toBe(true)
      })

      it('should compare objects', () => {
        expect(evaluate("{ x: '1' } != { x: '1' }")).toBe(true)
      })

      it('should compare null and undefined', () => {
        expect(evaluate('undefined != null')).toBe(false)
      })

      it('should throw when the expression is missing an operand', () => {
        expect(() => parse('a !=')).toThrowErrorMatchingSnapshot()
      })
    })

    describe('=== (Identity)', () => {
      it('should compare numbers', () => {
        expect(evaluate('8 === 4')).toBe(false)
        expect(evaluate('3 === 5')).toBe(false)
        expect(evaluate('5 === 5')).toBe(true)
      })

      it('should compare strings', () => {
        expect(evaluate("'1' === '1'")).toBe(true)
        expect(evaluate("'1' === '2'")).toBe(false)
      })

      it('should compare objects', () => {
        expect(evaluate("{ x: '1' } === { x: '1' }")).toBe(false)
      })

      it('should compare null and undefined', () => {
        expect(evaluate('undefined === null')).toBe(false)
      })

      it('should throw when the expression is missing an operand', () => {
        expect(() => parse('a ===')).toThrowErrorMatchingSnapshot()
      })
    })

    describe('!== (Non-identity)', () => {
      it('should compare numbers', () => {
        expect(evaluate('8 !== 4')).toBe(true)
        expect(evaluate('3 !== 5')).toBe(true)
        expect(evaluate('5 !== 5')).toBe(false)
      })

      it('should compare strings', () => {
        expect(evaluate("'1' !== '1'")).toBe(false)
        expect(evaluate("'1' !== '2'")).toBe(true)
      })

      it('should compare objects', () => {
        expect(evaluate("{ x: '1' } !== { x: '1' }")).toBe(true)
      })

      it('should compare null and undefined', () => {
        expect(evaluate('undefined !== null')).toBe(true)
      })

      it('should throw when the expression is missing an operand', () => {
        expect(() => parse('a !==')).toThrowErrorMatchingSnapshot()
      })
    })

    describe('& (Bitwise AND)', () => {
      it('should bitwise AND integers', () => {
        expect(evaluate('5 & 3')).toBe(1)
      })

      it('should throw when the expression is missing an operand', () => {
        expect(() => parse('a &')).toThrowErrorMatchingSnapshot()
      })
    })

    describe('| (Bitwise OR)', () => {
      it('should bitwise OR integers', () => {
        expect(evaluate('5 | 3')).toBe(7)
      })

      it('should throw when the expression is missing an operand', () => {
        expect(() => parse('a |')).toThrowErrorMatchingSnapshot()
      })
    })

    describe('^ (Bitwise XOR)', () => {
      it('should bitwise XOR integers', () => {
        expect(evaluate('5 ^ 3')).toBe(6)
      })

      it('should throw when the expression is missing an operand', () => {
        expect(() => parse('a ^')).toThrowErrorMatchingSnapshot()
      })
    })

    describe('<< (Bitwise Left Shift)', () => {
      it('should shift integer to the left', () => {
        expect(evaluate('5 << 1')).toBe(10)
      })

      it('should throw when the expression is missing an operand', () => {
        expect(() => parse('a <<')).toThrowErrorMatchingSnapshot()
      })
    })

    describe('>> (Bitwise Right Shift)', () => {
      it('should shift integer to the right', () => {
        expect(evaluate('5 >> 1')).toBe(2)
      })

      it('should throw when the expression is missing an operand', () => {
        expect(() => parse('a >>')).toThrowErrorMatchingSnapshot()
      })
    })

    describe('>>> (Bitwise Unsigned Right Shift)', () => {
      it('should unsigned shift integer to the right', () => {
        expect(evaluate('5 >>> 1')).toBe(2)
      })

      it('should throw when the expression is missing an operand', () => {
        expect(() => parse('a >>>')).toThrowErrorMatchingSnapshot()
      })
    })

    describe('in (Property Membership)', () => {
      const options = {
        operators: {
          binary: { allow: ['in'] },
        },
      }

      it('should check if a property is in an object', () => {
        expect(evaluate('"x" in { x: 1 }', options)).toBe(true)
        expect(evaluate('"y" in { x: 1 }', options)).toBe(false)
      })

      it('should throw when the expression is missing an operand', () => {
        expect(() => parse('a in', options)).toThrowErrorMatchingSnapshot()
        expect(() => parse('in a', options)).toThrowErrorMatchingSnapshot()
      })
    })

    describe('instanceof (Prototype Check)', () => {
      class Foo {
        x = 5
      }

      class Bar extends Foo {}

      const foo = new Foo()
      const bar = new Bar()

      const baseOptions = {
        operators: {
          binary: { allow: ['instanceof'] },
        },
        scope: {
          foo,
          bar,
          Foo,
          Bar,
        },
      }

      it('should check if an object is an instance of a constructor', () => {
        expect(evaluate('foo instanceof Foo', baseOptions)).toBe(true)
        expect(evaluate('bar instanceof Foo', baseOptions)).toBe(true)
        expect(evaluate('foo instanceof Bar', baseOptions)).toBe(false)
        expect(evaluate('bar instanceof Bar', baseOptions)).toBe(true)
      })

      it('should throw when the expression is missing an operand', () => {
        expect(() =>
          parse('a instanceof', baseOptions)
        ).toThrowErrorMatchingSnapshot()
        expect(() =>
          parse('instanceof a', baseOptions)
        ).toThrowErrorMatchingSnapshot()
      })
    })

    describe('=, +=, -=, ... (Assignment)', () => {
      it('should throw an error', () => {
        expect(() => parse('a = 2')).toThrowErrorMatchingSnapshot()
        expect(() => parse('a += 2')).toThrowErrorMatchingSnapshot()
        expect(() => parse('a -= 2')).toThrowErrorMatchingSnapshot()
        expect(() => parse('a *= 2')).toThrowErrorMatchingSnapshot()
        expect(() => parse('a /= 2')).toThrowErrorMatchingSnapshot()
        expect(() => parse('a %= 2')).toThrowErrorMatchingSnapshot()
        expect(() => parse('a **= 2')).toThrowErrorMatchingSnapshot()
        expect(() => parse('a <<= 2')).toThrowErrorMatchingSnapshot()
        expect(() => parse('a >>= 2')).toThrowErrorMatchingSnapshot()
        expect(() => parse('a >>>= 2')).toThrowErrorMatchingSnapshot()
        expect(() => parse('a &= 2')).toThrowErrorMatchingSnapshot()
        expect(() => parse('a ^= 2')).toThrowErrorMatchingSnapshot()
        expect(() => parse('a |= 2')).toThrowErrorMatchingSnapshot()
        expect(() => parse('a &&= 2')).toThrowErrorMatchingSnapshot()
        expect(() => parse('a ||= 2')).toThrowErrorMatchingSnapshot()
        expect(() => parse('a ??= 2')).toThrowErrorMatchingSnapshot()
        expect(() => parse('a++')).toThrowErrorMatchingSnapshot()
        expect(() => parse('a--')).toThrowErrorMatchingSnapshot()
        expect(() => parse('--a')).toThrowErrorMatchingSnapshot()
        expect(() => parse('++a')).toThrowErrorMatchingSnapshot()
      })

      it('should throw when the expression is missing an operand', () => {
        expect(() => parse('a =')).toThrowErrorMatchingSnapshot()
        expect(() => parse('a +=')).toThrowErrorMatchingSnapshot()
        expect(() => parse('a -=')).toThrowErrorMatchingSnapshot()
        expect(() => parse('a *=')).toThrowErrorMatchingSnapshot()
        expect(() => parse('a /=')).toThrowErrorMatchingSnapshot()
        expect(() => parse('a %=')).toThrowErrorMatchingSnapshot()
        expect(() => parse('a **=')).toThrowErrorMatchingSnapshot()
        expect(() => parse('a <<=')).toThrowErrorMatchingSnapshot()
        expect(() => parse('a >>=')).toThrowErrorMatchingSnapshot()
        expect(() => parse('a >>>=')).toThrowErrorMatchingSnapshot()
        expect(() => parse('a &=')).toThrowErrorMatchingSnapshot()
        expect(() => parse('a ^=')).toThrowErrorMatchingSnapshot()
        expect(() => parse('a |=')).toThrowErrorMatchingSnapshot()
        expect(() => parse('a &&=')).toThrowErrorMatchingSnapshot()
        expect(() => parse('a ||=')).toThrowErrorMatchingSnapshot()
        expect(() => parse('a ??=')).toThrowErrorMatchingSnapshot()
        expect(() => parse('++')).toThrowErrorMatchingSnapshot()
        expect(() => parse('--')).toThrowErrorMatchingSnapshot()
      })
    })

    describe('++, -- (Increment, Decrement)', () => {
      it('should throw an error', () => {
        expect(() => parse('a++')).toThrowErrorMatchingSnapshot()
        expect(() => parse('a--')).toThrowErrorMatchingSnapshot()
        expect(() => parse('--a')).toThrowErrorMatchingSnapshot()
        expect(() => parse('++a')).toThrowErrorMatchingSnapshot()
      })

      it('should throw when the expression is missing an operand', () => {
        expect(() => parse('++')).toThrowErrorMatchingSnapshot()
        expect(() => parse('--')).toThrowErrorMatchingSnapshot()
      })
    })
  })

  describe('Logical Operators', () => {
    describe('&& (Logical AND)', () => {
      it('should compare booleans', () => {
        expect(evaluate('false && false')).toBe(false)
        expect(evaluate('false && true')).toBe(false)
        expect(evaluate('true && false')).toBe(false)
        expect(evaluate('true && true')).toBe(true)
      })

      it('should compare numbers', () => {
        expect(evaluate('0 && 0')).toBe(0)
        expect(evaluate('0 && 1')).toBe(0)
        expect(evaluate('1 && 0')).toBe(0)
        expect(evaluate('1 && 1')).toBe(1)
      })

      it('should compare strings', () => {
        expect(evaluate("'' && ''")).toBe('')
        expect(evaluate("'' && '1'")).toBe('')
        expect(evaluate("'1' && ''")).toBe('')
        expect(evaluate("'1' && '1'")).toBe('1')
      })

      it('should compare null and undefined', () => {
        expect(evaluate('null && undefined')).toBe(null)
        expect(evaluate('undefined && null')).toBe(undefined)
        expect(evaluate("null && 'x'")).toBe(null)
        expect(evaluate("undefined && 'x'")).toBe(undefined)
        expect(evaluate("'x' && null")).toBe(null)
        expect(evaluate("'x' && undefined")).toBe(undefined)
      })

      it('should throw when the expression is missing an operand', () => {
        expect(() => parse('a &&')).toThrowErrorMatchingSnapshot()
      })
    })

    describe('|| (Logical OR)', () => {
      it('should compare booleans', () => {
        expect(evaluate('false || false')).toBe(false)
        expect(evaluate('false || true')).toBe(true)
        expect(evaluate('true || false')).toBe(true)
        expect(evaluate('true || true')).toBe(true)
      })

      it('should compare numbers', () => {
        expect(evaluate('0 || 0')).toBe(0)
        expect(evaluate('0 || 1')).toBe(1)
        expect(evaluate('1 || 0')).toBe(1)
        expect(evaluate('1 || 1')).toBe(1)
      })

      it('should compare strings', () => {
        expect(evaluate("'' || ''")).toBe('')
        expect(evaluate("'' || '1'")).toBe('1')
        expect(evaluate("'1' || ''")).toBe('1')
        expect(evaluate("'1' || '1'")).toBe('1')
      })

      it('should compare null and undefined', () => {
        expect(evaluate('null || undefined')).toBe(undefined)
        expect(evaluate('undefined || null')).toBe(null)
        expect(evaluate("null || 'x'")).toBe('x')
        expect(evaluate("undefined || 'x'")).toBe('x')
        expect(evaluate("'x' || null")).toBe('x')
        expect(evaluate("'x' || undefined")).toBe('x')
      })

      it('should throw when the expression is missing an operand', () => {
        expect(() => parse('a ||')).toThrowErrorMatchingSnapshot()
      })
    })

    describe('?? (Null coalescing)', () => {
      it('should return the first value if it is not null or undefined', () => {
        expect(evaluate('1 ?? 2')).toBe(1)
        expect(evaluate('"x" ?? 2')).toBe('x')
        expect(evaluate('x ?? 2', { scope: { x: 1 } })).toBe(1)
      })

      it('should return the second value if the first is null', () => {
        expect(evaluate('null ?? 2')).toBe(2)
        expect(evaluate('null ?? null')).toBe(null)
        expect(evaluate('null ?? undefined')).toBe(undefined)
        expect(evaluate('x ?? 2', { scope: { x: null } })).toBe(2)
      })

      it('should return the second value if the first is undefined', () => {
        expect(evaluate('undefined ?? 2')).toBe(2)
        expect(evaluate('undefined ?? null')).toBe(null)
        expect(evaluate('undefined ?? undefined')).toBe(undefined)
        expect(evaluate('x ?? 2', { scope: { x: undefined } })).toBe(2)
      })

      it('should throw when the expression is missing an operand', () => {
        expect(() => parse('a ??')).toThrowErrorMatchingSnapshot()
      })
    })
  })

  describe('?: (Conditional/Ternary)', () => {
    it('should return the first value if the condition is true', () => {
      expect(evaluate('true ? 1 : 2')).toBe(1)
      expect(evaluate('5 === 5 ? 1 : 2')).toBe(1)
      expect(evaluate('x ? 1 : 2', { scope: { x: true } })).toBe(1)
    })

    it('should return the first value if the condition is truthy', () => {
      expect(evaluate('1 ? 1 : 2')).toBe(1)
      expect(evaluate('x ? 1 : 2', { scope: { x: 1 } })).toBe(1)
      expect(evaluate('"x" ? 1 : 2')).toBe(1)
      expect(evaluate('x ? 1 : 2', { scope: { x: 'x' } })).toBe(1)
      expect(evaluate('{} ? 1 : 2')).toBe(1)
      expect(evaluate('x ? 1 : 2', { scope: { x: {} } })).toBe(1)
      expect(evaluate('[] ? 1 : 2')).toBe(1)
      expect(evaluate('x ? 1 : 2', { scope: { x: [] } })).toBe(1)
    })

    it('should return the second value if the condition is false', () => {
      expect(evaluate('false ? 1 : 2')).toBe(2)
      expect(evaluate('5 !== 5 ? 1 : 2')).toBe(2)
      expect(evaluate('x ? 1 : 2', { scope: { x: false } })).toBe(2)
    })

    it('should return the second value if the condition is falsy', () => {
      expect(evaluate('0 ? 1 : 2')).toBe(2)
      expect(evaluate('x ? 1 : 2', { scope: { x: 0 } })).toBe(2)
      expect(evaluate('0n ? 1 : 2')).toBe(2)
      expect(evaluate('x ? 1 : 2', { scope: { x: 0n } })).toBe(2)
      expect(evaluate('NaN ? 1 : 2')).toBe(2)
      expect(evaluate('x ? 1 : 2', { scope: { x: NaN } })).toBe(2)
      expect(evaluate('"" ? 1 : 2')).toBe(2)
      expect(evaluate('x ? 1 : 2', { scope: { x: '' } })).toBe(2)
      expect(evaluate('null ? 1 : 2')).toBe(2)
      expect(evaluate('x ? 1 : 2', { scope: { x: null } })).toBe(2)
      expect(evaluate('undefined ? 1 : 2')).toBe(2)
      expect(evaluate('x ? 1 : 2', { scope: { x: undefined } })).toBe(2)
    })

    it('should throw when the expression is missing an operand', () => {
      expect(() => parse('a ?')).toThrowErrorMatchingSnapshot()
    })
  })

  describe('Ordering', () => {
    it('should follow the order of operations', () => {
      expect(evaluate('24 / 6 * 2 + 4 / 2')).toBe(10)
      expect(evaluate('(24 / (6 * 2) + 4) / 2')).toBe(3)
    })
  })

  it('should throw when the expression contains an invalid operator', () => {
    expect(() => parse('a /// b')).toThrowErrorMatchingSnapshot()
    expect(() => parse('a _ b')).toThrowErrorMatchingSnapshot()
  })
})

describe('Operators (async)', () => {
  describe('Unary Operators', () => {
    describe('+ (Unary plus)', () => {
      it('should convert to numbers', async () => {
        expect(await evaluateAsync('+5')).toBe(5)
        expect(await evaluateAsync("+'5'")).toBe(5)
        expect(await evaluateAsync('+true')).toBe(1)
        expect(await evaluateAsync('+false')).toBe(0)
        expect(await evaluateAsync('+null')).toBe(0)
      })
    })

    describe('- (Unary negation)', () => {
      it('should negate numbers', async () => {
        expect(await evaluateAsync('-5')).toBe(-5)
      })
    })

    describe('! (Logical NOT)', () => {
      it('should negate expressions', async () => {
        expect(await evaluateAsync('!true')).toBe(false)
        expect(await evaluateAsync('!false')).toBe(true)
        expect(await evaluateAsync('!1')).toBe(false)
        expect(await evaluateAsync('!0')).toBe(true)
        expect(await evaluateAsync('!!true')).toBe(true)
        expect(await evaluateAsync('!!false')).toBe(false)
        expect(await evaluateAsync('!!1')).toBe(true)
        expect(await evaluateAsync('!!0')).toBe(false)
      })
    })

    describe('~ (Bitwise NOT)', () => {
      it('should invert numbers', async () => {
        expect(await evaluateAsync('~5')).toBe(-6)
        expect(await evaluateAsync('~-15')).toBe(14)
      })
    })

    describe('typeof (Type check)', () => {
      const options = {
        operators: {
          unary: { allow: ['typeof'] },
        },
      }

      it('should return the type of the expression', async () => {
        expect(await evaluateAsync('typeof 5', options)).toBe('number')
        expect(await evaluateAsync('typeof true', options)).toBe('boolean')
        expect(await evaluateAsync('typeof "hello"', options)).toBe('string')
        expect(await evaluateAsync('typeof null', options)).toBe('object')
        expect(await evaluateAsync('typeof undefined', options)).toBe(
          'undefined'
        )
        expect(await evaluateAsync('typeof []', options)).toBe('object')
        expect(await evaluateAsync('typeof {}', options)).toBe('object')
      })
    })

    describe('Unsupported operators', () => {
      it('should throw an error', async () => {
        expect(
          async () => await evaluateAsync('delete x.y')
        ).rejects.toThrowErrorMatchingSnapshot()
      })
    })
  })

  describe('Binary Operators', () => {
    describe('+ (Addition)', () => {
      it('should add integers', async () => {
        expect(await evaluateAsync('5 + 3')).toBe(8)
      })

      it('should add floating-point numbers', async () => {
        expect(await evaluateAsync('5.2 + 3.8')).toBe(9)
      })

      it('should concatenate strings', async () => {
        expect(await evaluateAsync("'x' + 'y'")).toBe('xy')
      })

      it('should throw when the expression is missing an operand', async () => {
        expect(async () =>
          parseAsync('a +')
        ).rejects.toThrowErrorMatchingSnapshot()
      })
    })

    describe('- (Subtraction)', () => {
      it('should subtract integers', async () => {
        expect(await evaluateAsync('5 - 3')).toBe(2)
      })

      it('should subtract floating-point numbers', async () => {
        expect(await evaluateAsync('5.5 - 3.2')).toBe(2.3)
      })

      it('should throw when the expression is missing an operand', async () => {
        expect(async () =>
          parseAsync('a -')
        ).rejects.toThrowErrorMatchingSnapshot()
      })
    })

    describe('* (Multiplication)', () => {
      it('should multiply integers', async () => {
        expect(await evaluateAsync('5 * 3')).toBe(15)
      })

      it('should multiply floating-point numbers', async () => {
        expect(await evaluateAsync('5.4 * 3.6')).toBeCloseTo(19.44)
      })

      it('should throw when the expression is missing an operand', async () => {
        expect(async () =>
          parseAsync('a *')
        ).rejects.toThrowErrorMatchingSnapshot()
      })
    })

    describe('** (Exponential)', () => {
      it('should raise first operand to power of second operand', async () => {
        expect(await evaluateAsync('5 ** 3')).toBe(125)
      })

      it('should exponentiate floating-point numbers', async () => {
        expect(await evaluateAsync('2.1 ** 3.5')).toBeCloseTo(2.1 ** 3.5)
      })

      it('should throw when the expression is missing an operand', async () => {
        expect(async () =>
          parseAsync('a **')
        ).rejects.toThrowErrorMatchingSnapshot()
      })
    })

    describe('/ (Division)', () => {
      it('should divide integers', async () => {
        expect(await evaluateAsync('8 / 4')).toBe(2)
        expect(await evaluateAsync('5 / 3')).toBeCloseTo(5 / 3)
      })

      it('should divide floating-point numbers', async () => {
        expect(await evaluateAsync('8.2 / 4.2')).toBeCloseTo(8.2 / 4.2)
        expect(await evaluateAsync('5.5 / 3.5')).toBeCloseTo(5.5 / 3.5)
      })

      it('should throw when the expression is missing an operand', async () => {
        expect(async () =>
          parseAsync('a /')
        ).rejects.toThrowErrorMatchingSnapshot()
      })
    })

    describe('% (Modulo)', () => {
      it('should perform modulo on integers', async () => {
        expect(await evaluateAsync('8 % 4')).toBe(0)
        expect(await evaluateAsync('5 % 3')).toBe(2)
      })

      it('should throw when the expression is missing an operand', async () => {
        expect(async () =>
          parseAsync('a %')
        ).rejects.toThrowErrorMatchingSnapshot()
      })
    })

    describe('< (Less than)', () => {
      it('should compare numbers', async () => {
        expect(await evaluateAsync('8 < 4')).toBe(false)
        expect(await evaluateAsync('3 < 5')).toBe(true)
        expect(await evaluateAsync('5 < 5')).toBe(false)
      })

      it('should throw when the expression is missing an operand', async () => {
        expect(async () =>
          parseAsync('a <')
        ).rejects.toThrowErrorMatchingSnapshot()
      })
    })

    describe('> (Greater than)', () => {
      it('should compare numbers', async () => {
        expect(await evaluateAsync('8 > 4')).toBe(true)
        expect(await evaluateAsync('3 > 5')).toBe(false)
        expect(await evaluateAsync('5 > 5')).toBe(false)
      })

      it('should throw when the expression is missing an operand', async () => {
        expect(async () =>
          parseAsync('a >')
        ).rejects.toThrowErrorMatchingSnapshot()
      })
    })

    describe('<= (Less than or equal to)', () => {
      it('should compare numbers', async () => {
        expect(await evaluateAsync('8 <= 4')).toBe(false)
        expect(await evaluateAsync('3 <= 5')).toBe(true)
        expect(await evaluateAsync('5 <= 5')).toBe(true)
      })

      it('should throw when the expression is missing an operand', async () => {
        expect(async () =>
          parseAsync('a <=')
        ).rejects.toThrowErrorMatchingSnapshot()
      })
    })

    describe('>= (Greater than or equal to)', () => {
      it('should compare numbers', async () => {
        expect(await evaluateAsync('8 >= 4')).toBe(true)
        expect(await evaluateAsync('3 >= 5')).toBe(false)
        expect(await evaluateAsync('5 >= 5')).toBe(true)
      })

      it('should throw when the expression is missing an operand', async () => {
        expect(async () =>
          parseAsync('a >=')
        ).rejects.toThrowErrorMatchingSnapshot()
      })
    })

    describe('== (Equality)', () => {
      it('should compare numbers', async () => {
        expect(await evaluateAsync('8 == 4')).toBe(false)
        expect(await evaluateAsync('3 == 5')).toBe(false)
        expect(await evaluateAsync('5 == 5')).toBe(true)
      })

      it('should compare strings', async () => {
        expect(await evaluateAsync("'1' == '1'")).toBe(true)
        expect(await evaluateAsync("'1' == '2'")).toBe(false)
      })

      it('should compare objects', async () => {
        expect(await evaluateAsync("{ x: '1' } == { x: '1' }")).toBe(false)
      })

      it('should compare null and undefined', async () => {
        expect(await evaluateAsync('null == undefined')).toBe(true)
      })

      it('should throw when the expression is missing an operand', async () => {
        expect(async () =>
          parseAsync('a ==')
        ).rejects.toThrowErrorMatchingSnapshot()
      })
    })

    describe('!= (Inequality)', () => {
      it('should compare numbers', async () => {
        expect(await evaluateAsync('8 != 4')).toBe(true)
        expect(await evaluateAsync('3 != 5')).toBe(true)
        expect(await evaluateAsync('5 != 5')).toBe(false)
      })

      it('should compare strings', async () => {
        expect(await evaluateAsync("'1' != '1'")).toBe(false)
        expect(await evaluateAsync("'1' != '2'")).toBe(true)
      })

      it('should compare objects', async () => {
        expect(await evaluateAsync("{ x: '1' } != { x: '1' }")).toBe(true)
      })

      it('should compare null and undefined', async () => {
        expect(await evaluateAsync('undefined != null')).toBe(false)
      })

      it('should throw when the expression is missing an operand', async () => {
        expect(async () =>
          parseAsync('a !=')
        ).rejects.toThrowErrorMatchingSnapshot()
      })
    })

    describe('=== (Identity)', () => {
      it('should compare numbers', async () => {
        expect(await evaluateAsync('8 === 4')).toBe(false)
        expect(await evaluateAsync('3 === 5')).toBe(false)
        expect(await evaluateAsync('5 === 5')).toBe(true)
      })

      it('should compare strings', async () => {
        expect(await evaluateAsync("'1' === '1'")).toBe(true)
        expect(await evaluateAsync("'1' === '2'")).toBe(false)
      })

      it('should compare objects', async () => {
        expect(await evaluateAsync("{ x: '1' } === { x: '1' }")).toBe(false)
      })

      it('should compare null and undefined', async () => {
        expect(await evaluateAsync('undefined === null')).toBe(false)
      })

      it('should throw when the expression is missing an operand', async () => {
        expect(async () =>
          parseAsync('a ===')
        ).rejects.toThrowErrorMatchingSnapshot()
      })
    })

    describe('!== (Non-identity)', () => {
      it('should compare numbers', async () => {
        expect(await evaluateAsync('8 !== 4')).toBe(true)
        expect(await evaluateAsync('3 !== 5')).toBe(true)
        expect(await evaluateAsync('5 !== 5')).toBe(false)
      })

      it('should compare strings', async () => {
        expect(await evaluateAsync("'1' !== '1'")).toBe(false)
        expect(await evaluateAsync("'1' !== '2'")).toBe(true)
      })

      it('should compare objects', async () => {
        expect(await evaluateAsync("{ x: '1' } !== { x: '1' }")).toBe(true)
      })

      it('should compare null and undefined', async () => {
        expect(await evaluateAsync('undefined !== null')).toBe(true)
      })

      it('should throw when the expression is missing an operand', async () => {
        expect(async () =>
          parseAsync('a !==')
        ).rejects.toThrowErrorMatchingSnapshot()
      })
    })

    describe('& (Bitwise AND)', () => {
      it('should bitwise AND integers', async () => {
        expect(await evaluateAsync('5 & 3')).toBe(1)
      })

      it('should throw when the expression is missing an operand', async () => {
        expect(async () =>
          parseAsync('a &')
        ).rejects.toThrowErrorMatchingSnapshot()
      })
    })

    describe('| (Bitwise OR)', () => {
      it('should bitwise OR integers', async () => {
        expect(await evaluateAsync('5 | 3')).toBe(7)
      })

      it('should throw when the expression is missing an operand', async () => {
        expect(async () =>
          parseAsync('a |')
        ).rejects.toThrowErrorMatchingSnapshot()
      })
    })

    describe('^ (Bitwise XOR)', () => {
      it('should bitwise XOR integers', async () => {
        expect(await evaluateAsync('5 ^ 3')).toBe(6)
      })

      it('should throw when the expression is missing an operand', async () => {
        expect(async () =>
          parseAsync('a ^')
        ).rejects.toThrowErrorMatchingSnapshot()
      })
    })

    describe('<< (Bitwise Left Shift)', () => {
      it('should shift integer to the left', async () => {
        expect(await evaluateAsync('5 << 1')).toBe(10)
      })

      it('should throw when the expression is missing an operand', async () => {
        expect(async () =>
          parseAsync('a <<')
        ).rejects.toThrowErrorMatchingSnapshot()
      })
    })

    describe('>> (Bitwise Right Shift)', () => {
      it('should shift integer to the right', async () => {
        expect(await evaluateAsync('5 >> 1')).toBe(2)
      })

      it('should throw when the expression is missing an operand', async () => {
        expect(async () =>
          parseAsync('a >>')
        ).rejects.toThrowErrorMatchingSnapshot()
      })
    })

    describe('>>> (Bitwise Unsigned Right Shift)', () => {
      it('should unsigned shift integer to the right', async () => {
        expect(await evaluateAsync('5 >>> 1')).toBe(2)
      })

      it('should throw when the expression is missing an operand', async () => {
        expect(async () =>
          parseAsync('a >>>')
        ).rejects.toThrowErrorMatchingSnapshot()
      })
    })

    describe('in (Property Membership)', () => {
      const options = {
        operators: {
          binary: { allow: ['in'] },
        },
      }

      it('should check if a property is in an object', async () => {
        expect(await evaluateAsync('"x" in { x: 1 }', options)).toBe(true)
        expect(await evaluateAsync('"y" in { x: 1 }', options)).toBe(false)
      })

      it('should throw when the expression is missing an operand', async () => {
        expect(async () =>
          parseAsync('a in', options)
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('in a', options)
        ).rejects.toThrowErrorMatchingSnapshot()
      })
    })

    describe('instanceof (Prototype Check)', () => {
      class Foo {
        x = 5
      }

      class Bar extends Foo {}

      const foo = new Foo()
      const bar = new Bar()

      const baseOptions = {
        operators: {
          binary: { allow: ['instanceof'] },
        },
        scope: {
          foo,
          bar,
          Foo,
          Bar,
        },
      }

      it('should check if an object is an instance of a constructor', async () => {
        expect(await evaluateAsync('foo instanceof Foo', baseOptions)).toBe(
          true
        )
        expect(await evaluateAsync('bar instanceof Foo', baseOptions)).toBe(
          true
        )
        expect(await evaluateAsync('foo instanceof Bar', baseOptions)).toBe(
          false
        )
        expect(await evaluateAsync('bar instanceof Bar', baseOptions)).toBe(
          true
        )
      })

      it('should throw when the expression is missing an operand', async () => {
        expect(async () =>
          parseAsync('a instanceof', baseOptions)
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('instanceof a', baseOptions)
        ).rejects.toThrowErrorMatchingSnapshot()
      })
    })

    describe('=, +=, -=, ... (Assignment)', () => {
      it('should throw an error', async () => {
        expect(async () =>
          parseAsync('a = 2')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('a += 2')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('a -= 2')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('a *= 2')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('a /= 2')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('a %= 2')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('a **= 2')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('a <<= 2')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('a >>= 2')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('a >>>= 2')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('a &= 2')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('a ^= 2')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('a |= 2')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('a &&= 2')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('a ||= 2')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('a ??= 2')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('a++')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('a--')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('--a')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('++a')
        ).rejects.toThrowErrorMatchingSnapshot()
      })

      it('should throw when the expression is missing an operand', async () => {
        expect(async () =>
          parseAsync('a =')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('a +=')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('a -=')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('a *=')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('a /=')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('a %=')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('a **=')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('a <<=')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('a >>=')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('a >>>=')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('a &=')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('a ^=')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('a |=')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('a &&=')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('a ||=')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('a ??=')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('++')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('--')
        ).rejects.toThrowErrorMatchingSnapshot()
      })
    })

    describe('++, -- (Increment, Decrement)', () => {
      it('should throw an error', async () => {
        expect(async () =>
          parseAsync('a++')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('a--')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('--a')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('++a')
        ).rejects.toThrowErrorMatchingSnapshot()
      })

      it('should throw when the expression is missing an operand', async () => {
        expect(async () =>
          parseAsync('++')
        ).rejects.toThrowErrorMatchingSnapshot()
        expect(async () =>
          parseAsync('--')
        ).rejects.toThrowErrorMatchingSnapshot()
      })
    })
  })

  describe('Logical Operators', () => {
    describe('&& (Logical AND)', () => {
      it('should compare booleans', async () => {
        expect(await evaluateAsync('false && false')).toBe(false)
        expect(await evaluateAsync('false && true')).toBe(false)
        expect(await evaluateAsync('true && false')).toBe(false)
        expect(await evaluateAsync('true && true')).toBe(true)
      })

      it('should compare numbers', async () => {
        expect(await evaluateAsync('0 && 0')).toBe(0)
        expect(await evaluateAsync('0 && 1')).toBe(0)
        expect(await evaluateAsync('1 && 0')).toBe(0)
        expect(await evaluateAsync('1 && 1')).toBe(1)
      })

      it('should compare strings', async () => {
        expect(await evaluateAsync("'' && ''")).toBe('')
        expect(await evaluateAsync("'' && '1'")).toBe('')
        expect(await evaluateAsync("'1' && ''")).toBe('')
        expect(await evaluateAsync("'1' && '1'")).toBe('1')
      })

      it('should compare null and undefined', async () => {
        expect(await evaluateAsync('null && undefined')).toBe(null)
        expect(await evaluateAsync('undefined && null')).toBe(undefined)
        expect(await evaluateAsync("null && 'x'")).toBe(null)
        expect(await evaluateAsync("undefined && 'x'")).toBe(undefined)
        expect(await evaluateAsync("'x' && null")).toBe(null)
        expect(await evaluateAsync("'x' && undefined")).toBe(undefined)
      })

      it('should throw when the expression is missing an operand', async () => {
        expect(async () =>
          parseAsync('a &&')
        ).rejects.toThrowErrorMatchingSnapshot()
      })
    })

    describe('|| (Logical OR)', () => {
      it('should compare booleans', async () => {
        expect(await evaluateAsync('false || false')).toBe(false)
        expect(await evaluateAsync('false || true')).toBe(true)
        expect(await evaluateAsync('true || false')).toBe(true)
        expect(await evaluateAsync('true || true')).toBe(true)
      })

      it('should compare numbers', async () => {
        expect(await evaluateAsync('0 || 0')).toBe(0)
        expect(await evaluateAsync('0 || 1')).toBe(1)
        expect(await evaluateAsync('1 || 0')).toBe(1)
        expect(await evaluateAsync('1 || 1')).toBe(1)
      })

      it('should compare strings', async () => {
        expect(await evaluateAsync("'' || ''")).toBe('')
        expect(await evaluateAsync("'' || '1'")).toBe('1')
        expect(await evaluateAsync("'1' || ''")).toBe('1')
        expect(await evaluateAsync("'1' || '1'")).toBe('1')
      })

      it('should compare null and undefined', async () => {
        expect(await evaluateAsync('null || undefined')).toBe(undefined)
        expect(await evaluateAsync('undefined || null')).toBe(null)
        expect(await evaluateAsync("null || 'x'")).toBe('x')
        expect(await evaluateAsync("undefined || 'x'")).toBe('x')
        expect(await evaluateAsync("'x' || null")).toBe('x')
        expect(await evaluateAsync("'x' || undefined")).toBe('x')
      })

      it('should throw when the expression is missing an operand', async () => {
        expect(async () =>
          parseAsync('a ||')
        ).rejects.toThrowErrorMatchingSnapshot()
      })
    })

    describe('?? (Null coalescing)', () => {
      it('should return the first value if it is not null or undefined', async () => {
        expect(await evaluateAsync('1 ?? 2')).toBe(1)
        expect(await evaluateAsync('"x" ?? 2')).toBe('x')
        expect(await evaluateAsync('x ?? 2', { scope: { x: 1 } })).toBe(1)
      })

      it('should return the second value if the first is null', async () => {
        expect(await evaluateAsync('null ?? 2')).toBe(2)
        expect(await evaluateAsync('null ?? null')).toBe(null)
        expect(await evaluateAsync('null ?? undefined')).toBe(undefined)
        expect(await evaluateAsync('x ?? 2', { scope: { x: null } })).toBe(2)
      })

      it('should return the second value if the first is undefined', async () => {
        expect(await evaluateAsync('undefined ?? 2')).toBe(2)
        expect(await evaluateAsync('undefined ?? null')).toBe(null)
        expect(await evaluateAsync('undefined ?? undefined')).toBe(undefined)
        expect(await evaluateAsync('x ?? 2', { scope: { x: undefined } })).toBe(
          2
        )
      })

      it('should throw when the expression is missing an operand', async () => {
        expect(async () =>
          parseAsync('a ??')
        ).rejects.toThrowErrorMatchingSnapshot()
      })
    })
  })

  describe('?: (Conditional/Ternary)', () => {
    it('should return the first value if the condition is true', async () => {
      expect(await evaluateAsync('true ? 1 : 2')).toBe(1)
      expect(await evaluateAsync('5 === 5 ? 1 : 2')).toBe(1)
      expect(await evaluateAsync('x ? 1 : 2', { scope: { x: true } })).toBe(1)
    })

    it('should return the first value if the condition is truthy', async () => {
      expect(await evaluateAsync('1 ? 1 : 2')).toBe(1)
      expect(await evaluateAsync('x ? 1 : 2', { scope: { x: 1 } })).toBe(1)
      expect(await evaluateAsync('"x" ? 1 : 2')).toBe(1)
      expect(await evaluateAsync('x ? 1 : 2', { scope: { x: 'x' } })).toBe(1)
      expect(await evaluateAsync('{} ? 1 : 2')).toBe(1)
      expect(await evaluateAsync('x ? 1 : 2', { scope: { x: {} } })).toBe(1)
      expect(await evaluateAsync('[] ? 1 : 2')).toBe(1)
      expect(await evaluateAsync('x ? 1 : 2', { scope: { x: [] } })).toBe(1)
    })

    it('should return the second value if the condition is false', async () => {
      expect(await evaluateAsync('false ? 1 : 2')).toBe(2)
      expect(await evaluateAsync('5 !== 5 ? 1 : 2')).toBe(2)
      expect(await evaluateAsync('x ? 1 : 2', { scope: { x: false } })).toBe(2)
    })

    it('should return the second value if the condition is falsy', async () => {
      expect(await evaluateAsync('0 ? 1 : 2')).toBe(2)
      expect(await evaluateAsync('x ? 1 : 2', { scope: { x: 0 } })).toBe(2)
      expect(await evaluateAsync('0n ? 1 : 2')).toBe(2)
      expect(await evaluateAsync('x ? 1 : 2', { scope: { x: 0n } })).toBe(2)
      expect(await evaluateAsync('NaN ? 1 : 2')).toBe(2)
      expect(await evaluateAsync('x ? 1 : 2', { scope: { x: NaN } })).toBe(2)
      expect(await evaluateAsync('"" ? 1 : 2')).toBe(2)
      expect(await evaluateAsync('x ? 1 : 2', { scope: { x: '' } })).toBe(2)
      expect(await evaluateAsync('null ? 1 : 2')).toBe(2)
      expect(await evaluateAsync('x ? 1 : 2', { scope: { x: null } })).toBe(2)
      expect(await evaluateAsync('undefined ? 1 : 2')).toBe(2)
      expect(
        await evaluateAsync('x ? 1 : 2', { scope: { x: undefined } })
      ).toBe(2)
    })

    it('should throw when the expression is missing an operand', async () => {
      expect(async () =>
        parseAsync('a ?')
      ).rejects.toThrowErrorMatchingSnapshot()
    })
  })

  describe('Ordering', () => {
    it('should follow the order of operations', async () => {
      expect(await evaluateAsync('24 / 6 * 2 + 4 / 2')).toBe(10)
      expect(await evaluateAsync('(24 / (6 * 2) + 4) / 2')).toBe(3)
    })
  })

  it('should throw when the expression contains an invalid operator', async () => {
    expect(async () =>
      parseAsync('a /// b')
    ).rejects.toThrowErrorMatchingSnapshot()
    expect(async () =>
      parseAsync('a _ b')
    ).rejects.toThrowErrorMatchingSnapshot()
  })
})
