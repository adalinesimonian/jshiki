import operators from '../../src/operators'

describe('Operators', () => {
  it('should export a set of unary operators', () => {
    expect(operators).toHaveProperty('unary')
  })

  it('should export a set of binary operators', () => {
    expect(operators).toHaveProperty('binary')
  })

  describe('Unary operators', () => {
    it('should export +', () => {
      expect(operators.unary).toHaveProperty('+')
      expect(operators.unary['+'](-5)).toBe(-5)
    })

    it('should export -', () => {
      expect(operators.unary).toHaveProperty('+')
      expect(operators.unary['-'](5)).toBe(-5)
    })

    it('should export !', () => {
      expect(operators.unary).toHaveProperty('!')
      expect(operators.unary['!'](true)).toBe(false)
    })
  })

  describe('Binary operators', () => {
    it('should export +', () => {
      expect(operators.binary).toHaveProperty('+')
      expect(operators.binary['+'](5, 3)).toBe(8)
      expect(operators.binary['+']('1', '2')).toBe('12')
    })

    it('should export -', () => {
      expect(operators.binary).toHaveProperty('-')
      expect(operators.binary['-'](5, 3)).toBe(2)
    })

    it('should export *', () => {
      expect(operators.binary).toHaveProperty('*')
      expect(operators.binary['*'](5, 3)).toBe(15)
    })

    it('should export /', () => {
      expect(operators.binary).toHaveProperty('/')
      expect(operators.binary['/'](8, 4)).toBe(2)
    })

    it('should export %', () => {
      expect(operators.binary).toHaveProperty('%')
      expect(operators.binary['%'](8, 4)).toBe(0)
      expect(operators.binary['%'](5, 3)).toBe(2)
    })

    it('should export <', () => {
      expect(operators.binary).toHaveProperty('<')
      expect(operators.binary['<'](8, 4)).toBe(false)
    })

    it('should export >', () => {
      expect(operators.binary).toHaveProperty('>')
      expect(operators.binary['>'](8, 4)).toBe(true)
    })

    it('should export <=', () => {
      expect(operators.binary).toHaveProperty('<=')
      expect(operators.binary['<='](8, 4)).toBe(false)
      expect(operators.binary['<='](5, 5)).toBe(true)
    })

    it('should export >=', () => {
      expect(operators.binary).toHaveProperty('<=')
      expect(operators.binary['>='](8, 4)).toBe(true)
      expect(operators.binary['>='](5, 5)).toBe(true)
    })

    it('should export ==', () => {
      expect(operators.binary).toHaveProperty('==')
      /* eslint-disable eqeqeq */
      expect(operators.binary['=='](8, 4)).toBe(false)
      expect(operators.binary['=='](5, 5)).toBe(true)
      expect(operators.binary['==']('1', '1')).toBe(true)
      expect(operators.binary['==']('1', '2')).toBe(false)
      const a = { x: '1' }
      const b = { x: '1' }
      const c = a
      expect(operators.binary['=='](a, b)).toBe(false)
      expect(operators.binary['=='](a, c)).toBe(true)
      expect(operators.binary['=='](undefined, null)).toBe(true)
      expect(operators.binary['=='](null, undefined)).toBe(true)
      /* eslint-enable eqeqeq */
    })

    it('should export !=', () => {
      expect(operators.binary).toHaveProperty('!=')
      /* eslint-disable eqeqeq */
      expect(operators.binary['!='](8, 4)).toBe(true)
      expect(operators.binary['!='](5, 5)).toBe(false)
      expect(operators.binary['!=']('1', '1')).toBe(false)
      expect(operators.binary['!=']('1', '2')).toBe(true)
      const a = { x: '1' }
      const b = { x: '1' }
      const c = a
      expect(operators.binary['!='](a, b)).toBe(true)
      expect(operators.binary['!='](a, c)).toBe(false)
      expect(operators.binary['!='](undefined, null)).toBe(false)
      expect(operators.binary['!='](null, undefined)).toBe(false)
      /* eslint-enable eqeqeq */
    })

    it('should export ===', () => {
      expect(operators.binary).toHaveProperty('===')
      expect(operators.binary['==='](8, 4)).toBe(false)
      expect(operators.binary['==='](5, 5)).toBe(true)
      expect(operators.binary['===']('1', '1')).toBe(true)
      expect(operators.binary['===']('1', '2')).toBe(false)
      const a = { x: '1' }
      const b = { x: '1' }
      const c = a
      expect(operators.binary['==='](a, b)).toBe(false)
      expect(operators.binary['==='](a, c)).toBe(true)
      expect(operators.binary['==='](undefined, null)).toBe(false)
      expect(operators.binary['==='](null, undefined)).toBe(false)
    })

    it('should export !==', () => {
      expect(operators.binary).toHaveProperty('!==')
      expect(operators.binary['!=='](8, 4)).toBe(true)
      expect(operators.binary['!=='](5, 5)).toBe(false)
      expect(operators.binary['!==']('1', '1')).toBe(false)
      expect(operators.binary['!==']('1', '2')).toBe(true)
      const a = { x: '1' }
      const b = { x: '1' }
      const c = a
      expect(operators.binary['!=='](a, b)).toBe(true)
      expect(operators.binary['!=='](a, c)).toBe(false)
      expect(operators.binary['!=='](undefined, null)).toBe(true)
      expect(operators.binary['!=='](null, undefined)).toBe(true)
    })

    it('should export &&', () => {
      expect(operators.binary).toHaveProperty('&&')
      expect(operators.binary['&&'](false, false)).toBe(false)
      expect(operators.binary['&&'](false, true)).toBe(false)
      expect(operators.binary['&&'](true, false)).toBe(false)
      expect(operators.binary['&&'](true, true)).toBe(true)
      expect(operators.binary['&&'](0, 0)).toBe(0)
      expect(operators.binary['&&'](0, 1)).toBe(0)
      expect(operators.binary['&&'](1, 0)).toBe(0)
      expect(operators.binary['&&'](1, 1)).toBe(1)
      expect(operators.binary['&&'](undefined, '1')).toBe(undefined)
      expect(operators.binary['&&']('', '1')).toBe('')
      expect(operators.binary['&&']('1', undefined)).toBe(undefined)
      expect(operators.binary['&&']('1', '')).toBe('')
    })

    it('should export ||', () => {
      expect(operators.binary).toHaveProperty('||')
      expect(operators.binary['||'](false, false)).toBe(false)
      expect(operators.binary['||'](false, true)).toBe(true)
      expect(operators.binary['||'](true, false)).toBe(true)
      expect(operators.binary['||'](true, true)).toBe(true)
      expect(operators.binary['||'](0, 1)).toBe(1)
      expect(operators.binary['||'](1, 0)).toBe(1)
      expect(operators.binary['||'](undefined, '1')).toBe('1')
      expect(operators.binary['||']('', '1')).toBe('1')
      expect(operators.binary['||']('1', undefined)).toBe('1')
      expect(operators.binary['||']('1', '')).toBe('1')
    })
  })
})
