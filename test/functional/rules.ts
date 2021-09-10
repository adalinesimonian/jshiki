import { evaluate, evaluateAsync } from '../../src'

const symbolBeta = Symbol('beta')
function getTestObject() {
  return {
    symbolBeta,
    x: {
      y: {
        z: 'foo',
      },
    },
    a: {
      b: {
        c: 'bar',
      },
    },
    alpha: {
      [symbolBeta]: 'baz',
      beta: {
        gamma: 'qux',
      },
    },
    foo: {
      bar: {
        baz: 'quux',
      },
    },
    wilds: {
      '*': 'quuz',
      '**': 'corge',
    },
    shallow: {
      deep: {
        deeper: {
          deepest: {
            grault: 'garply',
            waldo: 'fred',
          },
        },
      },
    },
  }
}

describe('Rules', () => {
  describe('with explicit allow set to true', () => {
    it('should not be able to access properties w/o matching rule', () => {
      const options = {
        explicitAllow: true,
        rules: [{ allow: 'x.y.z' }, { block: 'a.b' }, { allow: 'symbolBeta' }],
        scope: getTestObject(),
      }
      expect(evaluate('foo', options)).toBeUndefined()
      expect(() => evaluate('foo.bar', options)).toThrowError()
      expect(() => evaluate('foo["b" + "a" + "r"]', options)).toThrowError()
      expect(() => evaluate('alpha[symbolBeta]', options)).toThrowError()
    })

    it('should be able to access properties w/ matching allow rule', () => {
      const options = {
        explicitAllow: true,
        rules: [
          { allow: 'x.y.z' },
          { block: 'a.b' },
          { allow: 'symbolBeta' },
          { allow: ['alpha', symbolBeta] },
        ],
        scope: getTestObject(),
      }
      expect(evaluate('x.y.z', options)).toBe('foo')
      expect(evaluate('x["y"]["z"]', options)).toBe('foo')
      expect(evaluate('alpha[symbolBeta]', options)).toBe('baz')
    })

    it('should not be able to access properties w/ matching block rule', () => {
      const options = {
        explicitAllow: true,
        rules: [
          { allow: 'a' },
          { block: 'a.b' },
          { allow: 'symbolBeta' },
          { allow: 'alpha' },
          { block: ['alpha', symbolBeta] },
        ],
        scope: getTestObject(),
      }
      expect(evaluate('a.b', options)).toBeUndefined()
      expect(evaluate('a["b"]', options)).toBeUndefined()
      expect(() => evaluate('a.b.c', options)).toThrowError()
      expect(() => evaluate('a["b"]["c"]', options)).toThrowError()
      expect(evaluate('alpha[symbolBeta]', options)).toBeUndefined()
    })

    it('should return objects that return the same instances on subsequent property access', () => {
      const options = {
        explicitAllow: true,
        rules: [{ allow: 'x.y.z' }, { block: 'a.b' }],
        scope: getTestObject(),
      }
      const result = evaluate('x', options)
      const y = result.y
      expect(y).toBe(result.y)
    })

    it('should return objects with useless setters', () => {
      const options = {
        explicitAllow: true,
        rules: [{ allow: 'x.y.z' }, { block: 'a.b' }],
        scope: getTestObject(),
      }
      const result = evaluate('x.y', options)
      result.z = 'qux'
      expect(evaluate('x.y.z', options)).toBe('foo')
    })

    it('should ignore rules on non-object, non-function scopes', () => {
      const options = {
        explicitAllow: true,
        rules: [],
        scope: 'str' as any,
      }
      expect(evaluate('length', options)).toBe(3)
    })
  })

  describe('with explicit allow set to false', () => {
    it('should be able to access properties w/o matching rule', () => {
      const options = {
        rules: [{ allow: 'x.y.z' }, { block: 'a.b' }],
        scope: getTestObject(),
      }
      expect(evaluate('foo', options)).toEqual({ bar: { baz: 'quux' } })
      expect(evaluate('foo.bar', options)).toEqual({ baz: 'quux' })
      expect(evaluate('foo["b" + "a" + "r"]', options)).toEqual({ baz: 'quux' })
      expect(evaluate('alpha[symbolBeta]', options)).toBe('baz')
    })

    it('should be able to access properties w/ matching allow rule', () => {
      const options = {
        rules: [
          { allow: 'x.y.z' },
          { block: 'a.b' },
          { allow: ['alpha', symbolBeta] },
        ],
        scope: getTestObject(),
      }
      expect(evaluate('x.y.z', options)).toBe('foo')
      expect(evaluate('x["y"]["z"]', options)).toBe('foo')
      expect(evaluate('alpha[symbolBeta]', options)).toBe('baz')
    })

    it('should not be able to access properties w/ matching block rule', () => {
      const options = {
        rules: [
          { allow: 'a' },
          { block: 'a.b' },
          { block: ['alpha', symbolBeta] },
        ],
        scope: getTestObject(),
      }
      expect(evaluate('a.b', options)).toBeUndefined()
      expect(evaluate('a["b"]', options)).toBeUndefined()
      expect(() => evaluate('a.b.c', options)).toThrowError()
      expect(() => evaluate('a["b"]["c"]', options)).toThrowError()
      expect(evaluate('alpha[symbolBeta]', options)).toBeUndefined()
    })

    it('should return objects that return the same instances on subsequent property access', () => {
      const options = {
        rules: [{ allow: 'x.y.z' }, { block: 'a.b' }],
        scope: getTestObject(),
      }
      const result = evaluate('x', options)
      const y = result.y
      expect(y).toBe(result.y)
    })

    it('should return objects with useless setters', () => {
      const options = {
        rules: [{ allow: 'x.y.z' }, { block: 'a.b' }],
        scope: getTestObject(),
      }
      const result = evaluate('x.y', options)
      result.z = 'qux'
      expect(evaluate('x.y.z', options)).toBe('foo')
    })

    it('should ignore rules on non-object, non-function scopes', () => {
      const options = {
        rules: [{ block: 'length' }],
        scope: 'str' as any,
      }
      expect(evaluate('length', options)).toBe(3)
    })
  })

  describe('Rule parsing', () => {
    it('should support escaped wildcards', () => {
      const options = {
        explicitAllow: true,
        rules: [{ allow: 'wilds.\\*' }, { allow: 'wilds.\\**' }],
        scope: getTestObject(),
      }
      expect(evaluate('wilds["*"]', options)).toBe('quuz')
      expect(evaluate('wilds["**"]', options)).toBe('corge')
    })

    it('should ignore falsy rules', () => {
      const options = {
        rules: [undefined as any],
        scope: getTestObject(),
      }
      expect(() => evaluate('x.y.z', options)).not.toThrow()
    })

    it('should ignore rules with empty paths', () => {
      const options = {
        rules: [{ block: '' }, { block: [] }],
        scope: getTestObject(),
      }
      expect(() => evaluate('x.y.z', options)).not.toThrow()
    })

    it('should respect rule order', () => {
      const options = {
        explicitAllow: true,
        rules: [{ allow: 'a.b.c' }, { block: 'a.b' }, { allow: 'a.b' }],
        scope: getTestObject(),
      }
      expect(evaluate('a.b.c', options)).toBeUndefined()
      expect(evaluate('a.b', options)).toEqual({ c: undefined })
    })

    it('should support wildcards', () => {
      const options = {
        explicitAllow: true,
        rules: [
          { allow: 'a.**' },
          { block: 'a.*.c' },
          { allow: 'shallow.**' },
          { block: 'shallow.**.grault' },
          { allow: 'shallow.**.deepest.waldo' },
        ],
        scope: getTestObject(),
      }
      expect(evaluate('a.b.c', options)).toBeUndefined()
      expect(evaluate('a.b', options)).toEqual({ c: undefined })
      expect(
        evaluate('shallow.deep.deeper.deepest.grault', options)
      ).toBeUndefined()
      expect(evaluate('shallow.deep.deeper.deepest.waldo', options)).toBe(
        'fred'
      )
    })

    it("should throw an error if a rule's path is not a string or string array", () => {
      const options = {
        rules: [{ allow: true as any }],
        scope: getTestObject(),
      }
      expect(() => evaluate('x.y.z', options)).toThrowErrorMatchingSnapshot()
    })

    it("should throw an error if a rule's path part is not a string or a symbol", () => {
      const options = {
        rules: [{ allow: ['x', true as any] }],
        scope: getTestObject(),
      }
      expect(() => evaluate('x.y.z', options)).toThrowErrorMatchingSnapshot()
    })
  })
})

