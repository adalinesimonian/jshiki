/* global describe, it */

const expect = require('chai').expect

const operators = require('../../operators')

describe('Operators', () => {
  it('should export a set of unary operators', () => {
    expect(operators).to.include.keys('unary')
  })

  it('should export a set of binary operators', () => {
    expect(operators).to.include.keys('binary')
  })

  describe('Unary operators', () => {
    it('should export +', () => {
      expect(operators.unary).to.include.keys('+')
      expect(operators.unary['+'](-5)).to.equal(+(-5))
    })

    it('should export -', () => {
      expect(operators.unary).to.include.keys('+')
      expect(operators.unary['-'](5)).to.equal(-5)
    })

    it('should export !', () => {
      expect(operators.unary).to.include.keys('!')
      expect(operators.unary['!'](true)).to.equal(!true)
    })
  })

  describe('Binary operators', () => {
    it('should export +', () => {
      expect(operators.binary).to.include.keys('+')
      expect(operators.binary['+'](5, 3)).to.equal(5 + 3)
      expect(operators.binary['+']('1', '2')).to.equal('1' + '2')
    })

    it('should export -', () => {
      expect(operators.binary).to.include.keys('-')
      expect(operators.binary['-'](5, 3)).to.equal(5 - 3)
    })

    it('should export *', () => {
      expect(operators.binary).to.include.keys('*')
      expect(operators.binary['*'](5, 3)).to.equal(5 * 3)
    })

    it('should export /', () => {
      expect(operators.binary).to.include.keys('/')
      expect(operators.binary['/'](8, 4)).to.equal(8 / 4)
    })

    it('should export %', () => {
      expect(operators.binary).to.include.keys('%')
      expect(operators.binary['%'](8, 4)).to.equal(8 % 4)
      expect(operators.binary['%'](5, 3)).to.equal(5 % 3)
    })

    it('should export <', () => {
      expect(operators.binary).to.include.keys('<')
      expect(operators.binary['<'](8, 4)).to.equal(8 < 4)
    })

    it('should export >', () => {
      expect(operators.binary).to.include.keys('>')
      expect(operators.binary['>'](8, 4)).to.equal(8 > 4)
    })

    it('should export <=', () => {
      expect(operators.binary).to.include.keys('<=')
      expect(operators.binary['<='](8, 4)).to.equal(8 <= 4)
      /* eslint-disable no-self-compare */
      expect(operators.binary['<='](5, 5)).to.equal(5 <= 5)
      /* eslint-enable no-self-compare */
    })

    it('should export >=', () => {
      expect(operators.binary).to.include.keys('<=')
      expect(operators.binary['>='](8, 4)).to.equal(8 >= 4)
      /* eslint-disable no-self-compare */
      expect(operators.binary['>='](5, 5)).to.equal(5 >= 5)
      /* eslint-enable no-self-compare */
    })

    it('should export ==', () => {
      expect(operators.binary).to.include.keys('==')
      /* eslint-disable eqeqeq, no-self-compare */
      expect(operators.binary['=='](8, 4)).to.equal(8 == 4)
      expect(operators.binary['=='](5, 5)).to.equal(5 == 5)
      expect(operators.binary['==']('1', '1')).to.equal('1' == '1')
      expect(operators.binary['==']('1', '2')).to.equal('1' == '2')
      var a = { x: '1' }
      var b = { x: '1' }
      var c = a
      expect(operators.binary['=='](a, b)).to.equal(a == b)
      expect(operators.binary['=='](a, c)).to.equal(a == c)
      expect(operators.binary['=='](undefined, null)).to.equal(undefined == null)
      /* eslint-disable yoda */
      expect(operators.binary['=='](null, undefined)).to.equal(null == undefined)
      /* eslint-enable eqeqeq, no-self-compare, yoda */
    })

    it('should export !=', () => {
      expect(operators.binary).to.include.keys('!=')
      /* eslint-disable eqeqeq, no-self-compare */
      expect(operators.binary['!='](8, 4)).to.equal(8 != 4)
      expect(operators.binary['!='](5, 5)).to.equal(5 != 5)
      expect(operators.binary['!=']('1', '1')).to.equal('1' != '1')
      expect(operators.binary['!=']('1', '2')).to.equal('1' != '2')
      var a = { x: '1' }
      var b = { x: '1' }
      var c = a
      expect(operators.binary['!='](a, b)).to.equal(a != b)
      expect(operators.binary['!='](a, c)).to.equal(a != c)
      expect(operators.binary['!='](undefined, null)).to.equal(undefined != null)
      /* eslint-disable yoda */
      expect(operators.binary['!='](null, undefined)).to.equal(null != undefined)
      /* eslint-enable eqeqeq, no-self-compare, yoda */
    })

    it('should export ===', () => {
      expect(operators.binary).to.include.keys('===')
      /* eslint-disable eqeqeq, no-self-compare */
      expect(operators.binary['==='](8, 4)).to.equal(8 === 4)
      expect(operators.binary['==='](5, 5)).to.equal(5 === 5)
      expect(operators.binary['===']('1', '1')).to.equal('1' === '1')
      expect(operators.binary['===']('1', '2')).to.equal('1' === '2')
      var a = { x: '1' }
      var b = { x: '1' }
      var c = a
      expect(operators.binary['==='](a, b)).to.equal(a === b)
      expect(operators.binary['==='](a, c)).to.equal(a === c)
      expect(operators.binary['==='](undefined, null)).to.equal(undefined === null)
      /* eslint-disable yoda */
      expect(operators.binary['==='](null, undefined)).to.equal(null === undefined)
      /* eslint-enable eqeqeq, no-self-compare, yoda */
    })

    it('should export !==', () => {
      expect(operators.binary).to.include.keys('!==')
      /* eslint-disable eqeqeq, no-self-compare */
      expect(operators.binary['!=='](8, 4)).to.equal(8 !== 4)
      expect(operators.binary['!=='](5, 5)).to.equal(5 !== 5)
      expect(operators.binary['!==']('1', '1')).to.equal('1' !== '1')
      expect(operators.binary['!==']('1', '2')).to.equal('1' !== '2')
      var a = { x: '1' }
      var b = { x: '1' }
      var c = a
      expect(operators.binary['!=='](a, b)).to.equal(a !== b)
      expect(operators.binary['!=='](a, c)).to.equal(a !== c)
      expect(operators.binary['!=='](undefined, null)).to.equal(undefined !== null)
      /* eslint-disable yoda */
      expect(operators.binary['!=='](null, undefined)).to.equal(null !== undefined)
      /* eslint-enable eqeqeq, no-self-compare, yoda */
    })

    it('should export &&', () => {
      expect(operators.binary).to.include.keys('&&')
      expect(operators.binary['&&'](false, false)).to.equal(false && false)
      expect(operators.binary['&&'](false, true)).to.equal(false && true)
      expect(operators.binary['&&'](true, false)).to.equal(true && false)
      expect(operators.binary['&&'](true, true)).to.equal(true && true)
      expect(operators.binary['&&'](0, 0)).to.equal(0 && 0)
      expect(operators.binary['&&'](0, 1)).to.equal(0 && 1)
      expect(operators.binary['&&'](1, 0)).to.equal(1 && 0)
      expect(operators.binary['&&'](1, 1)).to.equal(1 && 1)
      expect(operators.binary['&&'](undefined, '1')).to.equal(undefined && '1')
      expect(operators.binary['&&']('', '1')).to.equal('' && '1')
      expect(operators.binary['&&']('1', undefined)).to.equal('1' && undefined)
      expect(operators.binary['&&']('1', '')).to.equal('1' && '')
    })

    it('should export ||', () => {
      expect(operators.binary).to.include.keys('||')
      expect(operators.binary['||'](false, false)).to.equal(false || false)
      expect(operators.binary['||'](false, true)).to.equal(false || true)
      expect(operators.binary['||'](true, false)).to.equal(true || false)
      expect(operators.binary['||'](true, true)).to.equal(true || true)
      expect(operators.binary['||'](0, 1)).to.equal(0 || 1)
      expect(operators.binary['||'](1, 0)).to.equal(1 || 0)
      expect(operators.binary['||'](undefined, '1')).to.equal(undefined || '1')
      expect(operators.binary['||']('', '1')).to.equal('' || '1')
      expect(operators.binary['||']('1', undefined)).to.equal('1' || undefined)
      expect(operators.binary['||']('1', '')).to.equal('1' || '')
    })
  })
})
