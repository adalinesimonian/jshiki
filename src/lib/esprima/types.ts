import { formatMessage } from './utils'

export enum TokenType {
  BooleanLiteral = 1,
  EOF = 2,
  Identifier = 3,
  Keyword = 4,
  NullLiteral = 5,
  NumericLiteral = 6,
  Punctuator = 7,
  StringLiteral = 8,
}

export const TokenName = {
  [TokenType.BooleanLiteral]: 'Boolean',
  [TokenType.EOF]: '<end>',
  [TokenType.Identifier]: 'Identifier',
  [TokenType.Keyword]: 'Keyword',
  [TokenType.NullLiteral]: 'Null',
  [TokenType.NumericLiteral]: 'Numeric',
  [TokenType.Punctuator]: 'Punctuator',
  [TokenType.StringLiteral]: 'String',
}

export enum Syntax {
  ArrayExpression = 'ArrayExpression',
  BinaryExpression = 'BinaryExpression',
  CallExpression = 'CallExpression',
  ConditionalExpression = 'ConditionalExpression',
  EmptyStatement = 'EmptyStatement',
  ExpressionStatement = 'ExpressionStatement',
  Identifier = 'Identifier',
  Literal = 'Literal',
  LabeledStatement = 'LabeledStatement',
  LogicalExpression = 'LogicalExpression',
  MemberExpression = 'MemberExpression',
  ObjectExpression = 'ObjectExpression',
  Program = 'Program',
  Property = 'Property',
  ThisExpression = 'ThisExpression',
  UnaryExpression = 'UnaryExpression',
}

type TokenBase =
  | {
      type: TokenType.BooleanLiteral
      value: boolean
    }
  | {
      type: TokenType.EOF
    }
  | {
      type: TokenType.NullLiteral
      value: null
    }
  | {
      type: TokenType.NumericLiteral
      value: number
    }
  | {
      type:
        | TokenType.Identifier
        | TokenType.Keyword
        | TokenType.Punctuator
        | TokenType.NullLiteral
        | TokenType.NumericLiteral
        | TokenType.StringLiteral
      value: string
    }

export type Token = TokenBase & {
  range: [start: number, end: number]
  prec?: number
}

export type Expression = (...args: any[]) => any

export interface Delegate {
  createArrayExpression(elements: (Expression | null)[]): Expression
  createLiteral(
    value: Extract<Token, { value: string | number | boolean | null }>
  ): Expression
  createIdentifier(identifier: string | boolean | null): Expression
  createProperty(kind: 'init', key: Expression, value: Expression): Expression
  createObjectExpression(properties: Expression[]): Expression
  createThisExpression(): Expression
  createMemberExpression(
    accessor: '[' | '.',
    object: Expression,
    property: Expression
  ): Expression
  createCallExpression(expr: Expression, args: Expression[]): Expression
  createUnaryExpression(operator: string, argument: Expression): Expression
  createBinaryExpression(
    operator: string,
    left: Expression,
    right: Expression
  ): Expression
  createConditionalExpression(
    test: Expression,
    consequent: Expression,
    alternate: Expression
  ): Expression
  createTopLevel(expr: Expression): Expression
}

// Error messages should be identical to V8.

export const ErrorMessages = {
  UnexpectedToken: 'Unexpected token %0',
  // UnknownLabel: "Undefined label '%0'",
  // Redeclaration: "%0 '%1' has already been declared",
}

export class UnexpectedTokenError extends Error {
  index?: number

  constructor(token?: Partial<Token> | string) {
    const [index, tokenStr] =
      typeof token === 'string'
        ? [undefined, token]
        : [
            token?.range?.[0],
            (token as any)?.value || (token?.type && TokenName[token?.type]),
          ]

    const message = formatMessage(ErrorMessages.UnexpectedToken, tokenStr)
    super(message)
    this.index = index
  }
}
