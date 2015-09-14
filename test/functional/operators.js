/* global describe, it */

var chai = require('chai')
var expect = chai.expect

var jshiki = require('../../index')

var jeval = (expression, scope) =>
  jshiki.parse(expression, { scope: scope }).eval()

describe('Operators', () => {
  describe('Unary Operators', () => {
    describe('+ (Unary plus)', () => {
      it('should convert to numbers', () => {
        expect(jeval('+5')).to.equal(+5)
        expect(jeval("+'5'")).to.equal(+'5')
        expect(jeval('+true')).to.equal(+true)
        expect(jeval('+false')).to.equal(+false)
        expect(jeval('+null')).to.equal(+null)
      })
    })

    describe('- (Unary negation)', () => {
      it('should negate numbers', () => {
        expect(jeval('-5')).to.equal(-5)
      })
    })

    describe('! (Logical NOT)', () => {
      it('should negate expressions', () => {
        expect(jeval('!true')).to.equal(!true)
        expect(jeval('!false')).to.equal(!false)
        expect(jeval('!1')).to.equal(!1)
        expect(jeval('!0')).to.equal(!0)
        expect(jeval('!!true')).to.equal(!!true)
        expect(jeval('!!false')).to.equal(!!false)
        expect(jeval('!!1')).to.equal(!!1)
        expect(jeval('!!0')).to.equal(!!0)
      })
    })
  })

  describe('Binary Operators', () => {
    describe('+ (Addition)', () => {
      it('should add integers', () => {
        expect(jeval('5 + 3')).to.equal(5 + 3)
      })

      it('should add floating-point numbers', () => {
        expect(jeval('5.2 + 3.8')).to.equal(5.2 + 3.8)
      })

      it('should concatenate strings', () => {
        expect(jeval("'x' + 'y'")).to.equal('x' + 'y')
      })
    })

    describe('- (Subtraction)', () => {
      it('should subtract integers using -', () => {
        expect(jeval('5 - 3')).to.equal(5 - 3)
      })

      it('should subtract floating-point numbers using -', () => {
        expect(jeval('5.5 - 3.2')).to.equal(5.5 - 3.2)
      })
    })

    describe('* (Multiplication)', () => {
      it('should multiply integers', () => {
        expect(jeval('5 * 3')).to.equal(5 * 3)
      })

      it('should multiply floating-point numbers', () => {
        expect(jeval('5.4 * 3.6')).to.equal(5.4 * 3.6)
      })
    })

    describe('/ (Division)', () => {
      it('should divide integers', () => {
        expect(jeval('8 / 4')).to.equal(8 / 4)
        expect(jeval('5 / 3')).to.equal(5 / 3)
      })

      it('should divide floating-point numbers', () => {
        expect(jeval('8.2 / 4.2')).to.equal(8.2 / 4.2)
        expect(jeval('5.5 / 3.5')).to.equal(5.5 / 3.5)
      })
    })

    describe('% (Modulo)', () => {
      it('should perform modulo on integers', () => {
        expect(jeval('8 % 4')).to.equal(8 % 4)
        expect(jeval('5 % 3')).to.equal(5 % 3)
      })
    })

    describe('< (Less than)', () => {
      it('should compare numbers', () => {
        expect(jeval('8 < 4')).to.equal(8 < 4)
        expect(jeval('3 < 5')).to.equal(3 < 5)
        /* eslint-disable no-self-compare */
        expect(jeval('5 < 5')).to.equal(5 < 5)
        /* eslint-enable no-self-compare */
      })
    })

    describe('> (Greater than)', () => {
      it('should compare numbers', () => {
        expect(jeval('8 > 4')).to.equal(8 > 4)
        expect(jeval('3 > 5')).to.equal(3 > 5)
        /* eslint-disable no-self-compare */
        expect(jeval('5 > 5')).to.equal(5 > 5)
        /* eslint-enable no-self-compare */
      })
    })

    describe('<= (Less than or equal to)', () => {
      it('should compare numbers', () => {
        expect(jeval('8 <= 4')).to.equal(8 <= 4)
        expect(jeval('3 <= 5')).to.equal(3 <= 5)
        /* eslint-disable no-self-compare */
        expect(jeval('5 <= 5')).to.equal(5 <= 5)
        /* eslint-enable no-self-compare */
      })
    })

    describe('>= (Greater than or equal to)', () => {
      it('should compare numbers', () => {
        expect(jeval('8 >= 4')).to.equal(8 >= 4)
        expect(jeval('3 >= 5')).to.equal(3 >= 5)
        /* eslint-disable no-self-compare */
        expect(jeval('5 >= 5')).to.equal(5 >= 5)
        /* eslint-enable no-self-compare */
      })
    })

    /* eslint-disable eqeqeq */
    describe('== (Equality)', () => {
      it('should compare numbers', () => {
        expect(jeval('8 == 4')).to.equal(8 == 4)
        expect(jeval('3 == 5')).to.equal(3 == 5)
        /* eslint-disable no-self-compare */
        expect(jeval('5 == 5')).to.equal(5 == 5)
        /* eslint-enable no-self-compare */
      })

      it('should compare strings', () => {
        /* eslint-disable no-self-compare */
        expect(jeval("'1' == '1'")).to.equal('1' == '1')
        /* eslint-enable no-self-compare */
        expect(jeval("'1' == '2'")).to.equal('1' == '2')
      })

      it('should compare objects', () => {
        expect(jeval("{ x: '1' } == { x: '1' }")).to.equal(
          { x: '1' } == { x: '1' }
        )
      })

      it('should compare null and undefined', () => {
        /* eslint-disable yoda */
        expect(jeval('null == undefined')).to.equal(null == undefined)
        /* eslint-enable yoda */
      })
    })

    describe('!= (Inequality)', () => {
      it('should compare numbers', () => {
        expect(jeval('8 != 4')).to.equal(8 != 4)
        expect(jeval('3 != 5')).to.equal(3 != 5)
        /* eslint-disable no-self-compare */
        expect(jeval('5 != 5')).to.equal(5 != 5)
        /* eslint-enable no-self-compare */
      })

      it('should compare strings', () => {
        /* eslint-disable no-self-compare */
        expect(jeval("'1' != '1'")).to.equal('1' != '1')
        /* eslint-enable no-self-compare */
        expect(jeval("'1' != '2'")).to.equal('1' != '2')
      })

      it('should compare objects', () => {
        expect(jeval("{ x: '1' } != { x: '1' }")).to.equal(
          { x: '1' } != { x: '1' }
        )
      })

      it('should compare null and undefined', () => {
        expect(jeval('undefined != null')).to.equal(undefined != null)
      })
    })
    /* eslint-enable eqeqeq */

    describe('=== (Identity)', () => {
      it('should compare numbers', () => {
        expect(jeval('8 === 4')).to.equal(8 === 4)
        expect(jeval('3 === 5')).to.equal(3 === 5)
        /* eslint-disable no-self-compare */
        expect(jeval('5 === 5')).to.equal(5 === 5)
        /* eslint-enable no-self-compare */
      })

      it('should compare strings', () => {
        /* eslint-disable no-self-compare */
        expect(jeval("'1' === '1'")).to.equal('1' === '1')
        expect(jeval("'1' === '2'")).to.equal('1' === '2')
      })

      it('should compare objects', () => {
        expect(jeval("{ x: '1' } === { x: '1' }")).to.equal(
          { x: '1' } === { x: '1' }
        )
      })

      it('should compare null and undefined', () => {
        expect(jeval('undefined === null')).to.equal(undefined === null)
      })
    })

    describe('!== (Non-identity)', () => {
      it('should compare numbers', () => {
        expect(jeval('8 !== 4')).to.equal(8 !== 4)
        expect(jeval('3 !== 5')).to.equal(3 !== 5)
        /* eslint-disable no-self-compare */
        expect(jeval('5 !== 5')).to.equal(5 !== 5)
        /* eslint-enable no-self-compare */
      })

      it('should compare strings', () => {
        /* eslint-disable no-self-compare */
        expect(jeval("'1' !== '1'")).to.equal('1' !== '1')
        /* eslint-enable no-self-compare */
        expect(jeval("'1' !== '2'")).to.equal('1' !== '2')
      })

      it('should compare objects', () => {
        expect(jeval("{ x: '1' } !== { x: '1' }")).to.equal(
          { x: '1' } !== { x: '1' }
        )
      })

      it('should compare null and undefined', () => {
        expect(jeval('undefined !== null')).to.equal(undefined !== null)
      })
    })

    describe('&& (Logical AND)', () => {
      it('should compare booleans', () => {
        /* eslint-disable no-self-compare */
        expect(jeval('false && false')).to.equal(false && false)
        /* eslint-enable no-self-compare */
        expect(jeval('false && true')).to.equal(false && true)
        expect(jeval('true && false')).to.equal(true && false)
        /* eslint-disable no-self-compare */
        expect(jeval('true && true')).to.equal(true && true)
        /* eslint-enable no-self-compare */
      })

      it('should compare numbers', () => {
        /* eslint-disable no-self-compare */
        expect(jeval('0 && 0')).to.equal(0 && 0)
        /* eslint-enable no-self-compare */
        expect(jeval('0 && 1')).to.equal(0 && 1)
        expect(jeval('1 && 0')).to.equal(1 && 0)
        /* eslint-disable no-self-compare */
        expect(jeval('1 && 1')).to.equal(1 && 1)
        /* eslint-enable no-self-compare */
      })

      it('should compare strings', () => {
        /* eslint-disable no-self-compare */
        expect(jeval("'' && ''")).to.equal('' && '')
        /* eslint-enable no-self-compare */
        expect(jeval("'' && '1'")).to.equal('' && '1')
        expect(jeval("'1' && ''")).to.equal('1' && '')
        /* eslint-disable no-self-compare */
        expect(jeval("'1' && '1'")).to.equal('1' && '1')
        /* eslint-enable no-self-compare */
      })

      it('should compare null and undefined', () => {
        /* eslint-disable yoda */
        expect(jeval('null && undefined')).to.equal(null && undefined)
        /* eslint-enable yoda */
        expect(jeval('undefined && null')).to.equal(undefined && null)
        expect(jeval("null && 'x'")).to.equal(null && 'x')
        expect(jeval("undefined && 'x'")).to.equal(undefined && 'x')
        expect(jeval("'x' && null")).to.equal('x' && null)
        expect(jeval("'x' && undefined")).to.equal('x' && undefined)
      })
    })

    describe('|| (Logical OR)', () => {
      it('should compare booleans', () => {
        /* eslint-disable no-self-compare */
        expect(jeval('false || false')).to.equal(false || false)
        /* eslint-enable no-self-compare */
        expect(jeval('false || true')).to.equal(false || true)
        expect(jeval('true || false')).to.equal(true || false)
        /* eslint-disable no-self-compare */
        expect(jeval('true || true')).to.equal(true || true)
        /* eslint-enable no-self-compare */
      })

      it('should compare numbers', () => {
        /* eslint-disable no-self-compare */
        expect(jeval('0 || 0')).to.equal(0 || 0)
        /* eslint-enable no-self-compare */
        expect(jeval('0 || 1')).to.equal(0 || 1)
        expect(jeval('1 || 0')).to.equal(1 || 0)
        /* eslint-disable no-self-compare */
        expect(jeval('1 || 1')).to.equal(1 || 1)
        /* eslint-enable no-self-compare */
      })

      it('should compare strings', () => {
        /* eslint-disable no-self-compare */
        expect(jeval("'' || ''")).to.equal('' || '')
        /* eslint-enable no-self-compare */
        expect(jeval("'' || '1'")).to.equal('' || '1')
        expect(jeval("'1' || ''")).to.equal('1' || '')
        /* eslint-disable no-self-compare */
        expect(jeval("'1' || '1'")).to.equal('1' || '1')
        /* eslint-enable no-self-compare */
      })

      it('should compare null and undefined', () => {
        /* eslint-disable yoda */
        expect(jeval('null || undefined')).to.equal(null || undefined)
        /* eslint-enable yoda */
        expect(jeval('undefined || null')).to.equal(undefined || null)
        expect(jeval("null || 'x'")).to.equal(null || 'x')
        expect(jeval("undefined || 'x'")).to.equal(undefined || 'x')
        expect(jeval("'x' || null")).to.equal('x' || null)
        expect(jeval("'x' || undefined")).to.equal('x' || undefined)
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
      expect(jeval('24 / 6 * 2 + 4 / 2')).to.equal(
        24 / 6 * 2 + 4 / 2
      )
      expect(jeval('(24 / (6 * 2) + 4) / 2')).to.equal(
        (24 / (6 * 2) + 4) / 2
      )
    })
  })
})
