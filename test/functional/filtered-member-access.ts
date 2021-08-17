import { evaluate } from '../../src'

const symbolBeta = Symbol('beta')
function getTestObject() {
  return {
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
  }
}

describe('Filtered Member Access', () => {
  describe('with explicit allow set to true', () => {
    it('should not be able to access properties w/o matching rule', () => {
      const options = {
        explicitAllow: true,
        rules: [{ allow: 'x.y.z' }, { block: 'a.b' }],
        scope: getTestObject(),
      }
      expect(evaluate('foo', options)).toBeUndefined()
      expect(() => evaluate('foo.bar', options)).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluate('foo["b" + "a" + "r"]', options)
      ).toThrowErrorMatchingSnapshot()
    })

    it('should be able to access properties w/ matching allow rule', () => {
      const options = {
        explicitAllow: true,
        rules: [{ allow: 'x.y.z' }, { block: 'a.b' }],
        scope: getTestObject(),
      }
      expect(evaluate('x.y.z', options)).toBe('foo')
      expect(evaluate('x["y"]["z"]', options)).toBe('foo')
    })

    it('should not be able to access properties w/ matching block rule', () => {
      const options = {
        explicitAllow: true,
        rules: [{ allow: 'a' }, { block: 'a.b' }],
        scope: getTestObject(),
      }
      expect(evaluate('a.b', options)).toBeUndefined()
      expect(evaluate('a["b"]', options)).toBeUndefined()
      expect(() => evaluate('a.b.c', options)).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluate('a["b"]["c"]', options)
      ).toThrowErrorMatchingSnapshot()
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
    })

    it('should be able to access properties w/ matching allow rule', () => {
      const options = {
        rules: [{ allow: 'x.y.z' }, { block: 'a.b' }],
        scope: getTestObject(),
      }
      expect(evaluate('x.y.z', options)).toBe('foo')
      expect(evaluate('x["y"]["z"]', options)).toBe('foo')
    })

    it('should not be able to access properties w/ matching block rule', () => {
      const options = {
        rules: [{ allow: 'a' }, { block: 'a.b' }],
        scope: getTestObject(),
      }
      expect(evaluate('a.b', options)).toBeUndefined()
      expect(evaluate('a["b"]', options)).toBeUndefined()
      expect(() => evaluate('a.b.c', options)).toThrowErrorMatchingSnapshot()
      expect(() =>
        evaluate('a["b"]["c"]', options)
      ).toThrowErrorMatchingSnapshot()
    })
  })
})
