import { describe, it, expect } from 'vitest'
import { evaluate, evaluateAsync } from '../../src/index.js'

describe('Method invocation', () => {
  it('should be able to invoke methods', () => {
    expect(
      evaluate('method(5)', { scope: { method: (x: number) => x + 5 } }),
    ).toBe(10)
  })

  it('should be able to invoke member methods', () => {
    expect(
      evaluate('obj.method(5)', {
        scope: {
          obj: {
            x: 5,
            method(y: number) {
              return this.x + y
            },
          },
        },
      }),
    ).toBe(10)
  })

  it('should be able to invoke optional member methods', () => {
    expect(
      evaluate('obj?.method(5)', {
        scope: {
          obj: {
            x: 5,
            method(y: number) {
              return this.x + y
            },
          },
        },
      }),
    ).toBe(10)
    expect(evaluate('obj?.method(5)')).toBeUndefined()
  })

  it('should be able to invoke methods returned by a method', () => {
    expect(
      evaluate('method(5)(5)', {
        scope: { method: (x: number) => (y: number) => x + y },
      }),
    ).toBe(10)
  })

  it('should be able to invoke methods with spread arguments', () => {
    expect(
      evaluate('method(...[1, 2, 3])', {
        scope: { method: (x: number, y: number, z: number) => x + y + z },
      }),
    ).toBe(6)
  })
})

describe('Optional method invocation', () => {
  it('should be able to invoke methods', () => {
    expect(
      evaluate('method?.(5)', { scope: { method: (x: number) => x + 5 } }),
    ).toBe(10)
  })

  it("shouldn't invoke methods if the method is not defined", () => {
    expect(evaluate('method?.(5)')).toBeUndefined()
  })

  it('should be able to invoke member methods', () => {
    expect(
      evaluate('obj.method?.(5)', {
        scope: {
          obj: {
            x: 5,
            method(y: number) {
              return this.x + y
            },
          },
        },
      }),
    ).toBe(10)
  })

  it("shouldn't invoke member methods if the method is not defined", () => {
    expect(evaluate('obj.method?.(5)', { scope: { obj: {} } })).toBeUndefined()
  })

  it('should be able to invoke optional member methods', () => {
    expect(
      evaluate('obj?.method?.(5)', {
        scope: {
          obj: {
            x: 5,
            method(y: number) {
              return this.x + y
            },
          },
        },
      }),
    ).toBe(10)
    expect(evaluate('obj?.method?.(5)')).toBeUndefined()
  })

  it("shouldn't invoke optional member methods if the method is not defined", () => {
    expect(evaluate('obj?.method?.(5)', { scope: { obj: {} } })).toBeUndefined()
  })

  it('should be able to invoke methods returned by a method', () => {
    expect(
      evaluate('method?.(5)?.(5)', {
        scope: { method: (x: number) => (y: number) => x + y },
      }),
    ).toBe(10)
  })

  it('should be able to invoke methods with spread arguments', () => {
    expect(
      evaluate('method?.(...[1, 2, 3])', {
        scope: { method: (x: number, y: number, z: number) => x + y + z },
      }),
    ).toBe(6)
  })
})

describe('Method invocation (async)', () => {
  it('should be able to invoke methods', async () => {
    expect(
      await evaluateAsync('method(5)', {
        scope: { method: (x: number) => x + 5 },
      }),
    ).toBe(10)
  })

  it('should be able to invoke member methods', async () => {
    expect(
      await evaluateAsync('obj.method(5)', {
        scope: {
          obj: {
            x: 5,
            method(y: number) {
              return this.x + y
            },
          },
        },
      }),
    ).toBe(10)
  })

  it('should be able to invoke optional member methods', async () => {
    expect(
      await evaluateAsync('obj?.method(5)', {
        scope: {
          obj: {
            x: 5,
            method(y: number) {
              return this.x + y
            },
          },
        },
      }),
    ).toBe(10)
    expect(await evaluateAsync('obj?.method(5)')).toBeUndefined()
  })

  it('should be able to invoke methods returned by a method', async () => {
    expect(
      await evaluateAsync('method(5)(5)', {
        scope: { method: (x: number) => (y: number) => x + y },
      }),
    ).toBe(10)
  })

  it('should be able to invoke methods with spread arguments', async () => {
    expect(
      await evaluateAsync('method(...[1, 2, 3])', {
        scope: { method: (x: number, y: number, z: number) => x + y + z },
      }),
    ).toBe(6)
  })
})

describe('Optional method invocation (async)', () => {
  it('should be able to invoke methods', async () => {
    expect(
      await evaluateAsync('method?.(5)', {
        scope: { method: (x: number) => x + 5 },
      }),
    ).toBe(10)
  })

  it("shouldn't invoke methods if the method is not defined", async () => {
    expect(await evaluateAsync('method?.(5)')).toBeUndefined()
  })

  it('should be able to invoke member methods', async () => {
    expect(
      await evaluateAsync('obj.method?.(5)', {
        scope: {
          obj: {
            x: 5,
            method(y: number) {
              return this.x + y
            },
          },
        },
      }),
    ).toBe(10)
  })

  it("shouldn't invoke member methods if the method is not defined", async () => {
    expect(
      await evaluateAsync('obj.method?.(5)', { scope: { obj: {} } }),
    ).toBeUndefined()
  })

  it('should be able to invoke optional member methods', async () => {
    expect(
      await evaluateAsync('obj?.method?.(5)', {
        scope: {
          obj: {
            x: 5,
            method(y: number) {
              return this.x + y
            },
          },
        },
      }),
    ).toBe(10)
    expect(await evaluateAsync('obj?.method?.(5)')).toBeUndefined()
  })

  it("shouldn't invoke optional member methods if the method is not defined", async () => {
    expect(
      await evaluateAsync('obj?.method?.(5)', { scope: { obj: {} } }),
    ).toBeUndefined()
  })

  it('should be able to invoke methods returned by a method', async () => {
    expect(
      await evaluateAsync('method?.(5)?.(5)', {
        scope: { method: (x: number) => (y: number) => x + y },
      }),
    ).toBe(10)
  })

  it('should be able to invoke methods with spread arguments', async () => {
    expect(
      await evaluateAsync('method?.(...[1, 2, 3])', {
        scope: { method: (x: number, y: number, z: number) => x + y + z },
      }),
    ).toBe(6)
  })
})
