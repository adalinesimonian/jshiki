import { evaluate, parse } from '../../src'

describe('Operator options', () => {
  it('should allow all supported operators by default', () => {
    // Unary operators
    expect(evaluate('+2')).toBe(2)
    expect(evaluate('-2')).toBe(-2)
    expect(evaluate('!2')).toBe(false)
    expect(evaluate('~2')).toBe(-3)

    // Binary operators
    expect(evaluate('4 + 2')).toBe(6)
    expect(evaluate('4 - 2')).toBe(2)
    expect(evaluate('4 * 2')).toBe(8)
    expect(evaluate('4 ** 2')).toBe(16)
    expect(evaluate('4 / 2')).toBe(2)
    expect(evaluate('4 % 2')).toBe(0)
    expect(evaluate('4 < 2')).toBe(false)
    expect(evaluate('4 > 2')).toBe(true)
    expect(evaluate('4 <= 2')).toBe(false)
    expect(evaluate('4 >= 2')).toBe(true)
    expect(evaluate('4 == 2')).toBe(false)
    expect(evaluate('4 != 2')).toBe(true)
    expect(evaluate('4 === 2')).toBe(false)
    expect(evaluate('4 !== 2')).toBe(true)
    expect(evaluate('4 | 2')).toBe(6)
    expect(evaluate('4 ^ 2')).toBe(6)
    expect(evaluate('4 & 2')).toBe(0)
    expect(evaluate('4 << 2')).toBe(16)
    expect(evaluate('4 >> 2')).toBe(1)
    expect(evaluate('4 >>> 2')).toBe(1)

    // Logical operators
    expect(evaluate('null && true')).toBe(null)
    expect(evaluate('null || true')).toBe(true)
    expect(evaluate('null ?? true')).toBe(true)

    // Conditional operator
    expect(evaluate('false ? 5 : 3')).toBe(3)
  })

  it('should support allowing only the specified operators', () => {
    const options = {
      operators: {
        unary: { allow: ['+', '-'] },
        binary: { allow: ['%', '**'] },
        logical: { allow: ['&&'] },
        ternary: true,
      },
    }

    // Unary operators
    expect(evaluate('+2', options)).toBe(2)
    expect(evaluate('-2', options)).toBe(-2)
    expect(() => parse('!2', options)).toThrowErrorMatchingSnapshot()
    expect(() => parse('~2', options)).toThrowErrorMatchingSnapshot()

    // Binary operators
    expect(() => parse('4 + 2', options)).toThrowErrorMatchingSnapshot()
    expect(() => parse('4 - 2', options)).toThrowErrorMatchingSnapshot()
    expect(() => parse('4 * 2', options)).toThrowErrorMatchingSnapshot()
    expect(evaluate('4 ** 2', options)).toBe(16)
    expect(() => parse('4 / 2', options)).toThrowErrorMatchingSnapshot()
    expect(evaluate('4 % 2', options)).toBe(0)
    expect(() => parse('4 < 2', options)).toThrowErrorMatchingSnapshot()
    expect(() => parse('4 > 2', options)).toThrowErrorMatchingSnapshot()
    expect(() => parse('4 <= 2', options)).toThrowErrorMatchingSnapshot()
    expect(() => parse('4 >= 2', options)).toThrowErrorMatchingSnapshot()
    expect(() => parse('4 == 2', options)).toThrowErrorMatchingSnapshot()
    expect(() => parse('4 != 2', options)).toThrowErrorMatchingSnapshot()
    expect(() => parse('4 === 2', options)).toThrowErrorMatchingSnapshot()
    expect(() => parse('4 !== 2', options)).toThrowErrorMatchingSnapshot()
    expect(() => parse('4 | 2', options)).toThrowErrorMatchingSnapshot()
    expect(() => parse('4 ^ 2', options)).toThrowErrorMatchingSnapshot()
    expect(() => parse('4 & 2', options)).toThrowErrorMatchingSnapshot()
    expect(() => parse('4 << 2', options)).toThrowErrorMatchingSnapshot()
    expect(() => parse('4 >> 2', options)).toThrowErrorMatchingSnapshot()
    expect(() => parse('4 >>> 2', options)).toThrowErrorMatchingSnapshot()

    // Logical operators
    expect(evaluate('null && true', options)).toBe(null)
    expect(() => parse('null || true', options)).toThrowErrorMatchingSnapshot()
    expect(() => parse('null ?? true', options)).toThrowErrorMatchingSnapshot()

    // Conditional operator
    expect(evaluate('false ? 5 : 3', options)).toBe(3)
  })

  it('should support blocking specified operators', () => {
    const options = {
      operators: {
        unary: { block: ['+', '-'] },
        binary: { block: ['%', '**'] },
        logical: { block: ['&&'] },
        ternary: false,
      },
    }

    // Unary operators
    expect(() => parse('+2', options)).toThrowErrorMatchingSnapshot()
    expect(() => parse('-2', options)).toThrowErrorMatchingSnapshot()
    expect(evaluate('!2', options)).toBe(false)
    expect(evaluate('~2', options)).toBe(-3)

    // Binary operators
    expect(evaluate('4 + 2', options)).toBe(6)
    expect(evaluate('4 - 2', options)).toBe(2)
    expect(evaluate('4 * 2', options)).toBe(8)
    expect(() => parse('4 ** 2', options)).toThrowErrorMatchingSnapshot()
    expect(evaluate('4 / 2', options)).toBe(2)
    expect(() => parse('4 % 2', options)).toThrowErrorMatchingSnapshot()
    expect(evaluate('4 < 2', options)).toBe(false)
    expect(evaluate('4 > 2', options)).toBe(true)
    expect(evaluate('4 <= 2', options)).toBe(false)
    expect(evaluate('4 >= 2', options)).toBe(true)
    expect(evaluate('4 == 2', options)).toBe(false)
    expect(evaluate('4 != 2', options)).toBe(true)
    expect(evaluate('4 === 2', options)).toBe(false)
    expect(evaluate('4 !== 2', options)).toBe(true)
    expect(evaluate('4 | 2', options)).toBe(6)
    expect(evaluate('4 ^ 2', options)).toBe(6)
    expect(evaluate('4 & 2', options)).toBe(0)
    expect(evaluate('4 << 2', options)).toBe(16)
    expect(evaluate('4 >> 2', options)).toBe(1)
    expect(evaluate('4 >>> 2', options)).toBe(1)

    // Logical operators
    expect(() => parse('null && true', options)).toThrowErrorMatchingSnapshot()
    expect(evaluate('null || true', options)).toBe(true)
    expect(evaluate('null ?? true', options)).toBe(true)

    // Conditional operator
    expect(() => parse('false ? 5 : 3', options)).toThrowErrorMatchingSnapshot()
  })

  it('should throw if providing both an allow and block list', () => {
    expect(() =>
      parse('1 + 2', {
        operators: {
          unary: { allow: ['+', '-'], block: ['+', '-'] },
        },
      })
    ).toThrowErrorMatchingSnapshot()
    expect(() =>
      parse('1 + 2', {
        operators: {
          binary: { allow: ['+', '-'], block: ['+', '-'] },
        },
      })
    ).toThrowErrorMatchingSnapshot()
    expect(() =>
      parse('1 + 2', {
        operators: {
          logical: { allow: ['&&', '??'], block: ['&&', '??'] },
        },
      })
    ).toThrowErrorMatchingSnapshot()
  })

  it('should throw if providing an unsupported operator', () => {
    expect(() =>
      parse('1 + 2', {
        operators: {
          unary: { allow: ['invalid'] },
        },
      })
    ).toThrowErrorMatchingSnapshot()
    expect(() =>
      parse('1 + 2', {
        operators: {
          unary: { block: ['invalid'] },
        },
      })
    ).toThrowErrorMatchingSnapshot()
    expect(() =>
      parse('1 + 2', {
        operators: {
          binary: { allow: ['invalid'] },
        },
      })
    ).toThrowErrorMatchingSnapshot()
    expect(() =>
      parse('1 + 2', {
        operators: {
          binary: { block: ['invalid'] },
        },
      })
    ).toThrowErrorMatchingSnapshot()
    expect(() =>
      parse('1 + 2', {
        operators: {
          logical: { allow: ['invalid'] },
        },
      })
    ).toThrowErrorMatchingSnapshot()
    expect(() =>
      parse('1 + 2', {
        operators: {
          logical: { block: ['invalid'] },
        },
      })
    ).toThrowErrorMatchingSnapshot()
  })

  it('should throw if the list is not an array', () => {
    expect(() =>
      parse('1 + 2', {
        operators: {
          unary: { allow: 'invalid' as any },
        },
      })
    ).toThrowErrorMatchingSnapshot()
    expect(() =>
      parse('1 + 2', {
        operators: {
          unary: { block: 'invalid' as any },
        },
      })
    ).toThrowErrorMatchingSnapshot()
    expect(() =>
      parse('1 + 2', {
        operators: {
          binary: { allow: 'invalid' as any },
        },
      })
    ).toThrowErrorMatchingSnapshot()
    expect(() =>
      parse('1 + 2', {
        operators: {
          binary: { block: 'invalid' as any },
        },
      })
    ).toThrowErrorMatchingSnapshot()
    expect(() =>
      parse('1 + 2', {
        operators: {
          logical: { allow: 'invalid' as any },
        },
      })
    ).toThrowErrorMatchingSnapshot()
    expect(() =>
      parse('1 + 2', {
        operators: {
          logical: { block: 'invalid' as any },
        },
      })
    ).toThrowErrorMatchingSnapshot()
  })

  it('should throw if the options do not contain a list', () => {
    expect(() =>
      parse('1 + 2', {
        operators: {
          unary: {} as any,
        },
      })
    ).toThrowErrorMatchingSnapshot()
    expect(() =>
      parse('1 + 2', {
        operators: {
          unary: {} as any,
        },
      })
    ).toThrowErrorMatchingSnapshot()
    expect(() =>
      parse('1 + 2', {
        operators: {
          binary: {} as any,
        },
      })
    ).toThrowErrorMatchingSnapshot()
    expect(() =>
      parse('1 + 2', {
        operators: {
          binary: {} as any,
        },
      })
    ).toThrowErrorMatchingSnapshot()
    expect(() =>
      parse('1 + 2', {
        operators: {
          logical: {} as any,
        },
      })
    ).toThrowErrorMatchingSnapshot()
    expect(() =>
      parse('1 + 2', {
        operators: {
          logical: {} as any,
        },
      })
    ).toThrowErrorMatchingSnapshot()
  })
})
