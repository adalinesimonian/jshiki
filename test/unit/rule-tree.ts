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
      { allow: 'qux.quux' },
      { allow: 'quuz.**' },
      { allow: 'quuz.corge' },
    ])
    expect(ruleTree.match(['x', 'y', 'z'])).toBe('allow')
    expect(ruleTree.match('a.b.c')).toBe('block')
    expect(ruleTree.match(['alpha', symbolBeta])).toBe('allow')
    expect(ruleTree.match(['foo', '*'])).toBe('block')
    expect(ruleTree.match('foo.**')).toBe('allow')
    expect(ruleTree.match('qux.quux.quuz')).toBe(false)
    expect(ruleTree.match('quuz.corge.grault')).toBe(false)
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
    expect(ruleTree.match(['foo', 'bar'])).toBe(false)
    expect(ruleTree.match('foo.bar.baz')).toBe(false)
  })

  it('should match applicable paths to rules with wildcards', () => {
    const symbolBar = Symbol('bar')
    const ruleTree = new RuleTree([
      { allow: 'x.y.*' },
      { block: ['a', '**', 'd'] },
      { allow: 'alpha.beta.*.delta' },
      { block: ['*', symbolBar] },
    ])
    expect(ruleTree.match(['x', 'y', 'z'])).toBe('allow')
    expect(ruleTree.match('a.b.c.d')).toBe('block')
    expect(ruleTree.match('alpha.beta.gamma.delta')).toBe('allow')
    expect(ruleTree.match(['foo', symbolBar])).toBe('block')
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
      { block: 'qux.quux' },
      { allow: ['qux', 'quux'] },
    ])
    expect(ruleTree.match('x.y.z')).toBe('block')
    expect(ruleTree.match('a.b.c')).toBe('allow')
    expect(ruleTree.match('alpha.beta.gamma')).toBe('block')
    expect(ruleTree.match(['foo', symbolBar, 'baz'])).toBe('allow')
    expect(ruleTree.match('qux.quux')).toBe('allow')
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
