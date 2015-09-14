/* global describe, it */

var chai = require('chai')
var expect = chai.expect

var jshiki = require('../../index')

var jeval = (expression, scope) =>
  jshiki.parse(expression, { scope: scope }).eval()

describe('Literals', () => {
  describe('Numeric Literals', () => {
    it('should parse integers', () => {
      expect(jeval('5')).to.equal(5)
    })

    it('should parse floating-point numbers', () => {
      expect(jeval('5.3')).to.equal(5.3)
    })
  })

  describe('String Literals', () => {
    it('should parse single-quoted strings', () => {
      expect(jeval("'x'")).to.equal('x')
    })

    it('should parse double-quoted strings', () => {
      expect(jeval('"x"')).to.equal('x')
    })
  })

  describe('Object Literals', () => {
    it('should parse empty object literals', () => {
      expect(jeval('{}')).to.eql({})
    })

    it('should parse object literals', () => {
      expect(jeval("{ x: 1, y: '2', z: '3' }")).to.eql(
        { x: 1, y: '2', z: '3' }
      )
    })

    it('should parse nested object literals', () => {
      expect(jeval("{ x: 1, y: { a: '2' }, z: '3' }")).to.eql(
        { x: 1, y: { a: '2' }, z: '3' }
      )
    })
  })

  describe('Array Literals', () => {
    it('should parse empty array literals', () => {
      expect(jeval('[]')).to.eql([])
    })

    it('should parse numeric array literals', () => {
      expect(jeval('[1, 2, 3]')).to.eql([1, 2, 3])
    })

    it('should parse string array literals', () => {
      expect(jeval("['1', '2', '3']")).to.eql(['1', '2', '3'])
    })

    it('should parse object array literals', () => {
      expect(jeval("[{ x: '1' }, { y: '2' }, { z: '3' }]")).to.eql(
        [{ x: '1' }, { y: '2' }, { z: '3' }]
      )
    })

    it('should parse nested array literals', () => {
      expect(jeval('[[1, 2], [3, 4], [5, 6]]')).to.eql(
        [[1, 2], [3, 4], [5, 6]]
      )
    })

    it('should parse mixed-type array literals', () => {
      expect(jeval("[1, { y: '2' }, '3', [4, 5]]")).to.eql(
        [1, { y: '2' }, '3', [4, 5]]
      )
    })
  })
})
