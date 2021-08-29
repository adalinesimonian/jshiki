import { evaluate, parse } from '../../src'

describe('Syntax options', () => {
  it('should allow all supported syntax by default', () => {
    expect(evaluate('a.b.c', { scope: { a: { b: { c: 1 } } } })).toBe(1)
    expect(evaluate('a?.b?.c', { scope: { a: { b: { c: 1 } } } })).toBe(1)
    expect(evaluate('a["b"]["c"]', { scope: { a: { b: { c: 1 } } } })).toBe(1)
    expect(evaluate('a?.["b"]?.["c"]', { scope: { a: { b: { c: 1 } } } })).toBe(
      1
    )
    expect(evaluate('a()', { scope: { a: () => 1 } })).toBe(1)
    expect(evaluate('a?.()', { scope: { a: () => 1 } })).toBe(1)
    expect(
      // eslint-disable-next-line no-template-curly-in-string
      evaluate('tag`a${b}`', {
        scope: {
          b: 1,
          tag: (strings: TemplateStringsArray, expression: number) =>
            `got ${strings.join('')} and ${expression}`,
        },
      })
    ).toBe('got a and 1')
    // eslint-disable-next-line no-template-curly-in-string
    expect(evaluate('`a ${b}`', { scope: { b: 1 } })).toBe('a 1')
    expect(evaluate('{ a: 1 }')).toEqual({ a: 1 })
    // eslint-disable-next-line no-sparse-arrays
    expect(evaluate('[1, , 3]')).toEqual([1, , 3])
  })

  it('should allow syntax when corresponding option is set to true', () => {
    const options = {
      syntax: {
        memberAccess: true,
        calls: true,
        taggedTemplates: true,
        templates: true,
        objects: true,
        arrays: true,
      },
    }

    expect(
      evaluate('a.b.c', { ...options, scope: { a: { b: { c: 1 } } } })
    ).toBe(1)
    expect(
      evaluate('a?.b?.c', { ...options, scope: { a: { b: { c: 1 } } } })
    ).toBe(1)
    expect(
      evaluate('a["b"]["c"]', { ...options, scope: { a: { b: { c: 1 } } } })
    ).toBe(1)
    expect(
      evaluate('a?.["b"]?.["c"]', {
        ...options,
        scope: { a: { b: { c: 1 } } },
      })
    ).toBe(1)
    expect(evaluate('a()', { ...options, scope: { a: () => 1 } })).toBe(1)
    expect(evaluate('a?.()', { ...options, scope: { a: () => 1 } })).toBe(1)
    expect(
      // eslint-disable-next-line no-template-curly-in-string
      evaluate('tag`a${b}`', {
        ...options,
        scope: {
          b: 1,
          tag: (strings: TemplateStringsArray, expression: number) =>
            `got ${strings.join('')} and ${expression}`,
        },
      })
    ).toBe('got a and 1')
    // eslint-disable-next-line no-template-curly-in-string
    expect(evaluate('`a ${b}`', { ...options, scope: { b: 1 } })).toBe('a 1')
    expect(evaluate('{ a: 1 }', options)).toEqual({ a: 1 })
    // eslint-disable-next-line no-sparse-arrays
    expect(evaluate('[1, , 3]', options)).toEqual([1, , 3])
  })

  it('should block syntax when corresponding option is set to false', () => {
    const options = {
      syntax: {
        memberAccess: false,
        calls: false,
        taggedTemplates: false,
        templates: false,
        objects: false,
        arrays: false,
      },
    }

    expect(() => parse('a.b.c', options)).toThrowErrorMatchingSnapshot()
    expect(() => parse('a?.b?.c', options)).toThrowErrorMatchingSnapshot()
    expect(() => parse('a["b"]["c"]', options)).toThrowErrorMatchingSnapshot()
    expect(() =>
      parse('a?.["b"]?.["c"]', options)
    ).toThrowErrorMatchingSnapshot()
    expect(() => parse('a()', options)).toThrowErrorMatchingSnapshot()
    expect(() => parse('a?.()', options)).toThrowErrorMatchingSnapshot()
    expect(() =>
      // eslint-disable-next-line no-template-curly-in-string
      parse('tag`a${b}`', options)
    ).toThrowErrorMatchingSnapshot()
    expect(() =>
      // eslint-disable-next-line no-template-curly-in-string
      parse('`a ${b}`', options)
    ).toThrowErrorMatchingSnapshot()
    expect(() => parse('{ a: 1 }', options)).toThrowErrorMatchingSnapshot()
    expect(() => parse('[1, , 3]', options)).toThrowErrorMatchingSnapshot()
  })
})
