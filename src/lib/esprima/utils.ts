import { strict as assert } from 'assert'

import { Token, TokenType } from './types'

export function isDecimalDigit(ch: number): boolean {
  return ch >= 48 && ch <= 57 // 0..9
}

// 7.2 White Space

export function isWhiteSpace(ch: number): boolean {
  return (
    ch === 32 || // space
    ch === 9 || // tab
    ch === 0xb ||
    ch === 0xc ||
    ch === 0xa0 ||
    (ch >= 0x1680 &&
      '\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\uFEFF'.indexOf(
        String.fromCharCode(ch)
      ) > 0)
  )
}

// 7.3 Line Terminators

export function isLineTerminator(ch: number): boolean {
  return ch === 10 || ch === 13 || ch === 0x2028 || ch === 0x2029
}

// 7.6 Identifier Names and Identifiers

export function isIdentifierStart(ch: number): boolean {
  return (
    ch === 36 ||
    ch === 95 || // $ (dollar) and _ (underscore)
    (ch >= 65 && ch <= 90) || // A..Z
    (ch >= 97 && ch <= 122)
  ) // a..z
}

export function isIdentifierPart(ch: number): boolean {
  return (
    ch === 36 ||
    ch === 95 || // $ (dollar) and _ (underscore)
    (ch >= 65 && ch <= 90) || // A..Z
    (ch >= 97 && ch <= 122) || // a..z
    (ch >= 48 && ch <= 57)
  ) // 0..9
}

export function isIdentifierName(
  token: Token
): token is Extract<Token, { value: string | boolean | null }> {
  return (
    token.type === TokenType.Identifier ||
    token.type === TokenType.Keyword ||
    token.type === TokenType.BooleanLiteral ||
    token.type === TokenType.NullLiteral
  )
}

// 7.6.1.1 Keywords

export function isKeyword(id: string): boolean {
  return id === 'this'
}

// 11.5 Multiplicative Operators
// 11.6 Additive Operators
// 11.7 Bitwise Shift Operators
// 11.8 Relational Operators
// 11.9 Equality Operators
// 11.10 Binary Bitwise Operators
// 11.11 Binary Logical Operators

export function binaryPrecedence(token: Token): number {
  let prec = 0

  if (token.type !== TokenType.Punctuator && token.type !== TokenType.Keyword) {
    return 0
  }

  switch (token.value) {
    case '||':
      prec = 1
      break

    case '&&':
      prec = 2
      break

    case '|':
      prec = 3
      break

    case '^':
      prec = 4
      break

    case '&':
      prec = 5
      break

    case '==':
    case '!=':
    case '===':
    case '!==':
      prec = 6
      break

    case '<':
    case '>':
    case '<=':
    case '>=':
    case 'instanceof':
      prec = 7
      break

    // case 'in':
    //   prec = 7
    //   break

    case '<<':
    case '>>':
    case '>>>':
      prec = 8
      break

    case '+':
    case '-':
      prec = 9
      break

    case '*':
    case '/':
    case '%':
      prec = 11
      break

    case '**':
      prec = 12
      break

    default:
      break
  }

  return prec
}

export function formatMessage(
  messageFormat: string,
  ...args: unknown[]
): string {
  return messageFormat.replace(/%(\d)/g, (_whole, index) => {
    assert.ok(index < args.length, 'Message reference must be in range')
    return args[index] as any
  })
}
