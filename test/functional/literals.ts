import { describe, it, expect, vi } from 'vitest'
import { evaluate, evaluateAsync, parse, parseAsync } from '../../src'

describe('Literals', () => {
  it('should parse null', () => {
    expect(evaluate('null')).toBeNull()
  })

  it('should parse undefined', () => {
    expect(evaluate('undefined')).toBeUndefined()
  })

  describe('Boolean Literals', () => {
    it('should parse true', () => {
      expect(evaluate('true')).toBe(true)
    })

    it('should parse false', () => {
      expect(evaluate('false')).toBe(false)
    })
  })

  describe('Numeric Literals', () => {
    it('should parse integers', () => {
      expect(evaluate('5')).toBe(5)
    })

    it('should parse NaN', () => {
      expect(evaluate('NaN')).toBeNaN()
    })

    it('should parse Infinity', () => {
      expect(evaluate('Infinity')).toBe(Infinity)
    })

    it('should parse -Infinity', () => {
      expect(evaluate('-Infinity')).toBe(-Infinity)
    })

    it('should parse floating-point numbers', () => {
      expect(evaluate('5.3')).toBe(5.3)
    })

    it('should parse scientific notation', () => {
      expect(evaluate('5e3')).toBe(5000)
      expect(evaluate('5e-3')).toBeCloseTo(0.005)
      expect(evaluate('5e+3')).toBe(5000)
    })

    it('should throw when the expression contains an invalid numeric literal', () => {
      expect(() => parse('1.2.3')).toThrowErrorMatchingSnapshot()
      expect(() => parse('05')).toThrowErrorMatchingSnapshot()
      expect(() => parse('5ex')).toThrowErrorMatchingSnapshot()
      expect(() => parse('5e-x')).toThrowErrorMatchingSnapshot()
      expect(() => parse('5e+x')).toThrowErrorMatchingSnapshot()
      expect(() => parse('5e')).toThrowErrorMatchingSnapshot()
      expect(() => parse('5e+')).toThrowErrorMatchingSnapshot()
      expect(() => parse('5e-')).toThrowErrorMatchingSnapshot()
      expect(() => parse('5x')).toThrowErrorMatchingSnapshot()
    })
  })

  describe('String Literals', () => {
    it('should parse single-quoted strings', () => {
      expect(evaluate("'x'")).toBe('x')
    })

    it('should parse double-quoted strings', () => {
      expect(evaluate('"x"')).toBe('x')
    })

    it('should parse multi-line strings', () => {
      expect(evaluate('"x\\\ny"')).toBe('xy')
      expect(evaluate('"x\\\r\ny"')).toBe('xy')
    })

    it('should parse escape sequences', () => {
      expect(evaluate('"\\n"')).toBe('\n')
      expect(evaluate('"\\t"')).toBe('\t')
      expect(evaluate('"\\r"')).toBe('\r')
      expect(evaluate('"\\b"')).toBe('\b')
      expect(evaluate('"\\f"')).toBe('\f')
      expect(evaluate('"\\v"')).toBe('\v')
      expect(evaluate('"\\\\"')).toBe('\\')
      expect(evaluate('"\\\'"')).toBe("'")
      expect(evaluate('"\\""')).toBe('"')
      expect(evaluate('"\\\'"')).toBe("'")
      expect(evaluate("'\\''")).toBe("'")
      expect(evaluate('"\\u00A0"')).toBe('\u00A0')
      expect(evaluate('"\\u00A0"')).toBe('\u00A0')
      expect(evaluate('"\\u2028"')).toBe('\u2028')
      expect(evaluate('"\\u2029"')).toBe('\u2029')
      expect(evaluate('"\\u{10460}"')).toBe('\u{10460}')
      expect(evaluate('"\\x4F"')).toBe('\x4F')
    })

    it('should throw when the string literal is missing a quote', () => {
      expect(() => parse('"x')).toThrowErrorMatchingSnapshot()
      expect(() => parse('x"')).toThrowErrorMatchingSnapshot()
      expect(() => parse("'x")).toThrowErrorMatchingSnapshot()
      expect(() => parse("x'")).toThrowErrorMatchingSnapshot()
    })

    it('should throw when the string literal contains an unexpected line break', () => {
      expect(() => parse('"x\n"')).toThrowErrorMatchingSnapshot()
      expect(() => parse('"x\r"')).toThrowErrorMatchingSnapshot()
      expect(() => parse('"x\r\n"')).toThrowErrorMatchingSnapshot()
      expect(() => parse("'x\n'")).toThrowErrorMatchingSnapshot()
      expect(() => parse("'x\r'")).toThrowErrorMatchingSnapshot()
      expect(() => parse("'x\r\n'")).toThrowErrorMatchingSnapshot()
    })

    it('should throw when the string literal contains an invalid escape sequence', () => {
      expect(() => parse('"\\x"')).toThrowErrorMatchingSnapshot()
      expect(() => parse('"\\u"')).toThrowErrorMatchingSnapshot()
      expect(() => parse('"\\u{}"')).toThrowErrorMatchingSnapshot()
      expect(() => parse('"\\u{"')).toThrowErrorMatchingSnapshot()
    })
  })

  describe('Template Literals', () => {
    it('should parse template literals', () => {
      expect(evaluate('`x`')).toBe('x')
    })

    it('should parse template literals with expressions', () => {
      expect(evaluate('`x${1}y${a}z`', { scope: { a: 2 } })).toBe('x1y2z')
    })

    it('should parse template literals with multi-line expressions', () => {
      expect(evaluate('`x\n${1}y\n${a}z`', { scope: { a: 2 } })).toBe(
        'x\n1y\n2z',
      )
    })

    it('should parse template literals with multi-line expressions and expressions with line breaks', () => {
      expect(evaluate('`x\n${\n1\n}y\n${\na\n}z`', { scope: { a: 2 } })).toBe(
        'x\n1y\n2z',
      )
    })

    it('should parse tagged template literals', () => {
      const tag = vi.fn((strs: TemplateStringsArray, ...exprs: any[]) =>
        strs
          .map((str, i) => str + (exprs.length > i ? exprs[i] * 2 : ''))
          .join(''),
      )

      expect(evaluate('tag`x\\n${1}\\x4F${a}`', { scope: { tag, a: 2 } })).toBe(
        'x\n2\x4F4',
      )
      expect(tag).toHaveBeenCalledTimes(1)
      expect(tag).toHaveBeenCalledWith(
        Object.assign(['x\n', '\x4F', ''], { raw: ['x\\n', '\\x4F', ''] }),
        1,
        2,
      )
    })

    it('should parse escape sequences', () => {
      expect(evaluate('`\\n`')).toBe('\n')
      expect(evaluate('`\\t`')).toBe('\t')
      expect(evaluate('`\\r`')).toBe('\r')
      expect(evaluate('`\\b`')).toBe('\b')
      expect(evaluate('`\\f`')).toBe('\f')
      expect(evaluate('`\\v`')).toBe('\v')
      expect(evaluate('`\\\\`')).toBe('\\')
      expect(evaluate('`\\``')).toBe('`')
      expect(evaluate("`\\'`")).toBe("'")
      expect(evaluate('`\\"`')).toBe('"')
      expect(evaluate('`\\u00A0`')).toBe('\u00A0')
      expect(evaluate('`\\u00A0`')).toBe('\u00A0')
      expect(evaluate('`\\u2028`')).toBe('\u2028')
      expect(evaluate('`\\u2029`')).toBe('\u2029')
      expect(evaluate('`\\u{10460}`')).toBe('\u{10460}')
      expect(evaluate('`\\x4F`')).toBe('\x4F')
    })

    it('should throw when the template literal is missing a backtick', () => {
      expect(() => parse('`x')).toThrowErrorMatchingSnapshot()
      expect(() => parse('x`')).toThrowErrorMatchingSnapshot()
    })

    it('should throw when the string literal contains an invalid escape sequence', () => {
      expect(() => parse('`\\x`')).toThrowErrorMatchingSnapshot()
      expect(() => parse('`\\u`')).toThrowErrorMatchingSnapshot()
      expect(() => parse('`\\u{}`')).toThrowErrorMatchingSnapshot()
      expect(() => parse('`\\u{`')).toThrowErrorMatchingSnapshot()
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

    it('should parse object literals with trailing comma', () => {
      expect(evaluate("{ x: 1, y: { a: '2' }, z: '3', }")).toEqual({
        x: 1,
        y: { a: '2' },
        z: '3',
      })
    })

    it('should parse object literals with line breaks', () => {
      expect(evaluate("{\nx: 1,\ny: {\na: '2'\n},\nz: '3'\n}")).toEqual({
        x: 1,
        y: { a: '2' },
        z: '3',
      })
    })

    it('should parse object literals with computed properties', () => {
      expect(
        evaluate("{ [x]: 1, y: '2', [z + '']: '3' }", {
          scope: { x: 'a', y: 'b', z: 'c' },
        }),
      ).toEqual({ a: 1, y: '2', c: '3' })
    })

    it('should parse object literals with spread properties', () => {
      expect(
        evaluate('{ x, y, ...z }', { scope: { x: 1, y: '2', z: { a: '3' } } }),
      ).toEqual({ x: 1, y: '2', a: '3' })
    })

    it('should throw when the object literal is missing a curly brace', () => {
      expect(() => parse('{ x: 1, y: 2')).toThrowErrorMatchingSnapshot()
      expect(() => parse('x: 1, y: 2}')).toThrowErrorMatchingSnapshot()
    })

    it('should throw when the object literal is missing a colon', () => {
      expect(() => parse('{ x 1, y: 2 }')).toThrowErrorMatchingSnapshot()
    })

    it('should throw when the object literal is missing a value', () => {
      expect(() => parse('{ x: }')).toThrowErrorMatchingSnapshot()
    })

    it('should throw when the object literal is missing a key', () => {
      expect(() => parse('{ : 1 }')).toThrowErrorMatchingSnapshot()
    })

    it('should throw when using a getter', () => {
      expect(() => parse('{ get x() {} }')).toThrowErrorMatchingSnapshot()
    })

    it('should throw when using a setter', () => {
      expect(() => parse('{ set x() {} }')).toThrowErrorMatchingSnapshot()
    })

    it('should throw when using a method', () => {
      expect(() => parse('{ x() {} }')).toThrowErrorMatchingSnapshot()
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

    it('should parse array literals with trailing commas', () => {
      expect(evaluate('[1, 2, 3,]')).toEqual([1, 2, 3])
    })

    it('should parse array literals with line breaks', () => {
      expect(evaluate('[\n1,\n2,\n3\n]')).toEqual([1, 2, 3])
    })

    it('should parse sparse array literals', () => {
      const result = evaluate('[1,,2]')
      // eslint-disable-next-line no-sparse-arrays
      expect(result).toEqual([1, , 2])
      const result2: any[] = []
      result.forEach((element: any) => {
        result2.push(element)
      })
      expect(result2).toEqual([1, 2])
    })

    it('should parse array literals with spread elements', () => {
      expect(evaluate('[1, ...[2, 3], 4]')).toEqual([1, 2, 3, 4])
    })
  })
})

describe('Literals (async)', () => {
  it('should parse null', async () => {
    expect(await evaluateAsync('null')).toBeNull()
  })

  it('should parse undefined', async () => {
    expect(await evaluateAsync('undefined')).toBeUndefined()
  })

  describe('Boolean Literals', () => {
    it('should parse true', async () => {
      expect(await evaluateAsync('true')).toBe(true)
    })

    it('should parse false', async () => {
      expect(await evaluateAsync('false')).toBe(false)
    })
  })

  describe('Numeric Literals', () => {
    it('should parse integers', async () => {
      expect(await evaluateAsync('5')).toBe(5)
    })

    it('should parse NaN', async () => {
      expect(await evaluateAsync('NaN')).toBeNaN()
    })

    it('should parse Infinity', async () => {
      expect(await evaluateAsync('Infinity')).toBe(Infinity)
    })

    it('should parse -Infinity', async () => {
      expect(await evaluateAsync('-Infinity')).toBe(-Infinity)
    })

    it('should parse floating-point numbers', async () => {
      expect(await evaluateAsync('5.3')).toBe(5.3)
    })

    it('should parse scientific notation', async () => {
      expect(await evaluateAsync('5e3')).toBe(5000)
      expect(await evaluateAsync('5e-3')).toBeCloseTo(0.005)
      expect(await evaluateAsync('5e+3')).toBe(5000)
    })

    it('should throw when the expression contains an invalid numeric literal', async () => {
      await expect(async () =>
        parseAsync('1.2.3'),
      ).rejects.toThrowErrorMatchingSnapshot()
      await expect(async () =>
        parseAsync('05'),
      ).rejects.toThrowErrorMatchingSnapshot()
      await expect(async () =>
        parseAsync('5ex'),
      ).rejects.toThrowErrorMatchingSnapshot()
      await expect(async () =>
        parseAsync('5e-x'),
      ).rejects.toThrowErrorMatchingSnapshot()
      await expect(async () =>
        parseAsync('5e+x'),
      ).rejects.toThrowErrorMatchingSnapshot()
      await expect(async () =>
        parseAsync('5e'),
      ).rejects.toThrowErrorMatchingSnapshot()
      await expect(async () =>
        parseAsync('5e+'),
      ).rejects.toThrowErrorMatchingSnapshot()
      await expect(async () =>
        parseAsync('5e-'),
      ).rejects.toThrowErrorMatchingSnapshot()
      await expect(async () =>
        parseAsync('5x'),
      ).rejects.toThrowErrorMatchingSnapshot()
    })
  })

  describe('String Literals', () => {
    it('should parse single-quoted strings', async () => {
      expect(await evaluateAsync("'x'")).toBe('x')
    })

    it('should parse double-quoted strings', async () => {
      expect(await evaluateAsync('"x"')).toBe('x')
    })

    it('should parse multi-line strings', async () => {
      expect(await evaluateAsync('"x\\\ny"')).toBe('xy')
      expect(await evaluateAsync('"x\\\r\ny"')).toBe('xy')
    })

    it('should parse escape sequences', async () => {
      expect(await evaluateAsync('"\\n"')).toBe('\n')
      expect(await evaluateAsync('"\\t"')).toBe('\t')
      expect(await evaluateAsync('"\\r"')).toBe('\r')
      expect(await evaluateAsync('"\\b"')).toBe('\b')
      expect(await evaluateAsync('"\\f"')).toBe('\f')
      expect(await evaluateAsync('"\\v"')).toBe('\v')
      expect(await evaluateAsync('"\\\\"')).toBe('\\')
      expect(await evaluateAsync('"\\\'"')).toBe("'")
      expect(await evaluateAsync('"\\""')).toBe('"')
      expect(await evaluateAsync('"\\\'"')).toBe("'")
      expect(await evaluateAsync("'\\''")).toBe("'")
      expect(await evaluateAsync('"\\u00A0"')).toBe('\u00A0')
      expect(await evaluateAsync('"\\u00A0"')).toBe('\u00A0')
      expect(await evaluateAsync('"\\u2028"')).toBe('\u2028')
      expect(await evaluateAsync('"\\u2029"')).toBe('\u2029')
      expect(await evaluateAsync('"\\u{10460}"')).toBe('\u{10460}')
      expect(await evaluateAsync('"\\x4F"')).toBe('\x4F')
    })

    it('should throw when the string literal is missing a quote', async () => {
      await expect(async () =>
        parseAsync('"x'),
      ).rejects.toThrowErrorMatchingSnapshot()
      await expect(async () =>
        parseAsync('x"'),
      ).rejects.toThrowErrorMatchingSnapshot()
      await expect(async () =>
        parseAsync("'x"),
      ).rejects.toThrowErrorMatchingSnapshot()
      await expect(async () =>
        parseAsync("x'"),
      ).rejects.toThrowErrorMatchingSnapshot()
    })

    it('should throw when the string literal contains an unexpected line break', async () => {
      await expect(async () =>
        parseAsync('"x\n"'),
      ).rejects.toThrowErrorMatchingSnapshot()
      await expect(async () =>
        parseAsync('"x\r"'),
      ).rejects.toThrowErrorMatchingSnapshot()
      await expect(async () =>
        parseAsync('"x\r\n"'),
      ).rejects.toThrowErrorMatchingSnapshot()
      await expect(async () =>
        parseAsync("'x\n'"),
      ).rejects.toThrowErrorMatchingSnapshot()
      await expect(async () =>
        parseAsync("'x\r'"),
      ).rejects.toThrowErrorMatchingSnapshot()
      await expect(async () =>
        parseAsync("'x\r\n'"),
      ).rejects.toThrowErrorMatchingSnapshot()
    })

    it('should throw when the string literal contains an invalid escape sequence', async () => {
      await expect(async () =>
        parseAsync('"\\x"'),
      ).rejects.toThrowErrorMatchingSnapshot()
      await expect(async () =>
        parseAsync('"\\u"'),
      ).rejects.toThrowErrorMatchingSnapshot()
      await expect(async () =>
        parseAsync('"\\u{}"'),
      ).rejects.toThrowErrorMatchingSnapshot()
      await expect(async () =>
        parseAsync('"\\u{"'),
      ).rejects.toThrowErrorMatchingSnapshot()
    })
  })

  describe('Template Literals', () => {
    it('should parse template literals', async () => {
      expect(await evaluateAsync('`x`')).toBe('x')
    })

    it('should parse template literals with expressions', async () => {
      expect(await evaluateAsync('`x${1}y${a}z`', { scope: { a: 2 } })).toBe(
        'x1y2z',
      )
    })

    it('should parse template literals with multi-line expressions', async () => {
      expect(
        await evaluateAsync('`x\n${1}y\n${a}z`', { scope: { a: 2 } }),
      ).toBe('x\n1y\n2z')
    })

    it('should parse template literals with multi-line expressions and expressions with line breaks', async () => {
      expect(
        await evaluateAsync('`x\n${\n1\n}y\n${\na\n}z`', { scope: { a: 2 } }),
      ).toBe('x\n1y\n2z')
    })

    it('should parse tagged template literals', async () => {
      const tag = vi.fn((strs: TemplateStringsArray, ...exprs: any[]) =>
        strs
          .map((str, i) => str + (exprs.length > i ? exprs[i] * 2 : ''))
          .join(''),
      )
      expect(
        await evaluateAsync('tag`x\\n${1}\\x4F${a}`', { scope: { tag, a: 2 } }),
      ).toBe('x\n2\x4F4')
      expect(tag).toHaveBeenCalledTimes(1)
      expect(tag).toHaveBeenCalledWith(
        Object.assign(['x\n', '\x4F', ''], { raw: ['x\\n', '\\x4F', ''] }),
        1,
        2,
      )
    })

    it('should parse escape sequences', async () => {
      expect(await evaluateAsync('`\\n`')).toBe('\n')
      expect(await evaluateAsync('`\\t`')).toBe('\t')
      expect(await evaluateAsync('`\\r`')).toBe('\r')
      expect(await evaluateAsync('`\\b`')).toBe('\b')
      expect(await evaluateAsync('`\\f`')).toBe('\f')
      expect(await evaluateAsync('`\\v`')).toBe('\v')
      expect(await evaluateAsync('`\\\\`')).toBe('\\')
      expect(await evaluateAsync('`\\``')).toBe('`')
      expect(await evaluateAsync("`\\'`")).toBe("'")
      expect(await evaluateAsync('`\\"`')).toBe('"')
      expect(await evaluateAsync('`\\u00A0`')).toBe('\u00A0')
      expect(await evaluateAsync('`\\u00A0`')).toBe('\u00A0')
      expect(await evaluateAsync('`\\u2028`')).toBe('\u2028')
      expect(await evaluateAsync('`\\u2029`')).toBe('\u2029')
      expect(await evaluateAsync('`\\u{10460}`')).toBe('\u{10460}')
      expect(await evaluateAsync('`\\x4F`')).toBe('\x4F')
    })

    it('should throw when the template literal is missing a backtick', async () => {
      await expect(async () =>
        parseAsync('`x'),
      ).rejects.toThrowErrorMatchingSnapshot()
      await expect(async () =>
        parseAsync('x`'),
      ).rejects.toThrowErrorMatchingSnapshot()
    })

    it('should throw when the string literal contains an invalid escape sequence', async () => {
      await expect(async () =>
        parseAsync('`\\x`'),
      ).rejects.toThrowErrorMatchingSnapshot()
      await expect(async () =>
        parseAsync('`\\u`'),
      ).rejects.toThrowErrorMatchingSnapshot()
      await expect(async () =>
        parseAsync('`\\u{}`'),
      ).rejects.toThrowErrorMatchingSnapshot()
      await expect(async () =>
        parseAsync('`\\u{`'),
      ).rejects.toThrowErrorMatchingSnapshot()
    })
  })

  describe('Object Literals', () => {
    it('should parse empty object literals', async () => {
      expect(await evaluateAsync('{}')).toEqual({})
    })

    it('should parse object literals', async () => {
      expect(await evaluateAsync("{ x: 1, y: '2', z: '3' }")).toEqual({
        x: 1,
        y: '2',
        z: '3',
      })
    })

    it('should parse nested object literals', async () => {
      expect(await evaluateAsync("{ x: 1, y: { a: '2' }, z: '3' }")).toEqual({
        x: 1,
        y: { a: '2' },
        z: '3',
      })
    })

    it('should parse object literals with trailing comma', async () => {
      expect(await evaluateAsync("{ x: 1, y: { a: '2' }, z: '3', }")).toEqual({
        x: 1,
        y: { a: '2' },
        z: '3',
      })
    })

    it('should parse object literals with line breaks', async () => {
      expect(
        await evaluateAsync("{\nx: 1,\ny: {\na: '2'\n},\nz: '3'\n}"),
      ).toEqual({
        x: 1,
        y: { a: '2' },
        z: '3',
      })
    })

    it('should parse object literals with computed properties', async () => {
      expect(
        await evaluateAsync("{ [x]: 1, y: '2', [z + '']: '3' }", {
          scope: { x: 'a', y: 'b', z: 'c' },
        }),
      ).toEqual({ a: 1, y: '2', c: '3' })
    })

    it('should parse object literals with spread properties', async () => {
      expect(
        await evaluateAsync('{ x, y, ...z }', {
          scope: { x: 1, y: '2', z: { a: '3' } },
        }),
      ).toEqual({ x: 1, y: '2', a: '3' })
    })

    it('should throw when the object literal is missing a curly brace', async () => {
      await expect(async () =>
        parseAsync('{ x: 1, y: 2'),
      ).rejects.toThrowErrorMatchingSnapshot()
      await expect(async () =>
        parseAsync('x: 1, y: 2}'),
      ).rejects.toThrowErrorMatchingSnapshot()
    })

    it('should throw when the object literal is missing a colon', async () => {
      await expect(async () =>
        parseAsync('{ x 1, y: 2 }'),
      ).rejects.toThrowErrorMatchingSnapshot()
    })

    it('should throw when the object literal is missing a value', async () => {
      await expect(async () =>
        parseAsync('{ x: }'),
      ).rejects.toThrowErrorMatchingSnapshot()
    })

    it('should throw when the object literal is missing a key', async () => {
      await expect(async () =>
        parseAsync('{ : 1 }'),
      ).rejects.toThrowErrorMatchingSnapshot()
    })

    it('should throw when using a getter', async () => {
      await expect(async () =>
        parseAsync('{ get x() {} }'),
      ).rejects.toThrowErrorMatchingSnapshot()
    })

    it('should throw when using a setter', async () => {
      await expect(async () =>
        parseAsync('{ set x() {} }'),
      ).rejects.toThrowErrorMatchingSnapshot()
    })

    it('should throw when using a method', async () => {
      await expect(async () =>
        parseAsync('{ x() {} }'),
      ).rejects.toThrowErrorMatchingSnapshot()
    })
  })

  describe('Array Literals', () => {
    it('should parse empty array literals', async () => {
      expect(await evaluateAsync('[]')).toEqual([])
    })

    it('should parse numeric array literals', async () => {
      expect(await evaluateAsync('[1, 2, 3]')).toEqual([1, 2, 3])
    })

    it('should parse string array literals', async () => {
      expect(await evaluateAsync("['1', '2', '3']")).toEqual(['1', '2', '3'])
    })

    it('should parse object array literals', async () => {
      expect(
        await evaluateAsync("[{ x: '1' }, { y: '2' }, { z: '3' }]"),
      ).toEqual([{ x: '1' }, { y: '2' }, { z: '3' }])
    })

    it('should parse nested array literals', async () => {
      expect(await evaluateAsync('[[1, 2], [3, 4], [5, 6]]')).toEqual([
        [1, 2],
        [3, 4],
        [5, 6],
      ])
    })

    it('should parse mixed-type array literals', async () => {
      expect(await evaluateAsync("[1, { y: '2' }, '3', [4, 5]]")).toEqual([
        1,
        { y: '2' },
        '3',
        [4, 5],
      ])
    })

    it('should parse array literals with trailing commas', async () => {
      expect(await evaluateAsync('[1, 2, 3,]')).toEqual([1, 2, 3])
    })

    it('should parse array literals with line breaks', async () => {
      expect(await evaluateAsync('[\n1,\n2,\n3\n]')).toEqual([1, 2, 3])
    })

    it('should parse sparse array literals', async () => {
      const result = await evaluateAsync('[1,,2]')
      // eslint-disable-next-line no-sparse-arrays
      expect(result).toEqual([1, , 2])
      const result2: any[] = []
      result.forEach((element: any) => {
        result2.push(element)
      })
      expect(result2).toEqual([1, 2])
    })

    it('should parse array literals with spread elements', async () => {
      expect(await evaluateAsync('[1, ...[2, 3], 4]')).toEqual([1, 2, 3, 4])
    })
  })
})
