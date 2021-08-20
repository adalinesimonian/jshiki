import * as ESTree from 'estree'
import * as acorn from 'acorn' // does not work as default import
import operators from './operators'

type Expression = {
  (scope: any): any
  node: ESTree.Node
}

type ArrayExpression = Expression & { node: ESTree.ArrayExpression }
// TODO
// type AwaitExpression = Expression & { node: ESTree.AwaitExpression }
type BinaryExpression = Expression & { node: ESTree.BinaryExpression }
type CallExpression = Expression & { node: ESTree.SimpleCallExpression }
type ChainExpression = Expression & { node: ESTree.ChainExpression }
type ConditionalExpression = Expression & { node: ESTree.ConditionalExpression }
type IdentifierExpression = Expression & { node: ESTree.Identifier }
type LiteralExpression = Expression & {
  node: ESTree.SimpleLiteral | ESTree.RegExpLiteral | ESTree.BigIntLiteral
}
type LogicalExpression = Expression & { node: ESTree.LogicalExpression }
type MemberExpression = Expression & { node: ESTree.MemberExpression }
type ObjectExpression = Expression & { node: ESTree.ObjectExpression }
type TaggedTemplateExpression = Expression & {
  node: ESTree.TaggedTemplateExpression
}
type TemplateLiteralExpression = Expression & { node: ESTree.TemplateLiteral }
type UnaryExpression = Expression & { node: ESTree.UnaryExpression }

function assert(condition: boolean): asserts condition {
  console.assert(condition)
}

function* iterateThroughTemplateLiteral(
  node: ESTree.TemplateLiteral
): Generator<ESTree.TemplateElement | ESTree.Expression> {
  let expressionIndex = 0
  let quasiIndex = 0
  do {
    yield node.quasis[quasiIndex]
    quasiIndex++

    if (expressionIndex < node.expressions.length) {
      yield node.expressions[expressionIndex]
      expressionIndex++
    }
  } while (
    quasiIndex < node.quasis.length ||
    expressionIndex < node.expressions.length
  )
}

export default class Evaluator {
  createExpression(code: string): (scope?: any) => any {
    // Wrapping in an arrow function to allow use of expressions that would
    // otherwise be invalid as a statement.
    const ast = acorn.parse(`() => (${code})`, {
      sourceType: 'module',
      ecmaVersion: 'latest',
    }) as unknown as ESTree.Program
    assert(ast.body.length === 1)
    const statement = ast.body[0]
    assert(statement.type === 'ExpressionStatement')
    const { expression } = statement
    assert(expression.type === 'ArrowFunctionExpression')
    const built = this.evaluateIfIdentifier(expression.body)
    return (scope: any = {}) => built(scope)
  }

  createExpressionForNode(node: ESTree.Node): Expression {
    switch (node.type) {
      case 'ArrayExpression':
        return this.createArrayExpression(node)
      // TODO
      // case 'AwaitExpression':
      //   return this.createAwaitExpression(node)
      case 'BinaryExpression':
        return this.createBinaryExpression(node)
      case 'CallExpression':
        return this.createCallExpression(node)
      case 'ChainExpression':
        return this.createChainExpression(node)
      case 'ConditionalExpression':
        return this.createConditionalExpression(node)
      case 'Identifier':
        return this.createIdentifier(node)
      case 'Literal':
        return this.createLiteral(node)
      case 'LogicalExpression':
        return this.createLogicalExpression(node)
      case 'MemberExpression':
        return this.createMemberExpression(node)
      case 'ObjectExpression':
        return this.createObjectExpression(node)
      case 'TaggedTemplateExpression':
        return this.createTaggedTemplateExpression(node)
      case 'TemplateLiteral':
        return this.createTemplateLiteral(node)
      case 'UnaryExpression':
        return this.createUnaryExpression(node)
      default:
        throw new Error(`Unsupported node type: ${(node as any).type}`)
    }
  }

  evaluateIfIdentifier(node: ESTree.Node): Expression {
    if (node.type === 'Identifier') {
      const { name } = node
      switch (name) {
        case 'undefined':
          return Object.assign(() => undefined, { node })
        case 'NaN':
          return Object.assign(() => NaN, { node })
        case 'Infinity':
          return Object.assign(() => Infinity, { node })
        default:
          return Object.assign((scope: any) => scope[name], { node })
      }
    }

    return this.createExpressionForNode(node)
  }

