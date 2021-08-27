import RuleTree from '../../src/rule-tree'

describe('Rule Tree', () => {
  it('should be able to create a rule tree', () => {
    const ruleTree = new RuleTree()
    expect(ruleTree).toBeDefined()
  })

  it('should be able to create a rule tree with rules', () => {
    const ruleTree = new RuleTree([
      { allow: 'x.y.z' },
      { block: ['a', 'b', 'c'] },
      { allow: [Symbol('alpha')] },
    ])
    expect(ruleTree).toBeDefined()
  })

  it('should be able to add rules to a rule tree', () => {
    const ruleTree = new RuleTree()
    expect(() => {
      ruleTree.add({ allow: 'x.y.z' })
      ruleTree.add({ block: ['a', 'b', 'c'] })
      ruleTree.add({ allow: [Symbol('alpha')] })
    }).not.toThrow()
  })

  it('should not throw when adding a falsy rule', () => {
    const ruleTree = new RuleTree()
    expect(() => {
      ruleTree.add(null as any)
    }).not.toThrow()
    expect(() => {
      ruleTree.add(undefined as any)
    }).not.toThrow()
    expect(() => {
      ruleTree.add('' as any)
    }).not.toThrow()
    expect(() => {
      ruleTree.add(0 as any)
    }).not.toThrow()
  })

  it('should throw when adding a rule with a path of an invalid type', () => {
    const ruleTree = new RuleTree()
    expect(() => {
      ruleTree.add({ allow: 123 as any })
    }).toThrowErrorMatchingSnapshot()
  })

  it('should throw when adding a rule with a path part of an invalid type', () => {
    const ruleTree = new RuleTree()
    expect(() => {
      ruleTree.add({ allow: ['valid', { invalid: true } as any] })
    }).toThrowErrorMatchingSnapshot()
  })

  it('should not throw when adding a rule with an empty path', () => {
    const ruleTree = new RuleTree()
    expect(() => {
      ruleTree.add({ allow: [] })
    }).not.toThrow()
    expect(() => {
      ruleTree.add({ allow: '' })
    }).not.toThrow()
  })

  it('should match applicable paths to rules', () => {
    const symbolBeta = Symbol('beta')
    const ruleTree = new RuleTree([
      { allow: 'x.y.z' },
      { block: ['a', 'b', 'c'] },
      { allow: ['alpha', symbolBeta] },
      { block: 'foo.\\*' },
      { allow: ['foo', '\\**'] },
    ])
    expect(ruleTree.match(['x', 'y', 'z'])).toEqual([2, 'allow'])
    expect(ruleTree.match('a.b.c')).toEqual([2, 'block'])
    expect(ruleTree.match(['alpha', symbolBeta])).toEqual([1, 'allow'])
    expect(ruleTree.match(['foo', '*'])).toEqual([1, 'block'])
    expect(ruleTree.match('foo.**')).toEqual([1, 'allow'])
  })

  it('should not match inapplicable paths to rules', () => {
    const ruleTree = new RuleTree([
      { allow: 'x.y.z' },
      { block: ['a', 'b', 'c'] },
      { allow: ['alpha', Symbol('beta')] },
      { block: 'foo.\\*' },
      { allow: ['foo', '\\**'] },
    ])
    expect(ruleTree.match(['x', 'y'])).toBe(true)
    expect(ruleTree.match('a')).toBe(false)
    expect(ruleTree.match(['alpha', Symbol('beta')])).toBe(false)
    expect(ruleTree.match(['foo', 'bar'])).toEqual(false)
    expect(ruleTree.match('foo.bar.baz')).toEqual(false)
  })

  it('should match applicable paths to rules with wildcards', () => {
    const symbolBar = Symbol('bar')
    const ruleTree = new RuleTree([
      { allow: 'x.y.*' },
      { block: ['a', '**', 'd'] },
      { allow: 'alpha.beta.*.delta' },
      { block: ['*', symbolBar] },
    ])
    expect(ruleTree.match(['x', 'y', 'z'])).toEqual([2, 'allow'])
    expect(ruleTree.match('a.b.c.d')).toEqual([3, 'block'])
    expect(ruleTree.match('alpha.beta.gamma.delta')).toEqual([3, 'allow'])
    expect(ruleTree.match(['foo', symbolBar])).toEqual([1, 'block'])
  })

  it('should not match inapplicable paths to rules with wildcards', () => {
    const symbolBar = Symbol('bar')
    const ruleTree = new RuleTree([
      { allow: 'x.y.*' },
      { block: ['a', '**', 'd'] },
      { allow: 'alpha.beta.*.delta' },
      { block: ['*', symbolBar] },
    ])
    expect(ruleTree.match(['x', 'y'])).toBe(true)
    expect(ruleTree.match('a.c')).toBe(false)
    expect(ruleTree.match('alpha.beta.gamma')).toBe(true)
    expect(ruleTree.match('alpha.beta.gamma.epsilon')).toBe(false)
    expect(ruleTree.match([symbolBar])).toBe(false)
  })

  it('should return false when matching against an empty path', () => {
    const ruleTree = new RuleTree([{ allow: 'x.y.z' }])
    expect(ruleTree.match([])).toBe(false)
    expect(ruleTree.match('')).toBe(false)
  })

  it('should respect precendence of rules', () => {
    const symbolBar = Symbol('bar')
    const ruleTree = new RuleTree([
      { allow: 'x.y.z' },
      { block: 'x.y.z' },
      { block: 'a.b.c' },
      { allow: '**.c' },
      { allow: 'alpha.*.gamma.delta' },
      { block: '*.beta.gamma' },
      { block: [symbolBar, 'baz'] },
      { allow: ['foo', symbolBar, 'baz'] },
    ])
    expect(ruleTree.match('x.y.z')).toEqual([2, 'block'])
    expect(ruleTree.match('a.b.c')).toEqual([2, 'allow'])
    expect(ruleTree.match('alpha.beta.gamma.delta')).toEqual([2, 'block'])
    expect(ruleTree.match(['foo', symbolBar, 'baz'])).toEqual([2, 'allow'])
  })

  it('should block descendant access when a rule blocks a parent', () => {
    const ruleTree = new RuleTree([{ allow: 'x.y.z' }, { block: 'x.y' }])
    expect(ruleTree.match('x.y.z')).toEqual([1, 'block'])
  })

  it('should not block descendant access when a rule allows a parent', () => {
    const ruleTree = new RuleTree([{ allow: 'x.y.z' }, { allow: 'x.y' }])
    expect(ruleTree.match('x.y.z')).toEqual([1, 'allow'])
  })

  it('should return true when the path has descendants with an allow rule', () => {
    const ruleTree = new RuleTree([
      { allow: 'x.y.z' },
      { block: 'x.b' },
      { allow: ['foo', '**', 'baz', 'qux'] },
    ])
    expect(ruleTree.match('x.y')).toBe(true)
    expect(ruleTree.match('foo.bar.baz')).toBe(true)
  })

  it('should return false when the path has no descendants with an allow rule', () => {
    const ruleTree = new RuleTree([
      { allow: 'x.y.foo' },
      { allow: 'x.y.bar' },
      { block: 'x.y' },
    ])
    expect(ruleTree.match('x')).toBe(false)
  })
})
