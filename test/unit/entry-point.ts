import { parse, evaluate } from '../../src'

describe('Entry point', () => {
  describe('parse()', () => {
    it('should parse a simple expression', () => {
      const result = parse('1 + 2')
      expect(typeof result).toBe('function')
      expect(result()).toBe(3)
    })

    it('should parse a simple expression with a variable', () => {
      const result = parse('a + 2')
      expect(typeof result).toBe('function')
      expect(result()).toBeNaN()
      expect(result({ a: 1 })).toBe(3)
    })

    it('should throw an error for invalid expressions', () => {
      expect(() => parse('5+')).toThrowErrorMatchingSnapshot()
    })

    it('should respect rules', () => {
      const expression = parse('x || y', {
        explicitAllow: true,
        rules: [{ allow: 'y' }],
      })

      expect(typeof expression).toBe('function')

      expect(expression()).toBeUndefined()
      expect(expression({ x: '1' })).toBeUndefined()
      expect(expression({ y: '1' })).toBe('1')
    })
  })

  describe('evaluate()', () => {
    it('should evaluate a simple expression', () => {
      expect(evaluate('1 + 2')).toBe(3)
    })

    it('should evaluate a simple expression with a variable', () => {
      expect(evaluate('a + 2')).toBeNaN()
      expect(evaluate('a + 2', { scope: { a: 1 } })).toBe(3)
    })

    it('should respect rules', () => {
      const options = {
        explicitAllow: true,
        rules: [{ allow: 'y' }],
      }
      const optionsWithX = { ...options, scope: { x: '1' } }
      const optionsWithY = { ...options, scope: { y: '1' } }

      expect(evaluate('x || y', options)).toBeUndefined()
      expect(evaluate('x || y', optionsWithX)).toBeUndefined()
      expect(evaluate('x || y', optionsWithY)).toBe('1')
    })
  })
})
