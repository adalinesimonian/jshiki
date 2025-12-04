import { describe, it, expect, vi } from 'vitest'
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
        operators.binary.in('x', 'string'),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        operators.binary.in('x', null),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        operators.binary.in('x', undefined),
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
        operators.binary.instanceof(5, null),
      ).toThrowErrorMatchingSnapshot()
      expect(() =>
        operators.binary.instanceof(5, undefined),
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
            () => false,
          ),
        ).toBe(false)
        expect(
          operators.logical['&&'](
            () => false,
            () => true,
          ),
        ).toBe(false)
        expect(
          operators.logical['&&'](
            () => true,
            () => false,
          ),
        ).toBe(false)
        expect(
          operators.logical['&&'](
            () => true,
            () => true,
          ),
        ).toBe(true)
        expect(
          operators.logical['&&'](
            () => 0,
            () => 0,
          ),
        ).toBe(0)
        expect(
          operators.logical['&&'](
            () => 0,
            () => 1,
          ),
        ).toBe(0)
        expect(
          operators.logical['&&'](
            () => 1,
            () => 0,
          ),
        ).toBe(0)
        expect(
          operators.logical['&&'](
            () => 1,
            () => 1,
          ),
        ).toBe(1)
        expect(
          operators.logical['&&'](
            () => undefined,
            () => '1',
          ),
        ).toBe(undefined)
        expect(
          operators.logical['&&'](
            () => '',
            () => '1',
          ),
        ).toBe('')
        expect(
          operators.logical['&&'](
            () => '1',
            () => undefined,
          ),
        ).toBe(undefined)
        expect(
          operators.logical['&&'](
            () => '1',
            () => '',
          ),
        ).toBe('')
      })

      it('should evaluate both arguments if the first is truthy', () => {
        const right = vi.fn(() => true)

        const leftBool = vi.fn(() => true)
        operators.logical['&&'](leftBool, right)
        expect(leftBool).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)

        right.mockClear()

        const leftNum = vi.fn(() => 1)
        operators.logical['&&'](leftNum, right)
        expect(leftNum).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)

        right.mockClear()

        const leftBigInt = vi.fn(() => 1n)
        operators.logical['&&'](leftBigInt, right)
        expect(leftBigInt).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)

        right.mockClear()

        const leftStr = vi.fn(() => 'x')
        operators.logical['&&'](leftStr, right)
        expect(leftStr).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)
      })

      it('should only evaluate the first argument if it is falsy', () => {
        const right = vi.fn(() => false)

        const leftBool = vi.fn(() => false)
        operators.logical['&&'](leftBool, right)
        expect(leftBool).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftNum = vi.fn(() => 0)
        operators.logical['&&'](leftNum, right)
        expect(leftNum).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftNegNum = vi.fn(() => -0)
        operators.logical['&&'](leftNegNum, right)
        expect(leftNegNum).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftBigInt = vi.fn(() => 0n)
        operators.logical['&&'](leftBigInt, right)
        expect(leftBigInt).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftStr = vi.fn(() => '')
        operators.logical['&&'](leftStr, right)
        expect(leftStr).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftUndefined = vi.fn(() => undefined)
        operators.logical['&&'](leftUndefined, right)
        expect(leftUndefined).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftNull = vi.fn(() => null)
        operators.logical['&&'](leftNull, right)
        expect(leftNull).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftNaN = vi.fn(() => NaN)
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
            () => false,
          ),
        ).toBe(false)
        expect(
          operators.logical['||'](
            () => false,
            () => true,
          ),
        ).toBe(true)
        expect(
          operators.logical['||'](
            () => true,
            () => false,
          ),
        ).toBe(true)
        expect(
          operators.logical['||'](
            () => true,
            () => true,
          ),
        ).toBe(true)
        expect(
          operators.logical['||'](
            () => 0,
            () => 1,
          ),
        ).toBe(1)
        expect(
          operators.logical['||'](
            () => 1,
            () => 0,
          ),
        ).toBe(1)
        expect(
          operators.logical['||'](
            () => undefined,
            () => '1',
          ),
        ).toBe('1')
        expect(
          operators.logical['||'](
            () => '',
            () => '1',
          ),
        ).toBe('1')
        expect(
          operators.logical['||'](
            () => '1',
            () => undefined,
          ),
        ).toBe('1')
        expect(
          operators.logical['||'](
            () => '1',
            () => '',
          ),
        ).toBe('1')
      })

      it('should only evaluate the first argument if it is truthy', () => {
        const right = vi.fn(() => false)

        const leftBool = vi.fn(() => true)
        operators.logical['||'](leftBool, right)
        expect(leftBool).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftNum = vi.fn(() => 1)
        operators.logical['||'](leftNum, right)
        expect(leftNum).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftBigInt = vi.fn(() => 1n)
        operators.logical['||'](leftBigInt, right)
        expect(leftBigInt).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftStr = vi.fn(() => 'x')
        operators.logical['||'](leftStr, right)
        expect(leftStr).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)
      })

      it('should evaluate both arguments if the first is falsy', () => {
        const right = vi.fn(() => false)

        const leftBool = vi.fn(() => false)
        operators.logical['||'](leftBool, right)
        expect(leftBool).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)

        right.mockClear()

        const leftNum = vi.fn(() => 0)
        operators.logical['||'](leftNum, right)
        expect(leftNum).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)

        right.mockClear()

        const leftNegNum = vi.fn(() => -0)
        operators.logical['||'](leftNegNum, right)
        expect(leftNegNum).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)

        right.mockClear()

        const leftBigInt = vi.fn(() => 0n)
        operators.logical['||'](leftBigInt, right)
        expect(leftBigInt).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)

        right.mockClear()

        const leftStr = vi.fn(() => '')
        operators.logical['||'](leftStr, right)
        expect(leftStr).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)

        right.mockClear()

        const leftUndefined = vi.fn(() => undefined)
        operators.logical['||'](leftUndefined, right)
        expect(leftUndefined).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)

        right.mockClear()

        const leftNull = vi.fn(() => null)
        operators.logical['||'](leftNull, right)
        expect(leftNull).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)

        right.mockClear()

        const leftNaN = vi.fn(() => NaN)
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
            () => 2,
          ),
        ).toBe(1)
        expect(
          operators.logical['??'](
            () => null,
            () => 2,
          ),
        ).toBe(2)
        expect(
          operators.logical['??'](
            () => undefined,
            () => 2,
          ),
        ).toBe(2)
        expect(
          operators.logical['??'](
            () => null,
            () => null,
          ),
        ).toBe(null)
        expect(
          operators.logical['??'](
            () => undefined,
            () => null,
          ),
        ).toBe(null)
        expect(
          operators.logical['??'](
            () => null,
            () => undefined,
          ),
        ).toBe(undefined)
        expect(
          operators.logical['??'](
            () => undefined,
            () => undefined,
          ),
        ).toBe(undefined)
      })

      it('should only evaluate the first argument if it is not nullish', () => {
        const right = vi.fn(() => null)

        const leftBool = vi.fn(() => false)
        operators.logical['??'](leftBool, right)
        expect(leftBool).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftNum = vi.fn(() => 0)
        operators.logical['??'](leftNum, right)
        expect(leftNum).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftNegNum = vi.fn(() => -0)
        operators.logical['??'](leftNegNum, right)
        expect(leftNegNum).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftBigInt = vi.fn(() => 0n)
        operators.logical['??'](leftBigInt, right)
        expect(leftBigInt).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftStr = vi.fn(() => '')
        operators.logical['??'](leftStr, right)
        expect(leftStr).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)
      })

      it('should evaluate both arguments if the first is nullish', () => {
        const right = vi.fn(() => 2)

        const leftNull = vi.fn(() => null)
        operators.logical['??'](leftNull, right)
        expect(leftNull).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)

        right.mockClear()

        const leftUndefined = vi.fn(() => undefined)
        operators.logical['??'](leftUndefined, right)
        expect(leftUndefined).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Logical operators (async)', () => {
    describe('&& — Logical AND', () => {
      it('should export &&', async () => {
        expect(operators.logical['&&']).toHaveProperty('async')
        expect(
          await operators.logical['&&'].async(
            async () => ({ value: false }),
            async () => ({ value: false }),
          ),
        ).toEqual({ result: false })
        expect(
          await operators.logical['&&'].async(
            async () => ({ value: false }),
            async () => ({ value: true }),
          ),
        ).toEqual({ result: false })
        expect(
          await operators.logical['&&'].async(
            async () => ({ value: true }),
            async () => ({ value: false }),
          ),
        ).toEqual({ result: false })
        expect(
          await operators.logical['&&'].async(
            async () => ({ value: true }),
            async () => ({ value: true }),
          ),
        ).toEqual({ result: true })
        expect(
          await operators.logical['&&'].async(
            async () => ({ value: 0 }),
            async () => ({ value: 0 }),
          ),
        ).toEqual({ result: 0 })
        expect(
          await operators.logical['&&'].async(
            async () => ({ value: 0 }),
            async () => ({ value: 1 }),
          ),
        ).toEqual({ result: 0 })
        expect(
          await operators.logical['&&'].async(
            async () => ({ value: 1 }),
            async () => ({ value: 0 }),
          ),
        ).toEqual({ result: 0 })
        expect(
          await operators.logical['&&'].async(
            async () => ({ value: 1 }),
            async () => ({ value: 1 }),
          ),
        ).toEqual({ result: 1 })
        expect(
          await operators.logical['&&'].async(
            async () => ({ value: undefined }),
            async () => ({ value: '1' }),
          ),
        ).toEqual({ result: undefined })
        expect(
          await operators.logical['&&'].async(
            async () => ({ value: '' }),
            async () => ({ value: '1' }),
          ),
        ).toEqual({ result: '' })
        expect(
          await operators.logical['&&'].async(
            async () => ({ value: '1' }),
            async () => ({ value: undefined }),
          ),
        ).toEqual({ result: undefined })
        expect(
          await operators.logical['&&'].async(
            async () => ({ value: '1' }),
            async () => ({ value: '' }),
          ),
        ).toEqual({ result: '' })
      })

      it('should evaluate both arguments if the first is truthy', async () => {
        const right = vi.fn(async () => ({ value: true }))

        const leftBool = vi.fn(async () => ({ value: true }))
        await operators.logical['&&'].async(leftBool, right)
        expect(leftBool).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)

        right.mockClear()

        const leftNum = vi.fn(async () => ({ value: 1 }))
        await operators.logical['&&'].async(leftNum, right)
        expect(leftNum).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)

        right.mockClear()

        const leftBigInt = vi.fn(async () => ({ value: 1n }))
        await operators.logical['&&'].async(leftBigInt, right)
        expect(leftBigInt).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)

        right.mockClear()

        const leftStr = vi.fn(async () => ({ value: 'x' }))
        await operators.logical['&&'].async(leftStr, right)
        expect(leftStr).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)
      })

      it('should only evaluate the first argument if it is falsy', async () => {
        const right = vi.fn(async () => ({ value: false }))

        const leftBool = vi.fn(async () => ({ value: false }))
        await operators.logical['&&'].async(leftBool, right)
        expect(leftBool).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftNum = vi.fn(async () => ({ value: 0 }))
        await operators.logical['&&'].async(leftNum, right)
        expect(leftNum).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftNegNum = vi.fn(async () => ({ value: -0 }))
        await operators.logical['&&'].async(leftNegNum, right)
        expect(leftNegNum).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftBigInt = vi.fn(async () => ({ value: 0n }))
        await operators.logical['&&'].async(leftBigInt, right)
        expect(leftBigInt).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftStr = vi.fn(async () => ({ value: '' }))
        await operators.logical['&&'].async(leftStr, right)
        expect(leftStr).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftUndefined = vi.fn(async () => ({ value: undefined }))
        await operators.logical['&&'].async(leftUndefined, right)
        expect(leftUndefined).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftNull = vi.fn(async () => ({ value: null }))
        await operators.logical['&&'].async(leftNull, right)
        expect(leftNull).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftNaN = vi.fn(async () => ({ value: NaN }))
        await operators.logical['&&'].async(leftNaN, right)
        expect(leftNaN).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)
      })
    })

    describe('|| — Logical OR', () => {
      it('should export ||', async () => {
        expect(operators.logical['||']).toHaveProperty('async')
        expect(
          await operators.logical['||'].async(
            async () => ({ value: false }),
            async () => ({ value: false }),
          ),
        ).toEqual({ result: false })
        expect(
          await operators.logical['||'].async(
            async () => ({ value: false }),
            async () => ({ value: true }),
          ),
        ).toEqual({ result: true })
        expect(
          await operators.logical['||'].async(
            async () => ({ value: true }),
            async () => ({ value: false }),
          ),
        ).toEqual({ result: true })
        expect(
          await operators.logical['||'].async(
            async () => ({ value: true }),
            async () => ({ value: true }),
          ),
        ).toEqual({ result: true })
        expect(
          await operators.logical['||'].async(
            async () => ({ value: 0 }),
            async () => ({ value: 1 }),
          ),
        ).toEqual({ result: 1 })
        expect(
          await operators.logical['||'].async(
            async () => ({ value: 1 }),
            async () => ({ value: 0 }),
          ),
        ).toEqual({ result: 1 })
        expect(
          await operators.logical['||'].async(
            async () => ({ value: undefined }),
            async () => ({ value: '1' }),
          ),
        ).toEqual({ result: '1' })
        expect(
          await operators.logical['||'].async(
            async () => ({ value: '' }),
            async () => ({ value: '1' }),
          ),
        ).toEqual({ result: '1' })
        expect(
          await operators.logical['||'].async(
            async () => ({ value: '1' }),
            async () => ({ value: undefined }),
          ),
        ).toEqual({ result: '1' })
        expect(
          await operators.logical['||'].async(
            async () => ({ value: '1' }),
            async () => ({ value: '' }),
          ),
        ).toEqual({ result: '1' })
      })

      it('should only evaluate the first argument if it is truthy', async () => {
        const right = vi.fn(async () => ({ value: false }))

        const leftBool = vi.fn(async () => ({ value: true }))
        await operators.logical['||'].async(leftBool, right)
        expect(leftBool).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftNum = vi.fn(async () => ({ value: 1 }))
        await operators.logical['||'].async(leftNum, right)
        expect(leftNum).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftBigInt = vi.fn(async () => ({ value: 1n }))
        await operators.logical['||'].async(leftBigInt, right)
        expect(leftBigInt).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftStr = vi.fn(async () => ({ value: 'x' }))
        await operators.logical['||'].async(leftStr, right)
        expect(leftStr).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)
      })

      it('should evaluate both arguments if the first is falsy', async () => {
        const right = vi.fn(async () => ({ value: false }))

        const leftBool = vi.fn(async () => ({ value: false }))
        await operators.logical['||'].async(leftBool, right)
        expect(leftBool).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)

        right.mockClear()

        const leftNum = vi.fn(async () => ({ value: 0 }))
        await operators.logical['||'].async(leftNum, right)
        expect(leftNum).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)

        right.mockClear()

        const leftNegNum = vi.fn(async () => ({ value: -0 }))
        await operators.logical['||'].async(leftNegNum, right)
        expect(leftNegNum).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)

        right.mockClear()

        const leftBigInt = vi.fn(async () => ({ value: 0n }))
        await operators.logical['||'].async(leftBigInt, right)
        expect(leftBigInt).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)

        right.mockClear()

        const leftStr = vi.fn(async () => ({ value: '' }))
        await operators.logical['||'].async(leftStr, right)
        expect(leftStr).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)

        right.mockClear()

        const leftUndefined = vi.fn(async () => ({ value: undefined }))
        await operators.logical['||'].async(leftUndefined, right)
        expect(leftUndefined).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)

        right.mockClear()

        const leftNull = vi.fn(async () => ({ value: null }))
        await operators.logical['||'].async(leftNull, right)
        expect(leftNull).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)

        right.mockClear()

        const leftNaN = vi.fn(async () => ({ value: NaN }))
        await operators.logical['||'].async(leftNaN, right)
        expect(leftNaN).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)
      })
    })

    describe('?? — Nullish Coalescing', () => {
      it('should export ??', async () => {
        expect(operators.logical['??']).toHaveProperty('async')
        expect(
          await operators.logical['??'].async(
            async () => ({ value: 1 }),
            async () => ({ value: 2 }),
          ),
        ).toEqual({ result: 1 })
        expect(
          await operators.logical['??'].async(
            async () => ({ value: null }),
            async () => ({ value: 2 }),
          ),
        ).toEqual({ result: 2 })
        expect(
          await operators.logical['??'].async(
            async () => ({ value: undefined }),
            async () => ({ value: 2 }),
          ),
        ).toEqual({ result: 2 })
        expect(
          await operators.logical['??'].async(
            async () => ({ value: null }),
            async () => ({ value: null }),
          ),
        ).toEqual({ result: null })
        expect(
          await operators.logical['??'].async(
            async () => ({ value: undefined }),
            async () => ({ value: null }),
          ),
        ).toEqual({ result: null })
        expect(
          await operators.logical['??'].async(
            async () => ({ value: null }),
            async () => ({ value: undefined }),
          ),
        ).toEqual({ result: undefined })
        expect(
          await operators.logical['??'].async(
            async () => ({ value: undefined }),
            async () => ({ value: undefined }),
          ),
        ).toEqual({ result: undefined })
      })

      it('should only evaluate the first argument if it is not nullish', async () => {
        const right = vi.fn(async () => ({ value: null }))

        const leftBool = vi.fn(async () => ({ value: false }))
        await operators.logical['??'].async(leftBool, right)
        expect(leftBool).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftNum = vi.fn(async () => ({ value: 0 }))
        await operators.logical['??'].async(leftNum, right)
        expect(leftNum).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftNegNum = vi.fn(async () => ({ value: -0 }))
        await operators.logical['??'].async(leftNegNum, right)
        expect(leftNegNum).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftBigInt = vi.fn(async () => ({ value: 0n }))
        await operators.logical['??'].async(leftBigInt, right)
        expect(leftBigInt).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)

        right.mockClear()

        const leftStr = vi.fn(async () => ({ value: '' }))
        await operators.logical['??'].async(leftStr, right)
        expect(leftStr).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(0)
      })

      it('should evaluate both arguments if the first is nullish', async () => {
        const right = vi.fn(async () => ({ value: 2 }))

        const leftNull = vi.fn(async () => ({ value: null }))
        await operators.logical['??'].async(leftNull, right)
        expect(leftNull).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)

        right.mockClear()

        const leftUndefined = vi.fn(async () => ({ value: undefined }))
        await operators.logical['??'].async(leftUndefined, right)
        expect(leftUndefined).toHaveBeenCalledTimes(1)
        expect(right).toHaveBeenCalledTimes(1)
      })
    })
  })
})
