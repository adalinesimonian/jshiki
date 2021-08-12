import { evaluate } from '../../src'

describe('Member Access', () => {
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
