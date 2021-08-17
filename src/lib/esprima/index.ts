/*
  Copyright (C) 2021 Adaline Simonian <adalinesimonian@gmail.com>
  Copyright (C) 2013 Ariya Hidayat <ariya.hidayat@gmail.com>
  Copyright (C) 2013 Thaddee Tyl <thaddee.tyl@gmail.com>
  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>
  Copyright (C) 2012 Mathias Bynens <mathias@qiwi.be>
  Copyright (C) 2012 Joost-Wim Boekesteijn <joost-wim@boekesteijn.nl>
  Copyright (C) 2012 Kris Kowal <kris.kowal@cixar.com>
  Copyright (C) 2012 Yusuke Suzuki <utatane.tea@gmail.com>
  Copyright (C) 2012 Arpad Borsos <arpad.borsos@googlemail.com>
  Copyright (C) 2011 Ariya Hidayat <ariya.hidayat@gmail.com>
  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

'use strict'

import { strict as assert } from 'assert'
import {
  isDecimalDigit,
  isIdentifierPart,
  isIdentifierStart,
  isKeyword,
  isLineTerminator,
  isWhiteSpace,
  binaryPrecedence,
  isIdentifierName,
} from './utils'
import {
  TokenType,
  Token,
  UnexpectedTokenError,
  Delegate,
  Expression,
} from './types'

class Parser {
  source: string = ''
  index: number = 0
  length: number = 0
  lookahead?: Token
  delegate: Delegate

  constructor(delegate: Delegate) {
    this.delegate = delegate
  }

  // 7.4 Comments

  skipWhitespace(): void {
    while (
      this.index < this.length &&
      isWhiteSpace(this.source.charCodeAt(this.index))
    ) {
      ++this.index
    }
  }

  getIdentifier(): string {
    const start = this.index++
    while (this.index < this.length) {
      const ch = this.source.charCodeAt(this.index)
      if (isIdentifierPart(ch)) {
        ++this.index
      } else {
        break
      }
    }

    return this.source.slice(start, this.index)
  }

  scanIdentifier(): Token {
    const start = this.index
    const id = this.getIdentifier()
    const range: [number, number] = [start, this.index]

    // There is no keyword or literal with only one character.
    // Thus, it must be an identifier.
    if (id.length === 1) {
      return {
        type: TokenType.Identifier,
        value: id,
        range,
      }
    } else if (isKeyword(id)) {
      return {
        type: TokenType.Keyword,
        value: id,
        range,
      }
    } else if (id === 'null') {
      return {
        type: TokenType.NullLiteral,
        value: null,
        range,
      }
    } else if (id === 'true' || id === 'false') {
      return {
        type: TokenType.BooleanLiteral,
        value: id === 'true',
        range,
      }
    }

    return {
      type: TokenType.Identifier,
      value: id,
      range,
    }
  }

  // 7.7 Punctuators

  scanPunctuator(): Token {
    const start = this.index
    const code = this.source.charCodeAt(this.index)
    const ch1 = this.source[this.index]
    let code2

    switch (code) {
      // Check for most common single-character punctuators.
      case 46: // . dot
      case 40: // ( open bracket
      case 41: // ) close bracket
      case 59: // ; semicolon
      case 44: // , comma
      case 123: // { open curly brace
      case 125: // } close curly brace
      case 91: // [
      case 93: // ]
      case 58: // :
      case 63: // ?
        ++this.index
        return {
          type: TokenType.Punctuator,
          value: String.fromCharCode(code),
          range: [start, this.index],
        }

      default:
        code2 = this.source.charCodeAt(this.index + 1)

        // '=' (char #61) marks an assignment or comparison operator.
        if (code2 === 61) {
          switch (code) {
            case 37: // %
            case 38: // &
            case 42: // *:
            case 43: // +
            case 45: // -
            case 47: // /
            case 60: // <
            case 62: // >
            case 124: // |
              this.index += 2
              return {
                type: TokenType.Punctuator,
                value: String.fromCharCode(code) + String.fromCharCode(code2),
                range: [start, this.index],
              }

            case 33: // !
            case 61: // =
              this.index += 2

              // !== and ===
              if (this.source.charCodeAt(this.index) === 61) {
                ++this.index
              }
              return {
                type: TokenType.Punctuator,
                value: this.source.slice(start, this.index),
                range: [start, this.index],
              }
            default:
              break
          }
        }
        break
    }

    // Peek more characters.

    const ch2 = this.source[this.index + 1]

    // 3-character punctuator: >>>

    if (ch1 === '>' && ch2 === '>' && this.source[this.index + 2] === '>') {
      this.index += 3
      return {
        type: TokenType.Punctuator,
        value: '>>>',
        range: [start, this.index],
      }
    }

    // Other 2-character punctuators: && ||

    if (ch1 === ch2 && '&|*<>'.indexOf(ch1) >= 0) {
      this.index += 2
      return {
        type: TokenType.Punctuator,
        value: ch1 + ch2,
        range: [start, this.index],
      }
    }

    if ('<>=!+-*%&|^/~'.indexOf(ch1) >= 0) {
      ++this.index
      return {
        type: TokenType.Punctuator,
        value: ch1,
        range: [start, this.index],
      }
    }

    throw new UnexpectedTokenError('ILLEGAL')
  }

  // 7.8.3 Numeric Literals

  scanNumericLiteral(): Token {
    let number, ch

    ch = this.source[this.index]
    assert.ok(
      isDecimalDigit(ch.charCodeAt(0)) || ch === '.',
      'Numeric literal must start with a decimal digit or a decimal point'
    )

    const start = this.index
    number = ''
    if (ch !== '.') {
      number = this.source[this.index++]
      ch = this.source[this.index]

      // Hex number starts with '0x'.
      // Octal number starts with '0'.
      if (number === '0') {
        // decimal number starts with '0' such as '09' is illegal.
        if (ch && isDecimalDigit(ch.charCodeAt(0))) {
          throw new UnexpectedTokenError('ILLEGAL')
        }
      }

      while (isDecimalDigit(this.source.charCodeAt(this.index))) {
        number += this.source[this.index++]
      }
      ch = this.source[this.index]
    }

    if (ch === '.') {
      number += this.source[this.index++]
      while (isDecimalDigit(this.source.charCodeAt(this.index))) {
        number += this.source[this.index++]
      }
      ch = this.source[this.index]
    }

    if (ch === 'e' || ch === 'E') {
      number += this.source[this.index++]

      ch = this.source[this.index]
      if (ch === '+' || ch === '-') {
        number += this.source[this.index++]
      }
      if (isDecimalDigit(this.source.charCodeAt(this.index))) {
        while (isDecimalDigit(this.source.charCodeAt(this.index))) {
          number += this.source[this.index++]
        }
      } else {
        throw new UnexpectedTokenError('ILLEGAL')
      }
    }

    if (isIdentifierStart(this.source.charCodeAt(this.index))) {
      throw new UnexpectedTokenError('ILLEGAL')
    }

    return {
      type: TokenType.NumericLiteral,
      value: parseFloat(number),
      range: [start, this.index],
    }
  }

  // 7.8.4 String Literals

  scanStringLiteral(): Token {
    let str = ''
    let quote, ch

    quote = this.source[this.index]
    assert.ok(
      quote === "'" || quote === '"',
      'String literal must starts with a quote'
    )

    const start = this.index
    ++this.index

    while (this.index < this.length) {
      ch = this.source[this.index++]

      if (ch === quote) {
        quote = ''
        break
      } else if (ch === '\\') {
        ch = this.source[this.index++]
        if (!ch || !isLineTerminator(ch.charCodeAt(0))) {
          switch (ch) {
            case 'n':
              str += '\n'
              break
            case 'r':
              str += '\r'
              break
            case 't':
              str += '\t'
              break
            case 'b':
              str += '\b'
              break
            case 'f':
              str += '\f'
              break
            case 'v':
              str += '\x0B'
              break

            default:
              str += ch
              break
          }
        } else {
          if (ch === '\r' && this.source[this.index] === '\n') {
            ++this.index
          }
        }
      } else if (isLineTerminator(ch.charCodeAt(0))) {
        break
      } else {
        str += ch
      }
    }

    if (quote !== '') {
      throw new UnexpectedTokenError('ILLEGAL')
    }

    return {
      type: TokenType.StringLiteral,
      value: str,
      range: [start, this.index],
    }
  }

  advance(): Token {
    this.skipWhitespace()

    if (this.index >= this.length) {
      return {
        type: TokenType.EOF,
        range: [this.index, this.index],
      }
    }

    const ch = this.source.charCodeAt(this.index)

    // Very common: ( and ) and
    if (ch === 40 || ch === 41 || ch === 58) {
      return this.scanPunctuator()
    }

    // String literal starts with single quote (#39) or double quote (#34).
    if (ch === 39 || ch === 34) {
      return this.scanStringLiteral()
    }

    if (isIdentifierStart(ch)) {
      return this.scanIdentifier()
    }

    // Dot (.) char #46 can also start a floating-point number, hence the need
    // to check the next character.
    if (ch === 46) {
      if (isDecimalDigit(this.source.charCodeAt(this.index + 1))) {
        return this.scanNumericLiteral()
      }
      return this.scanPunctuator()
    }

    if (isDecimalDigit(ch)) {
      return this.scanNumericLiteral()
    }

    return this.scanPunctuator()
  }

  lex() {
    const token = this.lookahead
    const index = token?.range?.[1] ?? this.index

    this.index = index

    this.lookahead = this.advance()

    this.index = index

    return token
  }

  peek() {
    const pos = this.index
    this.lookahead = this.advance()
    this.index = pos
  }

  /**
   * Expect the next token to match the specified punctuator.
   * If not, an exception will be thrown.
   */
  expectPunctuator(value: unknown) {
    const token = this.lex()
    if (
      !token ||
      token.type !== TokenType.Punctuator ||
      token.value !== value
    ) {
      throw new UnexpectedTokenError(token)
    }
  }

  /**
   * Return true if the next token matches the specified punctuator.
   */
  matchPunctuator(value: unknown): boolean {
    return Boolean(
      this.lookahead &&
        this.lookahead.type === TokenType.Punctuator &&
        this.lookahead.value === value
    )
  }

  /**
   * Return true if the next token matches the specified keyword.
   */
  matchKeyword(keyword: unknown): boolean {
    return Boolean(
      this.lookahead &&
        this.lookahead.type === TokenType.Keyword &&
        this.lookahead.value === keyword
    )
  }

  // consumeSemicolon(): void {
  //   // Catch the very common case first: immediately a semicolon (char #59).
  //   if (this.source.charCodeAt(this.index) === 59) {
  //     this.lex()
  //     return
  //   }
  //
  //   this.skipWhitespace()
  //
  //   if (this.matchPunctuator(';')) {
  //     this.lex()
  //     return
  //   }
  //
  //   if (!this.lookahead || (this.lookahead.type !== Token.EOF && !match('}'))) {
  //     throw new UnexpectedTokenError(lookahead)
  //   }
  // }

  // 11.1.4 Array Initialiser

  parseArrayInitialiser(): Expression {
    const elements = []

    this.expectPunctuator('[')

    while (!this.matchPunctuator(']')) {
      if (this.matchPunctuator(',')) {
        this.lex()
        elements.push(null)
      } else {
        elements.push(this.parseExpression())

        if (!this.matchPunctuator(']')) {
          this.expectPunctuator(',')
        }
      }
    }

    this.expectPunctuator(']')

    return this.delegate.createArrayExpression(elements)
  }

  // 11.1.5 Object Initialiser

  parseObjectPropertyKey() {
    this.skipWhitespace()
    const token = this.lex()

    if (!token) {
      throw new UnexpectedTokenError(token)
    }

    // Note: This function is called only from parseObjectProperty(), where
    // EOF and Punctuator tokens are already filtered out.
    if (
      token.type === TokenType.StringLiteral ||
      token.type === TokenType.NumericLiteral
    ) {
      return this.delegate.createLiteral(token)
    }

    if (token.type === TokenType.Identifier) {
      return this.delegate.createIdentifier(token.value)
    }

    throw new UnexpectedTokenError(token)
  }

  parseObjectProperty(): Expression {
    const token = this.lookahead
    this.skipWhitespace()

    if (
      !token ||
      token.type === TokenType.EOF ||
      token.type === TokenType.Punctuator
    ) {
      throw new UnexpectedTokenError(token)
    }

    const key = this.parseObjectPropertyKey()
    this.expectPunctuator(':')
    return this.delegate.createProperty('init', key, this.parseExpression())
  }

  parseObjectInitialiser() {
    const properties = []

    this.expectPunctuator('{')

    while (!this.matchPunctuator('}')) {
      properties.push(this.parseObjectProperty())

      if (!this.matchPunctuator('}')) {
        this.expectPunctuator(',')
      }
    }

    this.expectPunctuator('}')

    return this.delegate.createObjectExpression(properties)
  }

  // 11.1.6 The Grouping Operator

  parseGroupExpression() {
    this.expectPunctuator('(')

    const expr = this.parseExpression()

    this.expectPunctuator(')')

    return expr
  }

  // 11.1 Primary Expressions

  parsePrimaryExpression() {
    const token = this.lookahead

    assert.ok(token)

    if (this.matchPunctuator('(')) {
      return this.parseGroupExpression()
    }

    let expr

    if (token.type === TokenType.Identifier) {
      this.lex()
      expr = this.delegate.createIdentifier(token.value)
    } else if (
      token.type === TokenType.StringLiteral ||
      token.type === TokenType.NumericLiteral ||
      token.type === TokenType.BooleanLiteral ||
      token.type === TokenType.NullLiteral
    ) {
      this.lex()
      expr = this.delegate.createLiteral(token)
    } else if (token.type === TokenType.Keyword) {
      if (this.matchKeyword('this')) {
        this.lex()
        expr = this.delegate.createThisExpression()
      }
    } else if (this.matchPunctuator('[')) {
      expr = this.parseArrayInitialiser()
    } else if (this.matchPunctuator('{')) {
      expr = this.parseObjectInitialiser()
    }

    if (expr) {
      return expr
    }

    this.lex()
    throw new UnexpectedTokenError(token)
  }

  // 11.2 Left-Hand-Side Expressions

  parseArguments() {
    const args = []

    this.expectPunctuator('(')

    if (!this.matchPunctuator(')')) {
      // eslint-disable-next-line no-unmodified-loop-condition
      while (this.index < this.length) {
        args.push(this.parseExpression())
        if (this.matchPunctuator(')')) {
          break
        }
        this.expectPunctuator(',')
      }
    }

    this.expectPunctuator(')')

    return args
  }

  parseNonComputedProperty() {
    const token = this.lex()

    if (!token || !isIdentifierName(token)) {
      throw new UnexpectedTokenError(token)
    }

    return this.delegate.createIdentifier(`${token.value}`)
  }

  parseNonComputedMember() {
    this.expectPunctuator('.')

    return this.parseNonComputedProperty()
  }

  parseComputedMember() {
    this.expectPunctuator('[')

    const expr = this.parseExpression()

    this.expectPunctuator(']')

    return expr
  }

  parseLeftHandSideExpression() {
    let expr = this.parsePrimaryExpression()

    while (true) {
      if (this.matchPunctuator('[')) {
        const property = this.parseComputedMember()
        expr = this.delegate.createMemberExpression('[', expr, property)
      } else if (this.matchPunctuator('.')) {
        const property = this.parseNonComputedMember()
        expr = this.delegate.createMemberExpression('.', expr, property)
      } else if (this.matchPunctuator('(')) {
        const args = this.parseArguments()
        expr = this.delegate.createCallExpression(expr, args)
      } else {
        break
      }
    }

    return expr
  }

  // 11.3 Postfix Expressions

  parsePostfixExpression() {
    return this.parseLeftHandSideExpression()
  }

  // 11.4 Unary Operators

  parseUnaryExpression() {
    let expr
    const token = this.lookahead

    assert.ok(token)

    if (
      token.type !== TokenType.Punctuator &&
      token.type !== TokenType.Keyword
    ) {
      expr = this.parsePostfixExpression()
    } else if (
      this.matchPunctuator('+') ||
      this.matchPunctuator('-') ||
      this.matchPunctuator('!') ||
      this.matchPunctuator('~')
    ) {
      this.lex()
      expr = this.parseUnaryExpression()
      expr = this.delegate.createUnaryExpression(token.value, expr)
    } else if (
      this.matchKeyword('delete') ||
      this.matchKeyword('void') ||
      this.matchKeyword('typeof')
    ) {
      throw new UnexpectedTokenError('ILLEGAL')
    } else {
      expr = this.parsePostfixExpression()
    }

    return expr
  }

  // 11.5 Multiplicative Operators
  // 11.6 Additive Operators
  // 11.7 Bitwise Shift Operators
  // 11.8 Relational Operators
  // 11.9 Equality Operators
  // 11.10 Binary Bitwise Operators
  // 11.11 Binary Logical Operators

  parseBinaryExpression(): Expression {
    let expr, prec, right, operator, left, i

    left = this.parseUnaryExpression()

    assert.ok(this.lookahead)

    let token: Token | undefined = this.lookahead

    prec = binaryPrecedence(token)
    if (prec === 0) {
      return left
    }
    token.prec = prec
    this.lex()

    right = this.parseUnaryExpression()

    const stack = [left, token, right]

    while ((prec = binaryPrecedence(this.lookahead)) > 0) {
      // Reduce: make a binary expression from the three topmost entries.
      while (
        stack.length > 2 &&
        prec <= ((stack[stack.length - 2] as Token)?.prec ?? 0)
      ) {
        right = stack.pop()
        operator = (stack.pop() as Extract<Token, { value: string }>)?.value
        left = stack.pop()
        expr = this.delegate.createBinaryExpression(
          operator,
          left as Expression,
          right as Expression
        )
        stack.push(expr)
      }

      // Shift.
      token = this.lex()
      assert.ok(token)
      token.prec = prec
      stack.push(token)
      expr = this.parseUnaryExpression()
      stack.push(expr)
    }

    // Final reduce to clean-up the stack.
    i = stack.length - 1
    expr = stack[i]
    while (i > 1) {
      expr = this.delegate.createBinaryExpression(
        (stack[i - 1] as Extract<Token, { value: string }>)?.value,
        stack[i - 2] as Expression,
        expr as Expression
      )
      i -= 2
    }

    return expr as Expression
  }

  // 11.12 Conditional Operator

  parseConditionalExpression(): Expression {
    let expr = this.parseBinaryExpression()

    if (this.matchPunctuator('?')) {
      this.lex()
      const consequent = this.parseConditionalExpression()
      this.expectPunctuator(':')
      const alternate = this.parseConditionalExpression()

      expr = this.delegate.createConditionalExpression(
        expr,
        consequent,
        alternate
      )
    }

    return expr
  }

  // Simplification since we do not support AssignmentExpression.
  parseExpression(): Expression {
    return this.parseConditionalExpression()
  }

  parseTopLevel(): Expression {
    this.skipWhitespace()
    this.peek()

    const expr = this.delegate.createTopLevel(this.parseExpression())

    if (this.lookahead?.type !== TokenType.EOF) {
      throw new UnexpectedTokenError(this.lookahead)
    }

    return expr
  }

  parse(code: string): Expression {
    this.source = code
    this.index = 0
    this.length = code.length
    this.lookahead = undefined

    return this.parseTopLevel()
  }
}

export function parse(code: string, delegate: Delegate): Expression {
  const parser = new Parser(delegate)
  return parser.parse(code)
}

export default { parse }
