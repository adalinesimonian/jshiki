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

    it('should export ~', () => {
      expect(operators.unary).toHaveProperty('~')
      expect(operators.unary['~'](5)).toBe(-6)
      expect(operators.unary['~'](-5)).toBe(4)
    })

    it('should export typeof', () => {
      expect(operators.unary).toHaveProperty('typeof')
      expect(operators.unary.typeof('test')).toBe('string')
      expect(operators.unary.typeof(5)).toBe('number')
      expect(operators.unary.typeof(true)).toBe('boolean')
      expect(operators.unary.typeof(null)).toBe('object')
      expect(operators.unary.typeof(undefined)).toBe('undefined')
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
    })

    it('should export !=', () => {
      expect(operators.binary).toHaveProperty('!=')
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

    it('should export |', () => {
      expect(operators.binary).toHaveProperty('|')
      expect(operators.binary['|'](8, 4)).toBe(12)
      expect(operators.binary['|'](5, 5)).toBe(5)
      expect(operators.binary['|']('1', '2')).toBe(3)
      expect(operators.binary['|'](null, undefined)).toBe(0)
    })

    it('should export ^', () => {
      expect(operators.binary).toHaveProperty('^')
      expect(operators.binary['^'](8, 4)).toBe(12)
      expect(operators.binary['^'](5, 5)).toBe(0)
      expect(operators.binary['^']('1', '2')).toBe(3)
      expect(operators.binary['^'](null, undefined)).toBe(0)
    })

    it('should export &', () => {
      expect(operators.binary).toHaveProperty('&')
      expect(operators.binary['&'](8, 4)).toBe(0)
      expect(operators.binary['&'](5, 5)).toBe(5)
      expect(operators.binary['&']('1', '2')).toBe(0)
      expect(operators.binary['&'](null, undefined)).toBe(0)
    })

    it('should export <<', () => {
      expect(operators.binary).toHaveProperty('<<')
      expect(operators.binary['<<'](8, 4)).toBe(128)
      expect(operators.binary['<<'](5, 5)).toBe(160)
      expect(operators.binary['<<']('1', '2')).toBe(4)
      expect(operators.binary['<<'](null, undefined)).toBe(0)
    })

    it('should export >>', () => {
      expect(operators.binary).toHaveProperty('>>')
      expect(operators.binary['>>'](8, 4)).toBe(0)
      expect(operators.binary['>>'](-8, 4)).toBe(-1)
      expect(operators.binary['>>'](5, 5)).toBe(0)
      expect(operators.binary['>>']('2', '1')).toBe(1)
      expect(operators.binary['>>'](null, undefined)).toBe(0)
    })

    it('should export >>>', () => {
      expect(operators.binary).toHaveProperty('>>>')
      expect(operators.binary['>>>'](8, 4)).toBe(0)
      expect(operators.binary['>>>'](-8, 4)).toBe(268435455)
      expect(operators.binary['>>>'](5, 5)).toBe(0)
      expect(operators.binary['>>>']('2', '1')).toBe(1)
      expect(operators.binary['>>>'](null, undefined)).toBe(0)
    })

    it('should export in', () => {
      expect(operators.binary).toHaveProperty('in')
      expect(operators.binary.in('x', { x: 1 })).toBe(true)
      expect(operators.binary.in('x', { y: 1 })).toBe(false)
      expect(() => operators.binary.in('x', 5)).toThrowErrorMatchingSnapshot()
      expect(() =>
        operators.binary.in('x', 'string')
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        operators.binary.in('x', null)
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        operators.binary.in('x', undefined)
      ).toThrowErrorMatchingSnapshot()
    })

    it('should export instanceof', () => {
      class A {
        x: number = 5
      }
      const a = new A()
      expect(operators.binary).toHaveProperty('instanceof')
      expect(operators.binary.instanceof(a, A)).toBe(true)
      expect(operators.binary.instanceof(a, Object)).toBe(true)
      expect(operators.binary.instanceof(a, String)).toBe(false)
      expect(operators.binary.instanceof({ x: 5 }, Object)).toBe(true)
      expect(operators.binary.instanceof({ x: 5 }, A)).toBe(false)
      expect(operators.binary.instanceof(5, Number)).toBe(false)
      expect(operators.binary.instanceof('string', String)).toBe(false)
      expect(() =>
        operators.binary.instanceof(5, null)
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        operators.binary.instanceof(5, undefined)
      ).toThrowErrorMatchingSnapshot()
    })
  })

  describe('Logical operators', () => {
    describe('&& — Logical AND', () => {
      it('should export &&', () => {
        expect(operators.logical).toHaveProperty('&&')
        expect(
          operators.logical['&&'](
            () => false,
            () => false
          )
        ).toBe(false)
        expect(
          operators.logical['&&'](
            () => false,
            () => true
          )
        ).toBe(false)
        expect(
          operators.logical['&&'](
            () => true,
            () => false
          )
        ).toBe(false)
        expect(
          operators.logical['&&'](
            () => true,
            () => true
          )
        ).toBe(true)
        expect(
          operators.logical['&&'](
            () => 0,
            () => 0
          )
        ).toBe(0)
        expect(
          operators.logical['&&'](
            () => 0,
            () => 1
          )
        ).toBe(0)
        expect(
          operators.logical['&&'](
            () => 1,
            () => 0
          )
        ).toBe(0)
        expect(
          operators.logical['&&'](
            () => 1,
            () => 1
          )
        ).toBe(1)
        expect(
          operators.logical['&&'](
            () => undefined,
            () => '1'
          )
        ).toBe(undefined)
        expect(
          operators.logical['&&'](
            () => '',
            () => '1'
          )
        ).toBe('')
        expect(
          operators.logical['&&'](
            () => '1',
            () => undefined
          )
        ).toBe(undefined)
        expect(
          operators.logical['&&'](
            () => '1',
            () => ''
          )
        ).toBe('')
      })

      it('should only evaluate the first argument if it is falsy', () => {
        const right = jest.fn(() => true)

        const leftBool = jest.fn(() => true)
        operators.logical['&&'](leftBool, right)
        expect(leftBool).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)

        right.mockClear()

        const leftNum = jest.fn(() => 1)
        operators.logical['&&'](leftNum, right)
        expect(leftNum).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)

        right.mockClear()

        const leftBigInt = jest.fn(() => 1n)
        operators.logical['&&'](leftBigInt, right)
        expect(leftBigInt).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)

        right.mockClear()

        const leftStr = jest.fn(() => 'x')
        operators.logical['&&'](leftStr, right)
        expect(leftStr).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)
      })

      it('should evaluate both arguments if the first is truthy', () => {
        const right = jest.fn(() => false)

        const leftBool = jest.fn(() => false)
        operators.logical['&&'](leftBool, right)
        expect(leftBool).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftNum = jest.fn(() => 0)
        operators.logical['&&'](leftNum, right)
        expect(leftNum).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftNegNum = jest.fn(() => -0)
        operators.logical['&&'](leftNegNum, right)
        expect(leftNegNum).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftBigInt = jest.fn(() => 0n)
        operators.logical['&&'](leftBigInt, right)
        expect(leftBigInt).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftStr = jest.fn(() => '')
        operators.logical['&&'](leftStr, right)
        expect(leftStr).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftUndefined = jest.fn(() => undefined)
        operators.logical['&&'](leftUndefined, right)
        expect(leftUndefined).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftNull = jest.fn(() => null)
        operators.logical['&&'](leftNull, right)
        expect(leftNull).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftNaN = jest.fn(() => NaN)
        operators.logical['&&'](leftNaN, right)
        expect(leftNaN).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)
      })
    })

    describe('|| — Logical OR', () => {
      it('should export ||', () => {
        expect(operators.logical).toHaveProperty('||')
        expect(
          operators.logical['||'](
            () => false,
            () => false
          )
        ).toBe(false)
        expect(
          operators.logical['||'](
            () => false,
            () => true
          )
        ).toBe(true)
        expect(
          operators.logical['||'](
            () => true,
            () => false
          )
        ).toBe(true)
        expect(
          operators.logical['||'](
            () => true,
            () => true
          )
        ).toBe(true)
        expect(
          operators.logical['||'](
            () => 0,
            () => 1
          )
        ).toBe(1)
        expect(
          operators.logical['||'](
            () => 1,
            () => 0
          )
        ).toBe(1)
        expect(
          operators.logical['||'](
            () => undefined,
            () => '1'
          )
        ).toBe('1')
        expect(
          operators.logical['||'](
            () => '',
            () => '1'
          )
        ).toBe('1')
        expect(
          operators.logical['||'](
            () => '1',
            () => undefined
          )
        ).toBe('1')
        expect(
          operators.logical['||'](
            () => '1',
            () => ''
          )
        ).toBe('1')
      })

      it('should only evaluate the first argument if it is truthy', () => {
        const right = jest.fn(() => false)

        const leftBool = jest.fn(() => true)
        operators.logical['||'](leftBool, right)
        expect(leftBool).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftNum = jest.fn(() => 1)
        operators.logical['||'](leftNum, right)
        expect(leftNum).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftBigInt = jest.fn(() => 1n)
        operators.logical['||'](leftBigInt, right)
        expect(leftBigInt).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftStr = jest.fn(() => 'x')
        operators.logical['||'](leftStr, right)
        expect(leftStr).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)
      })

      it('should evaluate both arguments if the first is falsy', () => {
        const right = jest.fn(() => false)

        const leftBool = jest.fn(() => false)
        operators.logical['||'](leftBool, right)
        expect(leftBool).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)

        right.mockClear()

        const leftNum = jest.fn(() => 0)
        operators.logical['||'](leftNum, right)
        expect(leftNum).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)

        right.mockClear()

        const leftNegNum = jest.fn(() => -0)
        operators.logical['||'](leftNegNum, right)
        expect(leftNegNum).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)

        right.mockClear()

        const leftBigInt = jest.fn(() => 0n)
        operators.logical['||'](leftBigInt, right)
        expect(leftBigInt).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)

        right.mockClear()

        const leftStr = jest.fn(() => '')
        operators.logical['||'](leftStr, right)
        expect(leftStr).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)

        right.mockClear()

        const leftUndefined = jest.fn(() => undefined)
        operators.logical['||'](leftUndefined, right)
        expect(leftUndefined).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)

        right.mockClear()

        const leftNull = jest.fn(() => null)
        operators.logical['||'](leftNull, right)
        expect(leftNull).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)

        right.mockClear()

        const leftNaN = jest.fn(() => NaN)
        operators.logical['||'](leftNaN, right)
        expect(leftNaN).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)
      })
    })

    describe('?? — Nullish Coalescing', () => {
      it('should export ??', () => {
        expect(operators.logical).toHaveProperty('??')
        expect(
          operators.logical['??'](
            () => 1,
            () => 2
          )
        ).toBe(1)
        expect(
          operators.logical['??'](
            () => null,
            () => 2
          )
        ).toBe(2)
        expect(
          operators.logical['??'](
            () => undefined,
            () => 2
          )
        ).toBe(2)
        expect(
          operators.logical['??'](
            () => null,
            () => null
          )
        ).toBe(null)
        expect(
          operators.logical['??'](
            () => undefined,
            () => null
          )
        ).toBe(null)
        expect(
          operators.logical['??'](
            () => null,
            () => undefined
          )
        ).toBe(undefined)
        expect(
          operators.logical['??'](
            () => undefined,
            () => undefined
          )
        ).toBe(undefined)
      })

      it('should only evaluate the first argument if it is not nullish', () => {
        const right = jest.fn(() => null)

        const leftBool = jest.fn(() => false)
        operators.logical['??'](leftBool, right)
        expect(leftBool).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftNum = jest.fn(() => 0)
        operators.logical['??'](leftNum, right)
        expect(leftNum).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftNegNum = jest.fn(() => -0)
        operators.logical['??'](leftNegNum, right)
        expect(leftNegNum).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftBigInt = jest.fn(() => 0n)
        operators.logical['??'](leftBigInt, right)
        expect(leftBigInt).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftStr = jest.fn(() => '')
        operators.logical['??'](leftStr, right)
        expect(leftStr).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)
      })

      it('should evaluate both arguments if the first is nullish', () => {
        const right = jest.fn(() => 2)

        const leftNull = jest.fn(() => null)
        operators.logical['??'](leftNull, right)
        expect(leftNull).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)

        right.mockClear()

        const leftUndefined = jest.fn(() => undefined)
        operators.logical['??'](leftUndefined, right)
        expect(leftUndefined).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)
      })
    })
  })
})
