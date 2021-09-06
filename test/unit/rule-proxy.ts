import getRuleProxy from '../../src/rule-proxy'
import RuleTree from '../../src/rule-tree'

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

describe('Rule Proxy', () => {
  it('should be able to create a rule proxy', () => {
    const proxy = getRuleProxy({}, new RuleTree())
    expect(proxy).toBeDefined()
  })

  it('should pass through proxy-incompatible types', () => {
    const proxy = getRuleProxy('str' as any, new RuleTree())
    expect(proxy).toBe('str')
  })

  it('should not allow setting properties', () => {
    const obj = getTestObject()
    const proxy = getRuleProxy(obj, new RuleTree())
    proxy.a.b.c = 'd'
    expect(obj.a.b.c).toBe('bar')
  })

  it('should cache returned values', () => {
    const obj = getTestObject()
    const proxy = getRuleProxy(obj, new RuleTree())
    const result = proxy.x
    expect(result).toBe(proxy.x)
  })

  describe('with explicit allow set to true', () => {
    it('should block accessing properties w/o applicable rule', () => {
      const ruleTree = new RuleTree([
        { allow: 'x.y.z' },
        { block: ['a', 'b', 'c'] },
        { allow: ['alpha', symbolBeta] },
      ])
      const proxy = getRuleProxy(getTestObject(), ruleTree, true)
      expect(proxy.foo).toBe(undefined)
    })

    it('should allow accessing properties w/ allow rule', () => {
      const ruleTree = new RuleTree([
        { block: '**.z' },
        { allow: 'x.y.z' },
        { allow: ['alpha', symbolBeta] },
      ])
      const proxy = getRuleProxy(getTestObject(), ruleTree, true)
      expect(proxy.x.y.z).toBe('foo')
      expect(proxy.alpha[symbolBeta]).toBe('baz')
    })

    it('should block accessing properties w/ block rule', () => {
      const ruleTree = new RuleTree([
        { allow: '**.z' },
        { block: 'x.y.z' },
        { block: ['alpha', symbolBeta] },
      ])
      const proxy = getRuleProxy(getTestObject(), ruleTree, true)
      expect(proxy.x.y.z).toBeUndefined()
      expect(proxy.alpha[symbolBeta]).toBeUndefined()
    })
  })

  describe('with explicit allow set to false', () => {
    it('should allow accessing properties w/o applicable rule', () => {
      const ruleTree = new RuleTree([
        { allow: 'x.y.z' },
        { block: ['a', 'b', 'c'] },
        { allow: ['alpha', symbolBeta] },
      ])
      const proxy = getRuleProxy(getTestObject(), ruleTree)
      expect(proxy.foo.bar.baz).toBe('quux')
    })

    it('should allow accessing properties w/ allow rule', () => {
      const ruleTree = new RuleTree([
        { block: '**.z' },
        { allow: 'x.y.z' },
        { allow: ['alpha', symbolBeta] },
      ])
      const proxy = getRuleProxy(getTestObject(), ruleTree)
      expect(proxy.x.y.z).toBe('foo')
      expect(proxy.alpha[symbolBeta]).toBe('baz')
    })

    it('should block accessing properties w/ block rule', () => {
      const ruleTree = new RuleTree([
        { allow: '**.z' },
        { block: 'x.y.z' },
        { block: ['alpha', symbolBeta] },
      ])
      const proxy = getRuleProxy(getTestObject(), ruleTree)
      expect(proxy.x.y.z).toBeUndefined()
      expect(proxy.alpha[symbolBeta]).toBeUndefined()
    })
  })
})
