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
      expect(operators.unary['+'](-5)).to.equal(-5)
    })

    it('should export -', () => {
      expect(operators.unary).to.include.keys('+')
      expect(operators.unary['-'](5)).to.equal(-5)
    })

    it('should export !', () => {
      expect(operators.unary).to.include.keys('!')
      expect(operators.unary['!'](true)).to.equal(false)
    })
  })

  describe('Binary operators', () => {
    it('should export +', () => {
      expect(operators.binary).to.include.keys('+')
      expect(operators.binary['+'](5, 3)).to.equal(8)
      expect(operators.binary['+']('1', '2')).to.equal('12')
    })

    it('should export -', () => {
      expect(operators.binary).to.include.keys('-')
      expect(operators.binary['-'](5, 3)).to.equal(2)
    })

    it('should export *', () => {
      expect(operators.binary).to.include.keys('*')
      expect(operators.binary['*'](5, 3)).to.equal(15)
    })

    it('should export /', () => {
      expect(operators.binary).to.include.keys('/')
      expect(operators.binary['/'](8, 4)).to.equal(2)
    })

    it('should export %', () => {
      expect(operators.binary).to.include.keys('%')
      expect(operators.binary['%'](8, 4)).to.equal(0)
      expect(operators.binary['%'](5, 3)).to.equal(2)
    })

    it('should export <', () => {
      expect(operators.binary).to.include.keys('<')
      expect(operators.binary['<'](8, 4)).to.equal(false)
    })

    it('should export >', () => {
      expect(operators.binary).to.include.keys('>')
      expect(operators.binary['>'](8, 4)).to.equal(true)
    })

    it('should export <=', () => {
      expect(operators.binary).to.include.keys('<=')
      expect(operators.binary['<='](8, 4)).to.equal(false)
      expect(operators.binary['<='](5, 5)).to.equal(true)
    })

    it('should export >=', () => {
      expect(operators.binary).to.include.keys('<=')
      expect(operators.binary['>='](8, 4)).to.equal(true)
      expect(operators.binary['>='](5, 5)).to.equal(true)
    })

    it('should export ==', () => {
      expect(operators.binary).to.include.keys('==')
      /* eslint-disable eqeqeq */
      expect(operators.binary['=='](8, 4)).to.equal(false)
      expect(operators.binary['=='](5, 5)).to.equal(true)
      expect(operators.binary['==']('1', '1')).to.equal(true)
      expect(operators.binary['==']('1', '2')).to.equal(false)
      var a = { x: '1' }
      var b = { x: '1' }
      var c = a
      expect(operators.binary['=='](a, b)).to.equal(false)
      expect(operators.binary['=='](a, c)).to.equal(true)
      expect(operators.binary['=='](undefined, null)).to.equal(true)
      expect(operators.binary['=='](null, undefined)).to.equal(true)
      /* eslint-enable eqeqeq */
    })

    it('should export !=', () => {
      expect(operators.binary).to.include.keys('!=')
      /* eslint-disable eqeqeq */
      expect(operators.binary['!='](8, 4)).to.equal(true)
      expect(operators.binary['!='](5, 5)).to.equal(false)
      expect(operators.binary['!=']('1', '1')).to.equal(false)
      expect(operators.binary['!=']('1', '2')).to.equal(true)
      var a = { x: '1' }
      var b = { x: '1' }
      var c = a
      expect(operators.binary['!='](a, b)).to.equal(true)
      expect(operators.binary['!='](a, c)).to.equal(false)
      expect(operators.binary['!='](undefined, null)).to.equal(false)
      expect(operators.binary['!='](null, undefined)).to.equal(false)
      /* eslint-enable eqeqeq */
    })

    it('should export ===', () => {
      expect(operators.binary).to.include.keys('===')
      expect(operators.binary['==='](8, 4)).to.equal(false)
      expect(operators.binary['==='](5, 5)).to.equal(true)
      expect(operators.binary['===']('1', '1')).to.equal(true)
      expect(operators.binary['===']('1', '2')).to.equal(false)
      var a = { x: '1' }
      var b = { x: '1' }
      var c = a
      expect(operators.binary['==='](a, b)).to.equal(false)
      expect(operators.binary['==='](a, c)).to.equal(true)
      expect(operators.binary['==='](undefined, null)).to.equal(false)
      expect(operators.binary['==='](null, undefined)).to.equal(false)
    })

    it('should export !==', () => {
      expect(operators.binary).to.include.keys('!==')
      expect(operators.binary['!=='](8, 4)).to.equal(true)
      expect(operators.binary['!=='](5, 5)).to.equal(false)
      expect(operators.binary['!==']('1', '1')).to.equal(false)
      expect(operators.binary['!==']('1', '2')).to.equal(true)
      var a = { x: '1' }
      var b = { x: '1' }
      var c = a
      expect(operators.binary['!=='](a, b)).to.equal(true)
      expect(operators.binary['!=='](a, c)).to.equal(false)
      expect(operators.binary['!=='](undefined, null)).to.equal(true)
      expect(operators.binary['!=='](null, undefined)).to.equal(true)
    })

    it('should export &&', () => {
      expect(operators.binary).to.include.keys('&&')
      expect(operators.binary['&&'](false, false)).to.equal(false)
      expect(operators.binary['&&'](false, true)).to.equal(false)
      expect(operators.binary['&&'](true, false)).to.equal(false)
      expect(operators.binary['&&'](true, true)).to.equal(true)
      expect(operators.binary['&&'](0, 0)).to.equal(0)
      expect(operators.binary['&&'](0, 1)).to.equal(0)
      expect(operators.binary['&&'](1, 0)).to.equal(0)
      expect(operators.binary['&&'](1, 1)).to.equal(1)
      expect(operators.binary['&&'](undefined, '1')).to.equal(undefined)
      expect(operators.binary['&&']('', '1')).to.equal('')
      expect(operators.binary['&&']('1', undefined)).to.equal(undefined)
      expect(operators.binary['&&']('1', '')).to.equal('')
    })

    it('should export ||', () => {
      expect(operators.binary).to.include.keys('||')
      expect(operators.binary['||'](false, false)).to.equal(false)
      expect(operators.binary['||'](false, true)).to.equal(true)
      expect(operators.binary['||'](true, false)).to.equal(true)
      expect(operators.binary['||'](true, true)).to.equal(true)
      expect(operators.binary['||'](0, 1)).to.equal(1)
      expect(operators.binary['||'](1, 0)).to.equal(1)
      expect(operators.binary['||'](undefined, '1')).to.equal('1')
      expect(operators.binary['||']('', '1')).to.equal('1')
      expect(operators.binary['||']('1', undefined)).to.equal('1')
      expect(operators.binary['||']('1', '')).to.equal('1')
    })
  })
})
