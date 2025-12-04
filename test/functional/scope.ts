import { describe, it, expect } from 'vitest'
import { evaluate, evaluateAsync } from '../../src'

var globalVar = '1' // eslint-disable-line @typescript-eslint/no-unused-vars

describe('Scope', () => {
  it('should be able to access scoped properties', () => {
    expect(evaluate('x', { scope: { x: '1' } })).toBe('1')
    expect(evaluate('length', { scope: 'str' as any })).toBe(3)
  })

  it('should be able to invoke scoped functions', () => {
    expect(evaluate('x()', { scope: { x: () => '1' } })).toBe('1')
  })

  it('should not be able to access global variables', () => {
    expect(evaluate('globalVar')).toBeUndefined()
  })

  it('should not be able to access unscoped variables', () => {
    var z = '1' // eslint-disable-line @typescript-eslint/no-unused-vars
    expect(evaluate('z')).toBeUndefined()
  })
})

describe('Scope (async)', () => {
  it('should be able to access scoped properties', async () => {
    expect(await evaluateAsync('x', { scope: { x: '1' } })).toBe('1')
    expect(await evaluateAsync('length', { scope: 'str' as any })).toBe(3)
  })

  it('should be able to invoke scoped functions', async () => {
    expect(await evaluateAsync('x()', { scope: { x: () => '1' } })).toBe('1')
  })

  it('should not be able to access global variables', async () => {
    expect(await evaluateAsync('globalVar')).toBeUndefined()
  })

  it('should not be able to access unscoped variables', async () => {
    var z = '1' // eslint-disable-line @typescript-eslint/no-unused-vars
    expect(await evaluateAsync('z')).toBeUndefined()
  })
})