  parseCallArgs(
    args: (ESTree.Expression | ESTree.SpreadElement)[]
  ): ((arr: any[], scope: any) => any[])[] {
    return args.map(argument => {
      if (argument.type === 'SpreadElement') {
        const expression = this.evaluateIfIdentifier(argument.argument)
        return (arr: any[], scope: any) => arr.concat(expression(scope))
      }

      const expression = this.evaluateIfIdentifier(argument)
      return (arr: any[], scope: any) => {
        arr.push(expression(scope))
        return arr
      }
    })
  }

  createArrayExpression(node: ESTree.ArrayExpression): ArrayExpression {
    const elements = node.elements.map(element => {
      if (!element) {
        // eslint-disable-next-line no-sparse-arrays
        return (arr: any[]) => arr.concat([,])
      }
      if (element.type === 'SpreadElement') {
        const expression = this.evaluateIfIdentifier(element.argument)
        return (arr: any[], scope: any) => {
          arr.push(...expression(scope))
          return arr
        }
      }
      return (arr: any[], scope: any) => {
        const expression = this.evaluateIfIdentifier(element)
        arr.push(expression(scope))
        return arr
      }
    })
    return Object.assign(
      (scope: any) => elements.reduce<any[]>((arr, fn) => fn(arr, scope), []),
      { node }
    )
  }

  // TODO
  // createAwaitExpression(node: ESTree.AwaitExpression): AwaitExpression {
  //   return Object.assign(() => {
  //     this.#evaluateIfIdentifier(node.argument)
  //   }, {
  //     node,
  //   })
  // }

  createBinaryExpression(node: ESTree.BinaryExpression): BinaryExpression {
    const operator = operators.binary[node.operator]
    if (!operator) {
      throw new Error(`Unsupported binary operator: ${node.operator}`)
    }
    const left = this.evaluateIfIdentifier(node.left)
    const right = this.evaluateIfIdentifier(node.right)
    return Object.assign((scope: any) => operator(left(scope), right(scope)), {
      node,
    })
  }

  createCallExpression(node: ESTree.SimpleCallExpression): CallExpression {
    if (node.callee.type !== 'MemberExpression') {
      const callee = this.evaluateIfIdentifier(node.callee)

      const args = this.parseCallArgs(node.arguments)
      return Object.assign(
        node.optional
          ? (scope: any) =>
              callee(scope)?.(
                ...args.reduce<any[]>((arr, arg) => arg(arr, scope), [])
              )
          : (scope: any) =>
              callee(scope)(
                ...args.reduce<any[]>((arr, arg) => arg(arr, scope), [])
              ),
        { node }
      )
    }

    const object = this.evaluateIfIdentifier(node.callee.object)
    const property = node.callee.computed
      ? this.evaluateIfIdentifier(node.callee.property)
      : this.createExpressionForNode(node.callee.property)
    const args = this.parseCallArgs(node.arguments)

    return Object.assign(
      node.optional
        ? (scope: any) => {
            const evaluatedObject = object(scope)
            return evaluatedObject[property(scope)]?.(
              ...args.reduce<any[]>((arr, arg) => arg(arr, scope), [])
            )
          }
        : (scope: any) => {
            const evaluatedObject = object(scope)
            return evaluatedObject[property(scope)](
              ...args.reduce<any[]>((arr, arg) => arg(arr, scope), [])
            )
          }
    )
  }

  createChainExpression(node: ESTree.ChainExpression): ChainExpression {
    const expression = this.createExpressionForNode(node.expression)
    return Object.assign((scope: any) => expression(scope), { node })
  }

  createConditionalExpression(
    node: ESTree.ConditionalExpression
  ): ConditionalExpression {
    const test = this.evaluateIfIdentifier(node.test)
    const consequent = this.evaluateIfIdentifier(node.consequent)
    const alternate = this.evaluateIfIdentifier(node.alternate)
    return Object.assign(
      (scope: any) => (test(scope) ? consequent(scope) : alternate(scope)),
      { node }
    )
  }