describe('Rules (async)', () => {
  describe('with explicit allow set to true', () => {
    it('should not be able to access properties w/o matching rule', async () => {
      const options = {
        explicitAllow: true,
        rules: [{ allow: 'x.y.z' }, { block: 'a.b' }, { allow: 'symbolBeta' }],
        scope: getTestObject(),
      }
      expect(await evaluateAsync('foo', options)).toBeUndefined()
      expect(async () =>
        evaluateAsync('foo.bar', options)
      ).rejects.toThrowError()
      expect(async () =>
        evaluateAsync('foo["b" + "a" + "r"]', options)
      ).rejects.toThrowError()
      expect(async () =>
        evaluateAsync('alpha[symbolBeta]', options)
      ).rejects.toThrowError()
    })

    it('should be able to access properties w/ matching allow rule', async () => {
      const options = {
        explicitAllow: true,
        rules: [
          { allow: 'x.y.z' },
          { block: 'a.b' },
          { allow: 'symbolBeta' },
          { allow: ['alpha', symbolBeta] },
        ],
        scope: getTestObject(),
      }
      expect(await evaluateAsync('x.y.z', options)).toBe('foo')
      expect(await evaluateAsync('x["y"]["z"]', options)).toBe('foo')
      expect(await evaluateAsync('alpha[symbolBeta]', options)).toBe('baz')
    })

    it('should not be able to access properties w/ matching block rule', async () => {
      const options = {
        explicitAllow: true,
        rules: [
          { allow: 'a' },
          { block: 'a.b' },
          { allow: 'symbolBeta' },
          { allow: 'alpha' },
          { block: ['alpha', symbolBeta] },
        ],
        scope: getTestObject(),
      }
      expect(await evaluateAsync('a.b', options)).toBeUndefined()
      expect(await evaluateAsync('a["b"]', options)).toBeUndefined()
      expect(async () => evaluateAsync('a.b.c', options)).rejects.toThrowError()
      expect(async () =>
        evaluateAsync('a["b"]["c"]', options)
      ).rejects.toThrowError()
      expect(await evaluateAsync('alpha[symbolBeta]', options)).toBeUndefined()
    })

    it('should return objects that return the same instances on subsequent property access', async () => {
      const options = {
        explicitAllow: true,
        rules: [{ allow: 'x.y.z' }, { block: 'a.b' }],
        scope: getTestObject(),
      }
      const result = await evaluateAsync('x', options)
      const y = result.y
      expect(y).toBe(result.y)
    })

    it('should return objects with useless setters', async () => {
      const options = {
        explicitAllow: true,
        rules: [{ allow: 'x.y.z' }, { block: 'a.b' }],
        scope: getTestObject(),
      }
      const result = await evaluateAsync('x.y', options)
      result.z = 'qux'
      expect(await evaluateAsync('x.y.z', options)).toBe('foo')
    })

    it('should ignore rules on non-object, non-function scopes', async () => {
      const options = {
        explicitAllow: true,
        rules: [],
        scope: 'str' as any,
      }
      expect(await evaluateAsync('length', options)).toBe(3)
    })
  })

  describe('with explicit allow set to false', () => {
    it('should be able to access properties w/o matching rule', async () => {
      const options = {
        rules: [{ allow: 'x.y.z' }, { block: 'a.b' }],
        scope: getTestObject(),
      }
      expect(await evaluateAsync('foo', options)).toEqual({
        bar: { baz: 'quux' },
      })
      expect(await evaluateAsync('foo.bar', options)).toEqual({ baz: 'quux' })
      expect(await evaluateAsync('foo["b" + "a" + "r"]', options)).toEqual({
        baz: 'quux',
      })
      expect(await evaluateAsync('alpha[symbolBeta]', options)).toBe('baz')
    })

    it('should be able to access properties w/ matching allow rule', async () => {
      const options = {
        rules: [
          { allow: 'x.y.z' },
          { block: 'a.b' },
          { allow: ['alpha', symbolBeta] },
        ],
        scope: getTestObject(),
      }
      expect(await evaluateAsync('x.y.z', options)).toBe('foo')
      expect(await evaluateAsync('x["y"]["z"]', options)).toBe('foo')
      expect(await evaluateAsync('alpha[symbolBeta]', options)).toBe('baz')
    })

    it('should not be able to access properties w/ matching block rule', async () => {
      const options = {
        rules: [
          { allow: 'a' },
          { block: 'a.b' },
          { block: ['alpha', symbolBeta] },
        ],
        scope: getTestObject(),
      }
      expect(await evaluateAsync('a.b', options)).toBeUndefined()
      expect(await evaluateAsync('a["b"]', options)).toBeUndefined()
      expect(async () => evaluateAsync('a.b.c', options)).rejects.toThrowError()
      expect(async () =>
        evaluateAsync('a["b"]["c"]', options)
      ).rejects.toThrowError()
      expect(await evaluateAsync('alpha[symbolBeta]', options)).toBeUndefined()
    })

    it('should return objects that return the same instances on subsequent property access', async () => {
      const options = {
        rules: [{ allow: 'x.y.z' }, { block: 'a.b' }],
        scope: getTestObject(),
      }
      const result = await evaluateAsync('x', options)
      const y = result.y
      expect(y).toBe(result.y)
    })

    it('should return objects with useless setters', async () => {
      const options = {
        rules: [{ allow: 'x.y.z' }, { block: 'a.b' }],
        scope: getTestObject(),
      }
      const result = await evaluateAsync('x.y', options)
      result.z = 'qux'
      expect(await evaluateAsync('x.y.z', options)).toBe('foo')
    })

    it('should ignore rules on non-object, non-function scopes', async () => {
      const options = {
        rules: [{ block: 'length' }],
        scope: 'str' as any,
      }
      expect(await evaluateAsync('length', options)).toBe(3)
    })
  })

  describe('Rule parsing', () => {
    it('should support escaped wildcards', async () => {
      const options = {
        explicitAllow: true,
        rules: [{ allow: 'wilds.\\*' }, { allow: 'wilds.\\**' }],
        scope: getTestObject(),
      }
      expect(await evaluateAsync('wilds["*"]', options)).toBe('quuz')
      expect(await evaluateAsync('wilds["**"]', options)).toBe('corge')
    })

    it('should ignore falsy rules', async () => {
      const options = {
        rules: [undefined as any],
        scope: getTestObject(),
      }
      expect(async () => evaluateAsync('x.y.z', options)).not.toThrow()
    })

    it('should ignore rules with empty paths', async () => {
      const options = {
        rules: [{ block: '' }, { block: [] }],
        scope: getTestObject(),
      }
      expect(async () => evaluateAsync('x.y.z', options)).not.toThrow()
    })

    it('should respect rule order', async () => {
      const options = {
        explicitAllow: true,
        rules: [{ allow: 'a.b.c' }, { block: 'a.b' }, { allow: 'a.b' }],
        scope: getTestObject(),
      }
      expect(await evaluateAsync('a.b.c', options)).toBeUndefined()
      expect(await evaluateAsync('a.b', options)).toEqual({ c: undefined })
    })

    it('should support wildcards', async () => {
      const options = {
        explicitAllow: true,
        rules: [
          { allow: 'a.**' },
          { block: 'a.*.c' },
          { allow: 'shallow.**' },
          { block: 'shallow.**.grault' },
          { allow: 'shallow.**.deepest.waldo' },
        ],
        scope: getTestObject(),
      }
      expect(await evaluateAsync('a.b.c', options)).toBeUndefined()
      expect(await evaluateAsync('a.b', options)).toEqual({ c: undefined })
      expect(
        await evaluateAsync('shallow.deep.deeper.deepest.grault', options)
      ).toBeUndefined()
      expect(
        await evaluateAsync('shallow.deep.deeper.deepest.waldo', options)
      ).toBe('fred')
    })

    it("should throw an error if a rule's path is not a string or string array", () => {
      const options = {
        rules: [{ allow: true as any }],
        scope: getTestObject(),
      }
      expect(async () =>
        evaluateAsync('x.y.z', options)
      ).rejects.toThrowErrorMatchingSnapshot()
    })

    it("should throw an error if a rule's path part is not a string or a symbol", () => {
      const options = {
        rules: [{ allow: ['x', true as any] }],
        scope: getTestObject(),
      }
      expect(async () =>
        evaluateAsync('x.y.z', options)
      ).rejects.toThrowErrorMatchingSnapshot()
    })
  })
})
