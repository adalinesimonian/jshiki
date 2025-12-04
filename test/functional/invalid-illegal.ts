import { describe, it, expect } from 'vitest'
import { parse } from '../../src/index.js'

describe('Invalid/Illegal syntax', () => {
  it('should throw when the expression contains a variable declaration', () => {
    expect(() => parse('let a = 1')).toThrow()
    expect(() => parse('var a = 1')).toThrow()
    expect(() => parse('const a = 1')).toThrow()
  })

  it('should throw when the expression contains an invalid punctuator', () => {
    expect(() => parse('@')).toThrowErrorMatchingSnapshot()
  })

  it('should throw when using `this`', () => {
    expect(() => parse('this')).toThrowErrorMatchingSnapshot()
  })

  it('should throw when using `new`', () => {
    expect(() => parse('new Date()')).toThrowErrorMatchingSnapshot()
  })

  it('should throw when using `delete`', () => {
    expect(() => parse('delete a')).toThrowErrorMatchingSnapshot()
  })

  it('should throw when using `void`', () => {
    expect(() => parse('void a')).toThrowErrorMatchingSnapshot()
  })

  it('should throw when using `await` outside of an async context', () => {
    expect(() => parse('await a()')).toThrowErrorMatchingSnapshot()
  })

  it('should throw when using a sequence expression', () => {
    expect(() => parse('(a, b)')).toThrowErrorMatchingSnapshot()
  })

  it('should throw when using a function', () => {
    expect(() => parse('function a() {}')).toThrowErrorMatchingSnapshot()
  })

  it('should throw when using an arrow function', () => {
    expect(() => parse('a => a')).toThrowErrorMatchingSnapshot()
  })

  it('should throw when using a generator function', () => {
    expect(() => parse('function* a() {}')).toThrowErrorMatchingSnapshot()
  })

  it('should throw when using an async function', () => {
    expect(() => parse('async function a() {}')).toThrowErrorMatchingSnapshot()
  })

  it('should throw when using an async arrow function', () => {
    expect(() => parse('async a => a')).toThrowErrorMatchingSnapshot()
  })

  it('should throw when using an async generator function', () => {
    expect(() => parse('async function* a() {}')).toThrowErrorMatchingSnapshot()
  })

  it('should throw when using a class', () => {
    expect(() => parse('class A {}')).toThrowErrorMatchingSnapshot()
  })
})