  createIdentifier(node: ESTree.Identifier): IdentifierExpression {
    return Object.assign(() => node.name, { node })
  }

  createLiteral(
    node: ESTree.SimpleLiteral | ESTree.RegExpLiteral | ESTree.BigIntLiteral
  ): LiteralExpression {
    return Object.assign(() => node.value, { node })
  }

  createLogicalExpression(node: ESTree.LogicalExpression): LogicalExpression {
    const operator = operators.logical[node.operator]
    if (!operator) {
      throw new Error(`Unsupported logical operator: ${node.operator}`)
    }
    const left = this.evaluateIfIdentifier(node.left)
    const right = this.evaluateIfIdentifier(node.right)

    return Object.assign(
      (scope: any) =>
        operator(
          () => left(scope),
          () => right(scope)
        ),
      { node }
    )
  }

  createMemberExpression(node: ESTree.MemberExpression): MemberExpression {
    const object = this.evaluateIfIdentifier(node.object)
    const property = node.computed
      ? this.evaluateIfIdentifier(node.property)
      : this.createExpressionForNode(node.property)

    return node.optional
      ? Object.assign((scope: any) => object(scope)?.[property(scope)], {
          node,
        })
      : Object.assign((scope: any) => object(scope)[property(scope)], { node })
  }

  createObjectExpression(node: ESTree.ObjectExpression): ObjectExpression {
    const properties = node.properties.map(property => {
      switch (property.type) {
        case 'Property': {
          if (property.kind !== 'init') {
            throw new Error('Only assignment properties are allowed')
          }
          const key = property.computed
            ? this.evaluateIfIdentifier(property.key)
            : this.createExpressionForNode(property.key)
          const value = this.evaluateIfIdentifier(property.value)

          return (obj: any, scope: any) => {
            obj[key(scope)] = value(scope)
            return obj
          }
        }
        case 'SpreadElement': {
          const argument = this.evaluateIfIdentifier(property.argument)
          return (obj: any, scope: any) => ({ ...obj, ...argument(scope) })
        }
        default:
          throw new Error(
            `Unsupported property type: ${(property as any).type}`
          )
      }
    })
    return Object.assign(
      (scope: any) => properties.reduce((obj, fn) => fn(obj, scope), {}),
      {
        node,
      }
    )
  }

  createTaggedTemplateExpression(
    node: ESTree.TaggedTemplateExpression
  ): TaggedTemplateExpression {
    const tag = this.evaluateIfIdentifier(node.tag)

    const strings: TemplateStringsArray = node.quasi.quasis.reduce<
      string[] & { raw: string[] }
    >((strs, quasi) => {
      strs.push(quasi.value.cooked!)
      strs.raw.push(quasi.value.raw)
      return strs
    }, Object.assign([], { raw: [] }))
    const expressions = node.quasi.expressions.map(expression =>
      this.evaluateIfIdentifier(expression)
    )

    return Object.assign(
      (scope: any) =>
        tag(scope)(
          Object.assign(strings.slice(), { raw: strings.raw.slice() }),
          ...expressions.map(expr => expr(scope))
        ),
      { node }
    )
  }

  createTemplateLiteral(
    node: ESTree.TemplateLiteral
  ): TemplateLiteralExpression {
    const expressions: ((scope: any) => string)[] = []
    for (const element of iterateThroughTemplateLiteral(node)) {
      if (element.type === 'TemplateElement') {
        const str = element.value.cooked!
        expressions.push(() => str)
      } else {
        const expression = this.evaluateIfIdentifier(element)
        expressions.push((scope: any) => `${expression(scope)}`)
      }
    }
    return Object.assign(
      (scope: any) => expressions.reduce((str, elem) => str + elem(scope), ''),
      { node }
    )
  }

  createUnaryExpression(node: ESTree.UnaryExpression): UnaryExpression {
    const operator = operators.unary[node.operator]
    if (!operator) {
      throw new Error(`Unsupported unary operator: ${node.operator}`)
    }
    const argument = this.evaluateIfIdentifier(node.argument)

    return Object.assign((scope: any) => operator(argument(scope)), { node })
  }
}
