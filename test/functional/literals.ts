import { evaluate } from '../../src'

describe('Literals', () => {
  describe('Numeric Literals', () => {
    it('should parse integers', () => {
      expect(evaluate('5')).toBe(5)
    })

    it('should parse floating-point numbers', () => {
      expect(evaluate('5.3')).toBe(5.3)
    })
  })

  describe('String Literals', () => {
    it('should parse single-quoted strings', () => {
      expect(evaluate("'x'")).toBe('x')
    })

    it('should parse double-quoted strings', () => {
      expect(evaluate('"x"')).toBe('x')
    })
  })

  describe('Object Literals', () => {
    it('should parse empty object literals', () => {
      expect(evaluate('{}')).toEqual({})
    })

    it('should parse object literals', () => {
      expect(evaluate("{ x: 1, y: '2', z: '3' }")).toEqual({
        x: 1,
        y: '2',
        z: '3',
      })
    })

    it('should parse nested object literals', () => {
      expect(evaluate("{ x: 1, y: { a: '2' }, z: '3' }")).toEqual({
        x: 1,
        y: { a: '2' },
        z: '3',
      })
    })
  })

  describe('Array Literals', () => {
    it('should parse empty array literals', () => {
      expect(evaluate('[]')).toEqual([])
    })

    it('should parse numeric array literals', () => {
      expect(evaluate('[1, 2, 3]')).toEqual([1, 2, 3])
    })

    it('should parse string array literals', () => {
      expect(evaluate("['1', '2', '3']")).toEqual(['1', '2', '3'])
    })

    it('should parse object array literals', () => {
      expect(evaluate("[{ x: '1' }, { y: '2' }, { z: '3' }]")).toEqual([
        { x: '1' },
        { y: '2' },
        { z: '3' },
      ])
    })

    it('should parse nested array literals', () => {
      expect(evaluate('[[1, 2], [3, 4], [5, 6]]')).toEqual([
        [1, 2],
        [3, 4],
        [5, 6],
      ])
    })

    it('should parse mixed-type array literals', () => {
      expect(evaluate("[1, { y: '2' }, '3', [4, 5]]")).toEqual([
        1,
        { y: '2' },
        '3',
        [4, 5],
      ])
    })
  })
})
