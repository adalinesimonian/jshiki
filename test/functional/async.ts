import { describe, it, expect } from 'vitest'
import { evaluateAsync } from '../../src/index.js'

describe('Async expressions', () => {
  it('should not resolve promises without await', async () => {
    expect(
      await evaluateAsync('a() + 2', { scope: { a: async () => 1 } }),
    ).toBe('[object Promise]2')
  })

  it('should resolve promises with await', async () => {
    expect(
      await evaluateAsync('await a() + 2', { scope: { a: async () => 1 } }),
    ).toBe(3)
  })

  it('should await non-promises', async () => {
    expect(await evaluateAsync('await 1 + 2')).toBe(3)
  })
})
