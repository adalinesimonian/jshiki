import {
  ArrayExpression,
  BinaryExpression,
  CallExpression,
  ConditionalExpression,
  Delegate,
  Expression,
  IdentifierExpression,
  LiteralExpression,
  MemberExpression,
  ObjectExpression,
  PropertyExpression,
  Syntax,
  Token,
  TopLevelExpression,
  UnaryExpression,
} from './lib/esprima/types'
import operators from './operators'
import RuleTree, { AccessRule } from './rule-tree'
import getRuleProxy from './rule-proxy'

export interface ASTDelegateOptions {
  /**
   * The scope to use when evaluating the expression. The expression will be
   * limited to accessing the properties of the scope.
   */
  scope?: Record<any, any>
  /**
   * Access rules to use when determining what properties can be accessed by the
   * expression. The rules are evaluated in order.
   */
  rules?: AccessRule[]
  /**
   * If true, only properties with a matching allow rule can be accessed by the
   * expression. If false, all properties can be accessed unless they have a
   * block rule. Defaults to false.
   * @default false
   */
  explicitAllow?: boolean
}

export default class ASTDelegate implements Delegate {
  scope: any
  ruleTree?: RuleTree
  explicitAllow: boolean

  constructor({ scope = {}, rules, explicitAllow }: ASTDelegateOptions = {}) {
    this.ruleTree = rules ? new RuleTree(rules) : undefined
    this.explicitAllow = Boolean(explicitAllow)
    this.scope = this.ruleTree
      ? getRuleProxy(scope, this.ruleTree, explicitAllow)
      : scope
  }

  createUnaryExpression(op: string, arg: Expression): UnaryExpression {
    if (!operators.unary[op as keyof typeof operators.unary]) {
      throw Error(`Disallowed operator: ${op}`)
    }

    return Object.assign(
      () => operators.unary[op as keyof typeof operators.unary](arg()),
      {
        type: Syntax.UnaryExpression as const,
        operator: op,
        argument: arg,
      }
    )
  }

  createBinaryExpression(
    op: string,
    left: Expression,
    right: Expression
  ): BinaryExpression {
    if (!operators.binary[op as keyof typeof operators.binary]) {
      throw Error(`Disallowed operator: ${op}`)
    }

    const leftExpr =
      left.type === Syntax.Identifier ? () => this.scope[left.identifier] : left
    const rightExpr =
      right.type === Syntax.Identifier
        ? () => this.scope[right.identifier]
        : right

    return Object.assign(
      () =>
        operators.binary[op as keyof typeof operators.binary](
          leftExpr(),
          rightExpr()
        ),
      {
        type: Syntax.BinaryExpression as const,
        operator: op,
        left,
        right,
      }
    )
  }

  createConditionalExpression(
    test: Expression,
    consequent: Expression,
    alternate: Expression
  ): ConditionalExpression {
    return Object.assign(() => (test() ? consequent() : alternate()), {
      type: Syntax.ConditionalExpression as const,
      test,
      consequent,
      alternate,
    })
  }

  createIdentifier(identifier: string): IdentifierExpression {
    return Object.assign(() => identifier, {
      type: Syntax.Identifier as const,
      identifier: identifier,
    })
  }

  createMemberExpression(
    accessor: '.' | '[',
    object: Expression,
    property: Expression
  ): MemberExpression {
    const objectEvaluator =
      object.type === Syntax.Identifier
        ? () => this.scope[object.identifier]
        : object

    return Object.assign(() => objectEvaluator()[property()], {
      type: Syntax.MemberExpression as const,
      accessor,
      object,
      property,
    })
  }

  createCallExpression(callee: Expression, args: Expression[]): CallExpression {
    return Object.assign(
      () => {
        let func, self
        if (callee.type === Syntax.Identifier) {
          self = this.scope[callee.identifier]
          func = self
        } else if (callee.type === Syntax.MemberExpression) {
          self = callee.object()
          func = callee()
        } else {
          self = callee()
          func = callee
        }
        return func.apply(
          self,
          args.map(arg => arg())
        )
      },
      {
        type: Syntax.CallExpression as const,
        callee,
        args,
      }
    )
  }

  createLiteral(
    token: Pick<
      Extract<Token, { value: string | number | boolean | null }>,
      'value'
    >
  ): LiteralExpression {
    return Object.assign(() => token.value, {
      type: Syntax.Literal as const,
      value: token.value,
    })
  }

  createArrayExpression(elements: (Expression | null)[]): ArrayExpression {
    return Object.assign(() => elements.map(element => element && element()), {
      type: Syntax.ArrayExpression as const,
      elements,
    })
  }

  createProperty(
    kind: 'init',
    key: IdentifierExpression,
    value: Expression
  ): PropertyExpression {
    return Object.assign(
      () => ({
        key: key({ child: true }),
        value: value(),
      }),
      {
        type: Syntax.Property as const,
        kind,
        key,
        value,
      }
    )
  }

  createObjectExpression(properties: Expression[]): ObjectExpression {
    return Object.assign(
      () => {
        const object: Record<any, any> = {}
        for (const property of properties) {
          const { key, value } = property()
          object[key] = value
        }
        return object
      },
      {
        type: Syntax.ObjectExpression as const,
        properties,
      }
    )
  }

  createTopLevel(expression: Expression): TopLevelExpression {
    let evaluator
    if (expression.type === Syntax.Identifier) {
      const identifier = this.scope[expression.identifier]
      evaluator = () => identifier
    } else {
      evaluator = expression
    }

    return Object.assign(evaluator, {
      type: Syntax.TopLevel as const,
      expression,
    })
  }

  createThisExpression(): never {
    // TODO
    throw new Error('`this` is not supported')
  }
}
