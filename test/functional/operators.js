/* global describe, it */

const chai = require('chai')
const expect = chai.expect

const jshiki = require('../../index')

const jeval = (expression, scope) =>
  jshiki.parse(expression, { scope: scope }).eval()

describe('Operators', () => {
  describe('Unary Operators', () => {
    describe('+ (Unary plus)', () => {
      it('should convert to numbers', () => {
        expect(jeval('+5')).to.equal(5)
        expect(jeval("+'5'")).to.equal(5)
        expect(jeval('+true')).to.equal(1)
        expect(jeval('+false')).to.equal(0)
        expect(jeval('+null')).to.equal(0)
      })
    })

    describe('- (Unary negation)', () => {
      it('should negate numbers', () => {
        expect(jeval('-5')).to.equal(-5)
      })
    })

    describe('! (Logical NOT)', () => {
      it('should negate expressions', () => {
        expect(jeval('!true')).to.equal(false)
        expect(jeval('!false')).to.equal(true)
        expect(jeval('!1')).to.equal(false)
        expect(jeval('!0')).to.equal(true)
        expect(jeval('!!true')).to.equal(true)
        expect(jeval('!!false')).to.equal(false)
        expect(jeval('!!1')).to.equal(true)
        expect(jeval('!!0')).to.equal(false)
      })
    })

    describe('~ (Bitwise NOT)', () => {
      it('should invert numbers', () => {
        expect(jeval('~5')).to.equal(-6)
        expect(jeval('~-15')).to.equal(14)
      })
    })
  })

  describe('Binary Operators', () => {
    describe('+ (Addition)', () => {
      it('should add integers', () => {
        expect(jeval('5 + 3')).to.equal(8)
      })

      it('should add floating-point numbers', () => {
        expect(jeval('5.2 + 3.8')).to.equal(9)
      })

      it('should concatenate strings', () => {
        expect(jeval("'x' + 'y'")).to.equal('xy')
      })
    })

    describe('- (Subtraction)', () => {
      it('should subtract integers', () => {
        expect(jeval('5 - 3')).to.equal(2)
      })

      it('should subtract floating-point numbers', () => {
        expect(jeval('5.5 - 3.2')).to.equal(2.3)
      })
    })

    describe('* (Multiplication)', () => {
      it('should multiply integers', () => {
        expect(jeval('5 * 3')).to.equal(15)
      })

      it('should multiply floating-point numbers', () => {
        expect(jeval('5.4 * 3.6')).to.equal(19.44)
      })
    })

    describe('** (Exponential)', () => {
      it('should raise first operand to power of second operand', () => {
        expect(jeval('5 ** 3')).to.equal(125)
      })

      it('should exponentiate floating-point numbers', () => {
        expect(jeval('2.1 ** 3.5')).to.equal(2.1 ** 3.5)
      })
    })

    describe('/ (Division)', () => {
      it('should divide integers', () => {
        expect(jeval('8 / 4')).to.equal(2)
        expect(jeval('5 / 3')).to.equal(5 / 3)
      })

      it('should divide floating-point numbers', () => {
        expect(jeval('8.2 / 4.2')).to.equal(8.2 / 4.2)
        expect(jeval('5.5 / 3.5')).to.equal(5.5 / 3.5)
      })
    })

    describe('% (Modulo)', () => {
      it('should perform modulo on integers', () => {
        expect(jeval('8 % 4')).to.equal(0)
        expect(jeval('5 % 3')).to.equal(2)
      })
    })

    describe('< (Less than)', () => {
      it('should compare numbers', () => {
        expect(jeval('8 < 4')).to.equal(false)
        expect(jeval('3 < 5')).to.equal(true)
        expect(jeval('5 < 5')).to.equal(false)
      })
    })

    describe('> (Greater than)', () => {
      it('should compare numbers', () => {
        expect(jeval('8 > 4')).to.equal(true)
        expect(jeval('3 > 5')).to.equal(false)
        expect(jeval('5 > 5')).to.equal(false)
      })
    })

    describe('<= (Less than or equal to)', () => {
      it('should compare numbers', () => {
        expect(jeval('8 <= 4')).to.equal(false)
        expect(jeval('3 <= 5')).to.equal(true)
        expect(jeval('5 <= 5')).to.equal(true)
      })
    })

    describe('>= (Greater than or equal to)', () => {
      it('should compare numbers', () => {
        expect(jeval('8 >= 4')).to.equal(true)
        expect(jeval('3 >= 5')).to.equal(false)
        expect(jeval('5 >= 5')).to.equal(true)
      })
    })

    /* eslint-disable eqeqeq */
    describe('== (Equality)', () => {
      it('should compare numbers', () => {
        expect(jeval('8 == 4')).to.equal(false)
        expect(jeval('3 == 5')).to.equal(false)
        expect(jeval('5 == 5')).to.equal(true)
      })

      it('should compare strings', () => {
        expect(jeval("'1' == '1'")).to.equal(true)
        expect(jeval("'1' == '2'")).to.equal(false)
      })

      it('should compare objects', () => {
        expect(jeval("{ x: '1' } == { x: '1' }")).to.equal(false)
      })

      it('should compare null and undefined', () => {
        expect(jeval('null == undefined')).to.equal(true)
      })
    })

    describe('!= (Inequality)', () => {
      it('should compare numbers', () => {
        expect(jeval('8 != 4')).to.equal(true)
        expect(jeval('3 != 5')).to.equal(true)
        expect(jeval('5 != 5')).to.equal(false)
      })

      it('should compare strings', () => {
        expect(jeval("'1' != '1'")).to.equal(false)
        expect(jeval("'1' != '2'")).to.equal(true)
      })

      it('should compare objects', () => {
        expect(jeval("{ x: '1' } != { x: '1' }")).to.equal(true)
      })

      it('should compare null and undefined', () => {
        expect(jeval('undefined != null')).to.equal(false)
      })
    })
    /* eslint-enable eqeqeq */

    describe('=== (Identity)', () => {
      it('should compare numbers', () => {
        expect(jeval('8 === 4')).to.equal(false)
        expect(jeval('3 === 5')).to.equal(false)
        expect(jeval('5 === 5')).to.equal(true)
      })

      it('should compare strings', () => {
        expect(jeval("'1' === '1'")).to.equal(true)
        expect(jeval("'1' === '2'")).to.equal(false)
      })

      it('should compare objects', () => {
        expect(jeval("{ x: '1' } === { x: '1' }")).to.equal(false)
      })

      it('should compare null and undefined', () => {
        expect(jeval('undefined === null')).to.equal(false)
      })
    })

    describe('!== (Non-identity)', () => {
      it('should compare numbers', () => {
        expect(jeval('8 !== 4')).to.equal(true)
        expect(jeval('3 !== 5')).to.equal(true)
        expect(jeval('5 !== 5')).to.equal(false)
      })

      it('should compare strings', () => {
        expect(jeval("'1' !== '1'")).to.equal(false)
        expect(jeval("'1' !== '2'")).to.equal(true)
      })

      it('should compare objects', () => {
        expect(jeval("{ x: '1' } !== { x: '1' }")).to.equal(true)
      })

      it('should compare null and undefined', () => {
        expect(jeval('undefined !== null')).to.equal(true)
      })
    })

    describe('&& (Logical AND)', () => {
      it('should compare booleans', () => {
        expect(jeval('false && false')).to.equal(false)
        expect(jeval('false && true')).to.equal(false)
        expect(jeval('true && false')).to.equal(false)
        expect(jeval('true && true')).to.equal(true)
      })

      it('should compare numbers', () => {
        expect(jeval('0 && 0')).to.equal(0)
        expect(jeval('0 && 1')).to.equal(0)
        expect(jeval('1 && 0')).to.equal(0)
        expect(jeval('1 && 1')).to.equal(1)
      })

      it('should compare strings', () => {
        expect(jeval("'' && ''")).to.equal('')
        expect(jeval("'' && '1'")).to.equal('')
        expect(jeval("'1' && ''")).to.equal('')
        expect(jeval("'1' && '1'")).to.equal('1')
      })

      it('should compare null and undefined', () => {
        expect(jeval('null && undefined')).to.equal(null)
        expect(jeval('undefined && null')).to.equal(undefined)
        expect(jeval("null && 'x'")).to.equal(null)
        expect(jeval("undefined && 'x'")).to.equal(undefined)
        expect(jeval("'x' && null")).to.equal(null)
        expect(jeval("'x' && undefined")).to.equal(undefined)
      })
    })

    describe('|| (Logical OR)', () => {
      it('should compare booleans', () => {
        expect(jeval('false || false')).to.equal(false)
        expect(jeval('false || true')).to.equal(true)
        expect(jeval('true || false')).to.equal(true)
        expect(jeval('true || true')).to.equal(true)
      })

      it('should compare numbers', () => {
        expect(jeval('0 || 0')).to.equal(0)
        expect(jeval('0 || 1')).to.equal(1)
        expect(jeval('1 || 0')).to.equal(1)
        expect(jeval('1 || 1')).to.equal(1)
      })

      it('should compare strings', () => {
        expect(jeval("'' || ''")).to.equal('')
        expect(jeval("'' || '1'")).to.equal('1')
        expect(jeval("'1' || ''")).to.equal('1')
        expect(jeval("'1' || '1'")).to.equal('1')
      })

      it('should compare null and undefined', () => {
        expect(jeval('null || undefined')).to.equal(undefined)
        expect(jeval('undefined || null')).to.equal(null)
        expect(jeval("null || 'x'")).to.equal('x')
        expect(jeval("undefined || 'x'")).to.equal('x')
        expect(jeval("'x' || null")).to.equal('x')
        expect(jeval("'x' || undefined")).to.equal('x')
      })
    })

    describe('& (Bitwise AND)', () => {
      it('should bitwise AND integers', () => {
        expect(jeval('5 & 3')).to.equal(1)
      })
    })

    describe('| (Bitwise OR)', () => {
      it('should bitwise OR integers', () => {
        expect(jeval('5 | 3')).to.equal(7)
      })
    })

    describe('^ (Bitwise XOR)', () => {
      it('should bitwise XOR integers', () => {
        expect(jeval('5 ^ 3')).to.equal(6)
      })
    })

    describe('<< (Bitwise Left Shift)', () => {
      it('should shift integer to the left', () => {
        expect(jeval('5 << 1')).to.equal(10)
      })
    })

    describe('>> (Bitwise Right Shift)', () => {
      it('should shift integer to the right', () => {
        expect(jeval('5 >> 1')).to.equal(2)
      })
    })

    describe('>>> (Bitwise Unsigned Right Shift)', () => {
      it('should unsigned shift integer to the right', () => {
        expect(jeval('5 >>> 1')).to.equal(2)
      })
    })

    describe('= (Assignment)', () => {
      it('should throw an error', () => {
        expect(() => jeval('x = 5')).to.throw()
      })
    })
  })

  describe('Ordering', () => {
    it('should follow the order of operations', () => {
      expect(jeval('24 / 6 * 2 + 4 / 2')).to.equal(10)
      expect(jeval('(24 / (6 * 2) + 4) / 2')).to.equal(3)
    })
  })
})
