import { evaluate, evaluateAsync, parse, parseAsync } from '../../src'

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
    expect(evaluate('/x/g')).toEqual(/x/g)
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
        regexes: true,
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
    expect(evaluate('/x/g')).toEqual(/x/g)
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
        regexes: false,
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
    expect(() => parse('/x/g', options)).toThrowErrorMatchingSnapshot()
  })
})

describe('Syntax options (async)', () => {
  it('should allow all supported syntax by default', async () => {
    expect(
      await evaluateAsync('a.b.c', { scope: { a: { b: { c: 1 } } } })
    ).toBe(1)
    expect(
      await evaluateAsync('a?.b?.c', { scope: { a: { b: { c: 1 } } } })
    ).toBe(1)
    expect(
      await evaluateAsync('a["b"]["c"]', { scope: { a: { b: { c: 1 } } } })
    ).toBe(1)
    expect(
      await evaluateAsync('a?.["b"]?.["c"]', { scope: { a: { b: { c: 1 } } } })
    ).toBe(1)
    expect(await evaluateAsync('a()', { scope: { a: () => 1 } })).toBe(1)
    expect(await evaluateAsync('a?.()', { scope: { a: () => 1 } })).toBe(1)
    expect(
      // eslint-disable-next-line no-template-curly-in-string
      await evaluateAsync('tag`a${b}`', {
        scope: {
          b: 1,
          tag: (strings: TemplateStringsArray, expression: number) =>
            `got ${strings.join('')} and ${expression}`,
        },
      })
    ).toBe('got a and 1')
    // eslint-disable-next-line no-template-curly-in-string
    expect(await evaluateAsync('`a ${b}`', { scope: { b: 1 } })).toBe('a 1')
    expect(await evaluateAsync('{ a: 1 }')).toEqual({ a: 1 })
    // eslint-disable-next-line no-sparse-arrays
    expect(await evaluateAsync('[1, , 3]')).toEqual([1, , 3])
    expect(await evaluateAsync('/x/g')).toEqual(/x/g)
  })

  it('should allow syntax when corresponding option is set to true', async () => {
    const options = {
      syntax: {
        memberAccess: true,
        calls: true,
        taggedTemplates: true,
        templates: true,
        objects: true,
        arrays: true,
        regexes: true,
      },
    }

    expect(
      await evaluateAsync('a.b.c', {
        ...options,
        scope: { a: { b: { c: 1 } } },
      })
    ).toBe(1)
    expect(
      await evaluateAsync('a?.b?.c', {
        ...options,
        scope: { a: { b: { c: 1 } } },
      })
    ).toBe(1)
    expect(
      await evaluateAsync('a["b"]["c"]', {
        ...options,
        scope: { a: { b: { c: 1 } } },
      })
    ).toBe(1)
    expect(
      await evaluateAsync('a?.["b"]?.["c"]', {
        ...options,
        scope: { a: { b: { c: 1 } } },
      })
    ).toBe(1)
    expect(
      await evaluateAsync('a()', { ...options, scope: { a: () => 1 } })
    ).toBe(1)
    expect(
      await evaluateAsync('a?.()', { ...options, scope: { a: () => 1 } })
    ).toBe(1)
    expect(
      // eslint-disable-next-line no-template-curly-in-string
      await evaluateAsync('tag`a${b}`', {
        ...options,
        scope: {
          b: 1,
          tag: (strings: TemplateStringsArray, expression: number) =>
            `got ${strings.join('')} and ${expression}`,
        },
      })
    ).toBe('got a and 1')
    expect(
      // eslint-disable-next-line no-template-curly-in-string
      await evaluateAsync('`a ${b}`', { ...options, scope: { b: 1 } })
    ).toBe('a 1')
    expect(await evaluateAsync('{ a: 1 }', options)).toEqual({ a: 1 })
    // eslint-disable-next-line no-sparse-arrays
    expect(await evaluateAsync('[1, , 3]', options)).toEqual([1, , 3])
    expect(await evaluateAsync('/x/g')).toEqual(/x/g)
  })

  it('should block syntax when corresponding option is set to false', async () => {
    const options = {
      syntax: {
        memberAccess: false,
        calls: false,
        taggedTemplates: false,
        templates: false,
        objects: false,
        arrays: false,
        regexes: false,
      },
    }

    expect(async () =>
      parseAsync('a.b.c', options)
    ).rejects.toThrowErrorMatchingSnapshot()
    expect(async () =>
      parseAsync('a?.b?.c', options)
    ).rejects.toThrowErrorMatchingSnapshot()
    expect(async () =>
      parseAsync('a["b"]["c"]', options)
    ).rejects.toThrowErrorMatchingSnapshot()
    expect(async () =>
      parseAsync('a?.["b"]?.["c"]', options)
    ).rejects.toThrowErrorMatchingSnapshot()
    expect(async () =>
      parseAsync('a()', options)
    ).rejects.toThrowErrorMatchingSnapshot()
    expect(async () =>
      parseAsync('a?.()', options)
    ).rejects.toThrowErrorMatchingSnapshot()
    expect(async () =>
      // eslint-disable-next-line no-template-curly-in-string
      parseAsync('tag`a${b}`', options)
    ).rejects.toThrowErrorMatchingSnapshot()
    expect(async () =>
      // eslint-disable-next-line no-template-curly-in-string
      parseAsync('`a ${b}`', options)
    ).rejects.toThrowErrorMatchingSnapshot()
    expect(async () =>
      parseAsync('{ a: 1 }', options)
    ).rejects.toThrowErrorMatchingSnapshot()
    expect(async () =>
      parseAsync('[1, , 3]', options)
    ).rejects.toThrowErrorMatchingSnapshot()
    expect(async () =>
      parseAsync('/x/g', options)
    ).rejects.toThrowErrorMatchingSnapshot()
  })
})
