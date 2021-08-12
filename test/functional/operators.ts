import { evaluate } from '../../src'

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
    })

    describe('- (Subtraction)', () => {
      it('should subtract integers', () => {
        expect(evaluate('5 - 3')).toBe(2)
      })

      it('should subtract floating-point numbers', () => {
        expect(evaluate('5.5 - 3.2')).toBe(2.3)
      })
    })

    describe('* (Multiplication)', () => {
      it('should multiply integers', () => {
        expect(evaluate('5 * 3')).toBe(15)
      })

      it('should multiply floating-point numbers', () => {
        expect(evaluate('5.4 * 3.6')).toBe(19.44)
      })
    })

    describe('** (Exponential)', () => {
      it('should raise first operand to power of second operand', () => {
        expect(evaluate('5 ** 3')).toBe(125)
      })

      it('should exponentiate floating-point numbers', () => {
        expect(evaluate('2.1 ** 3.5')).toBe(2.1 ** 3.5)
      })
    })

    describe('/ (Division)', () => {
      it('should divide integers', () => {
        expect(evaluate('8 / 4')).toBe(2)
        expect(evaluate('5 / 3')).toBe(5 / 3)
      })

      it('should divide floating-point numbers', () => {
        expect(evaluate('8.2 / 4.2')).toBe(8.2 / 4.2)
        expect(evaluate('5.5 / 3.5')).toBe(5.5 / 3.5)
      })
    })

    describe('% (Modulo)', () => {
      it('should perform modulo on integers', () => {
        expect(evaluate('8 % 4')).toBe(0)
        expect(evaluate('5 % 3')).toBe(2)
      })
    })

    describe('< (Less than)', () => {
      it('should compare numbers', () => {
        expect(evaluate('8 < 4')).toBe(false)
        expect(evaluate('3 < 5')).toBe(true)
        expect(evaluate('5 < 5')).toBe(false)
      })
    })

    describe('> (Greater than)', () => {
      it('should compare numbers', () => {
        expect(evaluate('8 > 4')).toBe(true)
        expect(evaluate('3 > 5')).toBe(false)
        expect(evaluate('5 > 5')).toBe(false)
      })
    })

    describe('<= (Less than or equal to)', () => {
      it('should compare numbers', () => {
        expect(evaluate('8 <= 4')).toBe(false)
        expect(evaluate('3 <= 5')).toBe(true)
        expect(evaluate('5 <= 5')).toBe(true)
      })
    })

    describe('>= (Greater than or equal to)', () => {
      it('should compare numbers', () => {
        expect(evaluate('8 >= 4')).toBe(true)
        expect(evaluate('3 >= 5')).toBe(false)
        expect(evaluate('5 >= 5')).toBe(true)
      })
    })

    /* eslint-disable eqeqeq */
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
    })
    /* eslint-enable eqeqeq */

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
    })

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
    })

    describe('& (Bitwise AND)', () => {
      it('should bitwise AND integers', () => {
        expect(evaluate('5 & 3')).toBe(1)
      })
    })

    describe('| (Bitwise OR)', () => {
      it('should bitwise OR integers', () => {
        expect(evaluate('5 | 3')).toBe(7)
      })
    })

    describe('^ (Bitwise XOR)', () => {
      it('should bitwise XOR integers', () => {
        expect(evaluate('5 ^ 3')).toBe(6)
      })
    })

    describe('<< (Bitwise Left Shift)', () => {
      it('should shift integer to the left', () => {
        expect(evaluate('5 << 1')).toBe(10)
      })
    })

    describe('>> (Bitwise Right Shift)', () => {
      it('should shift integer to the right', () => {
        expect(evaluate('5 >> 1')).toBe(2)
      })
    })

    describe('>>> (Bitwise Unsigned Right Shift)', () => {
      it('should unsigned shift integer to the right', () => {
        expect(evaluate('5 >>> 1')).toBe(2)
      })
    })

    describe('= (Assignment)', () => {
      it('should throw an error', () => {
        expect(() => evaluate('x = 5')).toThrowErrorMatchingSnapshot()
      })
    })
  })

  describe('Ordering', () => {
    it('should follow the order of operations', () => {
      expect(evaluate('24 / 6 * 2 + 4 / 2')).toBe(10)
      expect(evaluate('(24 / (6 * 2) + 4) / 2')).toBe(3)
    })
  })
})
