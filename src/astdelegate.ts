import { Delegate, Expression, Token } from './lib/esprima/types'
import operators from './operators'

type ScopedExpression = Expression & {
  scope?: any
}

type IdentifierExpression = (options?: { child?: boolean }) => any

export interface ASTDelegateOptions {
  /**
   * The scope to use when evaluating the expression. The expression will be
   * limited to accessing the properties of the scope.
   */
  scope?: Record<any, any>
}

export default class ASTDelegate implements Delegate {
  scope: any
  expression: any = null

  constructor({ scope }: ASTDelegateOptions = {}) {
    this.scope = scope || {}
  }

  createUnaryExpression(op: string, arg: Expression): Expression {
    if (!operators.unary[op as keyof typeof operators.unary]) {
      throw Error(`Disallowed operator: ${op}`)
    }

    return () => operators.unary[op as keyof typeof operators.unary](arg())
  }

  createBinaryExpression(
    op: string,
    left: Expression,
    right: Expression
  ): Expression {
    if (!operators.binary[op as keyof typeof operators.binary]) {
      throw Error(`Disallowed operator: ${op}`)
    }

    return () =>
      operators.binary[op as keyof typeof operators.binary](left(), right())
  }

  createConditionalExpression(
    test: Expression,
    consequent: Expression,
    alternate: Expression
  ): Expression {
    return () => (test() ? consequent() : alternate())
  }

  createIdentifier(identifier: string | boolean | null): IdentifierExpression {
    return typeof identifier === 'string'
      ? (options?: { child?: boolean }) =>
          options?.child ? identifier : this.scope[identifier]
      : () => identifier
  }

  createMemberExpression(
    _accessor: '.' | '[',
    object: Expression,
    property: IdentifierExpression
  ): ScopedExpression {
    const exp: ScopedExpression = () => object()[property({ child: true })]
    exp.scope = object()
    return exp
  }

  createCallExpression(
    expression: ScopedExpression,
    args: Expression[]
  ): Expression {
    return () =>
      expression().apply(
        expression.scope,
        args.map(arg => arg())
      )
  }

  createLiteral(
    token: Extract<Token, { value: string | number | boolean | null }>
  ): Expression {
    return () => token.value
  }

  createArrayExpression(elements: (Expression | null)[]): Expression {
    return () => elements.map(element => element && element())
  }

  createProperty(
    _kind: 'init',
    key: IdentifierExpression,
    value: Expression
  ): Expression {
    return () => ({
      key: key({ child: true }),
      value: value(),
    })
  }

  createObjectExpression(properties: Expression[]): Expression {
    return () => {
      const object: Record<any, any> = {}
      for (const property of properties) {
        const { key, value } = property()
        object[key] = value
      }
      return object
    }
  }

  createTopLevel(expression: Expression): Expression {
    return expression
  }

  createThisExpression(): never {
    // TODO
    throw new Error('`this` is not supported')
  }
}
