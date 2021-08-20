import { evaluate } from '../../src/index'

describe('Method invocation', () => {
  it('should be able to invoke methods', () => {
    expect(
      evaluate('method(5)', { scope: { method: (x: number) => x + 5 } })
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
      })
    ).toBe(10)
  })

  it('should be able to invoke methods returned by a method', () => {
    expect(
      evaluate('method(5)(5)', {
        scope: { method: (x: number) => (y: number) => x + y },
      })
    ).toBe(10)
  })

  it('should be able to invoke methods with spread arguments', () => {
    expect(
      evaluate('method(...[1, 2, 3])', {
        scope: { method: (x: number, y: number, z: number) => x + y + z },
      })
    ).toBe(6)
  })
})

describe('Optional method invocation', () => {
  it('should be able to invoke methods', () => {
    expect(
      evaluate('method?.(5)', { scope: { method: (x: number) => x + 5 } })
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
      })
    ).toBe(10)
  })

  it("shouldn't invoke member methods if the method is not defined", () => {
    expect(evaluate('obj.method?.(5)', { scope: { obj: {} } })).toBeUndefined()
  })

  it('should be able to invoke methods returned by a method', () => {
    expect(
      evaluate('method?.(5)?.(5)', {
        scope: { method: (x: number) => (y: number) => x + y },
      })
    ).toBe(10)
  })

  it('should be able to invoke methods with spread arguments', () => {
    expect(
      evaluate('method?.(...[1, 2, 3])', {
        scope: { method: (x: number, y: number, z: number) => x + y + z },
      })
    ).toBe(6)
  })
})
