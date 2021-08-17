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
  TopLevel = 'TopLevel',
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

type ExpressionBase = {
  (...args: any[]): any
}

export type ArrayExpression = ExpressionBase & {
  type: Syntax.ArrayExpression
  elements: (Expression | null)[]
}

export type LiteralExpression = ExpressionBase & {
  type: Syntax.Literal
  value: string | number | boolean | null
}

export type IdentifierExpression = ExpressionBase & {
  type: Syntax.Identifier
  identifier: string
}

export type PropertyExpression = ExpressionBase & {
  type: Syntax.Property
  key: Expression
  value: Expression
}

export type ObjectExpression = ExpressionBase & {
  type: Syntax.ObjectExpression
  properties: Expression[]
}

export type ThisExpression = ExpressionBase & {
  type: Syntax.ThisExpression
}

export type MemberExpression = ExpressionBase & {
  type: Syntax.MemberExpression
  accessor: '.' | '['
  object: Expression
  property: Expression
}

export type CallExpression = ExpressionBase & {
  type: Syntax.CallExpression
  callee: Expression
  args: Expression[]
}

export type UnaryExpression = ExpressionBase & {
  type: Syntax.UnaryExpression
  operator: string
  argument: Expression
}

export type BinaryExpression = ExpressionBase & {
  type: Syntax.BinaryExpression
  operator: string
  left: Expression
  right: Expression
}

export type ConditionalExpression = ExpressionBase & {
  type: Syntax.ConditionalExpression
  test: Expression
  consequent: Expression
  alternate: Expression
}

export type TopLevelExpression = ExpressionBase & {
  type: Syntax.TopLevel
  expression: Expression
}

export type Expression =
  | ArrayExpression
  | LiteralExpression
  | IdentifierExpression
  | PropertyExpression
  | ObjectExpression
  | ThisExpression
  | MemberExpression
  | CallExpression
  | UnaryExpression
  | BinaryExpression
  | ConditionalExpression
  | TopLevelExpression

export interface Delegate {
  createArrayExpression(elements: (Expression | null)[]): ArrayExpression
  createLiteral(
    value: Extract<Token, { value: string | number | boolean | null }>
  ): LiteralExpression
  createIdentifier(identifier: string): IdentifierExpression
  createProperty(
    kind: 'init',
    key: Expression,
    value: Expression
  ): PropertyExpression
  createObjectExpression(properties: Expression[]): ObjectExpression
  createThisExpression(): ThisExpression
  createMemberExpression(
    accessor: '[' | '.',
    object: Expression,
    property: Expression
  ): MemberExpression
  createCallExpression(callee: Expression, args: Expression[]): CallExpression
  createUnaryExpression(operator: string, argument: Expression): UnaryExpression
  createBinaryExpression(
    operator: string,
    left: Expression,
    right: Expression
  ): BinaryExpression
  createConditionalExpression(
    test: Expression,
    consequent: Expression,
    alternate: Expression
  ): ConditionalExpression
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
