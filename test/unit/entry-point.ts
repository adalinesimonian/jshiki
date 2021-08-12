import jshiki from '../../src'

describe('Entry point', () => {
  describe('parse()', () => {
    it('should parse valid expressions', () => {
      const expression = jshiki.parse('5')

      expect(typeof expression).toBe('function')
      expect(expression()).toBe(5)
    })

    it('should throw an error for invalid expressions', () => {
      expect(() => jshiki.parse('5+')).toThrowErrorMatchingSnapshot()
    })

    it('should parse expressions using the given options', () => {
      const expression = jshiki.parse('x', { scope: { x: '1' } })

      expect(typeof expression).toBe('function')
      expect(expression()).toBe('1')
    })
  })
})
