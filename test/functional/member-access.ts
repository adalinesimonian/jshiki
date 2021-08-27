import { evaluate } from '../../src'

describe('Member Access', () => {
  describe('. accessor', () => {
    it('should be able to access string properties', () => {
      expect(evaluate("'str'.length")).toBe(3)
    })

    it('should be able to access array properties', () => {
      expect(evaluate('[1, 2, 3].length')).toBe(3)
    })

    it('should be able to access object properties', () => {
      expect(evaluate('({ x: 1 }).x')).toBe(1)
    })

    it('should be able to invoke number methods', () => {
      expect(evaluate('(15).toString(16)')).toBe('f')
    })

    it('should be able to invoke string methods', () => {
      expect(evaluate("' str '.trim()")).toBe('str')
    })

    it('should be able to invoke array methods', () => {
      expect(evaluate("[1, 2, 3].join(', ')")).toBe('1, 2, 3')
    })
  })

  describe('[ accessor', () => {
    it('should be able to access string properties', () => {
      expect(evaluate("'str'['length']")).toBe(3)
    })

    it('should be able to access array properties', () => {
      expect(evaluate('[1, 2, 3]["length"]')).toBe(3)
    })

    it('should be able to access object properties', () => {
      expect(evaluate('({ x: 1 })["x"]')).toBe(1)
    })

    it('should be able to invoke number methods', () => {
      expect(evaluate('(15)["toString"](16)')).toBe('f')
    })

    it('should be able to invoke string methods', () => {
      expect(evaluate("' str '['trim']()")).toBe('str')
    })

    it('should be able to invoke array methods', () => {
      expect(evaluate("[1, 2, 3]['join'](', ')")).toBe('1, 2, 3')
    })

    it('should properly evaluate computed properties', () => {
      expect(evaluate('({ x: 1, y: 2 })[x]', { scope: { x: 'y' } })).toBe(2)
    })
  })

  describe('Optional Chaining', () => {
    it('should be able to access string properties', () => {
      expect(evaluate("'str'?.length")).toBe(3)
      expect(evaluate("'str'?.['length']")).toBe(3)
    })

    it('should be able to access array properties', () => {
      expect(evaluate('[1, 2, 3]?.length')).toBe(3)
      expect(evaluate('[1, 2, 3]?.["length"]')).toBe(3)
    })

    it('should be able to access object properties', () => {
      expect(evaluate('({ x: 1 })?.x')).toBe(1)
      expect(evaluate('({ x: 1 })?.["x"]')).toBe(1)
    })

    it('should be able to invoke number methods', () => {
      expect(evaluate('(15)?.toString(16)')).toBe('f')
      expect(evaluate('(15)?.["toString"](16)')).toBe('f')
    })

    it('should be able to invoke string methods', () => {
      expect(evaluate("' str '?.trim()")).toBe('str')
      expect(evaluate("' str '?.['trim']()")).toBe('str')
    })

    it('should be able to invoke array methods', () => {
      expect(evaluate("[1, 2, 3]?.join(', ')")).toBe('1, 2, 3')
      expect(evaluate("[1, 2, 3]?.['join'](', ')")).toBe('1, 2, 3')
    })

    it('should not access properties on undefined', () => {
      expect(evaluate('undefined?.length')).toBeUndefined()
    })

    it('should not access properties on null', () => {
      expect(evaluate('null?.length')).toBeUndefined()
    })
  })
})
