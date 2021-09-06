import * as ESTree from 'estree'
import * as acorn from 'acorn' // does not work as default import
import operators from './operators'

type Expression = {
  (scope: any): any
  node: ESTree.Node
}

/**
 * Defines which unary operators are allowed. Must provide an allow list or a
 * block list, but not both. Valid options are `-`, `+`, `!`, `~`, `typeof`.
 * @example
 * ```js
 * // allows only unary operators '!' and '+'
 * { unary: { allow: ['!', '+'] } }
 * // allows any unary operator except '-' and '~'
 * { unary: { block: ['-', '~'] } }
 * ```
 */
export type UnaryOperatorOptions =
  | {
      /**
       * Which unary operators to allow. Valid options are `-`, `+`, `!`, `~`,
       * `typeof`.
       */
      allow: (keyof typeof operators.unary)[]
    }
  | {
      /**
       * Which unary operators to block. Valid options are `-`, `+`, `!`, `~`,
       * `typeof`.
       */
      block: (keyof typeof operators.unary)[]
    }

/**
 * Defines which binary operators are allowed. Must provide an allow list or a
 * block list, but not both. Valid options are `+`, `-`, `*`, `**`, `/`, `%`,
 * `<`, `>`, `<=`, `>=`, `==`, `!=`, `===`, `!==`, `|`, `&`, `<<`, `>>`, `>>>`,
 * `in`, `instanceof`.
 * @example
 * ```js
 * // allows only binary operators '/', '%', '+', and '-'
 * { allow: ['/', '%', '+', '-'] }
 * // allows any binary operator except '*', '**', and '&'
 * { block: ['*', '**', '&'] }
 * ```
 */
export type BinaryOperatorOptions =
  | {
      /**
       * Which binary operators to allow. Valid options are `+`, `-`, `*`, `**`,
       * `/`, `%`, `<`, `>`, `<=`, `>=`, `==`, `!=`, `===`, `!==`, `|`, `&`,
       * `<<`, `>>`, `>>>`, `in`, `instanceof`.
       */
      allow: (keyof typeof operators.binary)[]
    }
  | {
      /**
       * Which binary operators to block. Valid options are `+`, `-`, `*`, `**`,
       * `/`, `%`, `<`, `>`, `<=`, `>=`, `==`, `!=`, `===`, `!==`, `|`, `&`,
       * `<<`, `>>`, `>>>`, `in`, `instanceof`.
       */
      block: (keyof typeof operators.binary)[]
    }

/**
 * Defines which logical operators are allowed. Must provide either an allow
 * list or a block list, but not both. Valid options are `||`, `&&`, `??`.
 * @example
 * ```js
 * // allows only logical operators '||' and '&&'
 * { allow: ['||', '&&'] }
 * // allows any logical operator except '??'
 * { block: ['??'] }
 * ```
 */
export type LogicalOperatorOptions =
  | {
      /**
       * Which logical operators to allow. Valid options are `||`, `&&`, `??`.
       */
      allow: (keyof typeof operators.logical)[]
    }
  | {
      /**
       * Which logical operators to block. Valid options are `||`, `&&`, `??`.
       */
      block: (keyof typeof operators.logical)[]
    }

/**
 * Defines which operators are allowed.
 * @example
 * ```js
 * const operatorOptions = {
 *   unary: { allow: ['!'] },
 *   binary: { allow: ['+', '-', '*', '/', '%'] },
 *   logical: { block: ['??'] },
 *   ternary: false,
 * }
 * ```
 */
export interface OperatorOptions {
  /**
   * Defines which unary operators are allowed. If defined, must provide an
   * allow list or a block list, but not both. Valid options are `-`, `+`, `!`,
   * `~`, `typeof`.
   * @example
   * ```js
   * // allows only unary operators '!' and '+'
   * { unary: { allow: ['!', '+'] } }
   * // allows any unary operator except '-' and '~'
   * { unary: { block: ['-', '~'] } }
   * ```
   */
  unary?: UnaryOperatorOptions | null
  /**
   * Defines which binary operators are allowed. If defined, must provide an
   * allow list or a block list, but not both. Valid options are `+`, `-`, `*`,
   * `**`, `/`, `%`, `<`, `>`, `<=`, `>=`, `==`, `!=`, `===`, `!==`, `|`, `&`,
   * `<<`, `>>`, `>>>`.
   * @example
   * ```js
   * // allows only binary operators '/', '%', '+', and '-'
   * { binary: { allow: ['/', '%', '+', '-'] } }
   * // allows any binary operator except '*', '**', and '&'
   * { binary: { block: ['*', '**', '&'] } }
   * ```
   */
  binary?: BinaryOperatorOptions | null
  /**
   * Defines which logical operators are allowed. If defined, must provide an
   * allow list or a block list, but not both. Valid options are `||`, `&&`,
   * `??`.
   * @example
   * ```js
   * // allows only logical operators '||' and '&&'
   * { logical: { allow: ['||', '&&'] } }
   * // allows any logical operator except '??'
   * { logical: { block: ['??'] } }
   * ```
   */
  logical?: LogicalOperatorOptions | null
  /**
   * Whether or not the ternary/conditional operator is allowed. A value of
   * `true` allows the ternary operator, `false` blocks it. Defaults to `true`.
   */
  ternary?: boolean
}

/**
 * Defines what syntax is allowed.
 * @example
 * ```js
 * const syntaxOptions = {
 *   memberAccess: true,
 *   calls: false,
 *   taggedTemplates: false,
 *   templates: true,
 *   objects: true,
 *   arrays: false,
 *   regexes: false,
 * }
 * ```
 */
export interface SyntaxOptions {
  /**
   * Whether or not member access is allowed. A value of `true` allows member
   * access, `false` blocks it. Defaults to `true`.
   */
  memberAccess?: boolean

  /**
   * Whether or not function calls are allowed. A value of `true` allows
   * function calls, `false` blocks them. Defaults to `true`.
   */
  calls?: boolean

  /**
   * Whether or not tagged template literals are allowed. A value of `true`
   * allows tagged template literals, `false` blocks them. Defaults to `true`.
   */
  taggedTemplates?: boolean

  /**
   * Whether or not template literals are allowed. A value of `true` allows
   * template literals, `false` blocks them. Defaults to `true`.
   */
  templates?: boolean

  /**
   * Whether or not object literals are allowed. A value of `true` allows
   * object literals, `false` blocks them. Defaults to `true`.
   */
  objects?: boolean

  /**
   * Whether or not array literals are allowed. A value of `true` allows
   * array literals, `false` blocks them. Defaults to `true`.
   */
  arrays?: boolean

  /**
   * Whether or not regular expressions are allowed. A value of `true` allows
   * regular expressions, `false` blocks them. Defaults to `true`.
   */
  regexes?: boolean
}

export interface EvaluatorOptions {
  /**
   * Defines which operators are allowed. By default, all supported operators,
   * except for `typeof`, `in`, and `instanceof`, are allowed.
   * @example
   * ```js
   * const options = {
   *   operators: {
   *     unary: { allow: ['!'] },
   *     binary: { allow: ['+', '-', '*', '/', '%'] },
   *     logical: { block: ['??'] },
   *     ternary: false,
   *   },
   * }
   * ```
   */
  operators?: OperatorOptions

  /**
   * Defines what syntax is allowed. By default, all supported syntax is
   * allowed.
   * @example
   * ```js
   * const options = {
   *   syntax: {
   *     memberAccess: true,
   *     calls: false,
   *     taggedTemplates: false,
   *     templates: true,
   *     objects: true,
   *     arrays: false,
   *     regexes: false,
   *   },
   * }
   * ```
   */
  syntax?: SyntaxOptions
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

function filterOperators<
  V,
  R extends Record<string, V>,
  O extends { allow: (keyof R)[] } | { block: (keyof R)[] }
>(options: O, unfiltered: R): Partial<R> {
  // Allow only specified operators
  if ('allow' in options) {
    if ('block' in options) {
      throw new Error(
        'Cannot specify both an allow list and block list of operators'
      )
    }
    const { allow } = options

    if (!Array.isArray(allow)) {
      throw new Error('Operator allow list must be an array')
    }

    return allow.reduce<Partial<R>>((filtered, operator) => {
      if (!(operator in unfiltered)) {
        throw new Error(`Operator ${operator} is not supported`)
      }

      filtered[operator] = unfiltered[operator]
      return filtered
    }, {})
  }

  // Block specified operators
  if ('block' in options) {
    const { block } = options

    if (!Array.isArray(block)) {
      throw new Error('Operator block list must be an array')
    }

    return block.reduce<Partial<R>>((filtered, operator) => {
      if (!(operator in unfiltered)) {
        throw new Error(`Operator ${operator} is not supported`)
      }

      delete filtered[operator]
      return filtered
    }, Object.assign({}, unfiltered))
  }

  throw new Error(
    'Operator options must specify either an allow list or a block list'
  )
}

export default class Evaluator {
  operators: {
    unary: Partial<typeof operators.unary>
    binary: Partial<typeof operators.binary>
    logical: Partial<typeof operators.logical>
  }

  allowTernary: boolean

  allowMemberAccess: boolean

  allowCalls: boolean

  allowTaggedTemplates: boolean

  allowTemplates: boolean

  allowObjects: boolean

  allowArrays: boolean

  allowRegexes: boolean

  constructor({
    operators: {
      unary = { block: ['typeof'] },
      binary = { block: ['in', 'instanceof'] },
      logical,
      ternary = true,
    } = {},
    syntax: {
      memberAccess = true,
      calls = true,
      taggedTemplates = true,
      templates = true,
      objects = true,
      arrays = true,
      regexes = true,
    } = {},
  }: EvaluatorOptions = {}) {
    this.operators = {
      unary: unary ? filterOperators(unary, operators.unary) : operators.unary,
      binary: binary
        ? filterOperators(binary, operators.binary)
        : operators.binary,
      logical: logical
        ? filterOperators(logical, operators.logical)
        : operators.logical,
    }
    this.allowTernary = Boolean(ternary)
    this.allowMemberAccess = Boolean(memberAccess)
    this.allowCalls = Boolean(calls)
    this.allowTaggedTemplates = Boolean(taggedTemplates)
    this.allowTemplates = Boolean(templates)
    this.allowObjects = Boolean(objects)
    this.allowArrays = Boolean(arrays)
    this.allowRegexes = Boolean(regexes)
  }

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
    if (!this.allowArrays) {
      throw new Error('Array literals are not allowed')
    }
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
    const operator = this.operators.binary[node.operator]
    if (!operator) {
      if (!(node.operator in operators.binary)) {
        throw new Error(`Unsupported binary operator: ${node.operator}`)
      }
      throw new Error(`Binary operator ${node.operator} is not allowed`)
    }
    const left = this.evaluateIfIdentifier(node.left)
    const right = this.evaluateIfIdentifier(node.right)
    return Object.assign((scope: any) => operator(left(scope), right(scope)), {
      node,
    })
  }

  createCallExpression(node: ESTree.SimpleCallExpression): CallExpression {
    if (!this.allowCalls) {
      throw new Error('Function calls are not allowed')
    }
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
    if (!this.allowTernary) {
      throw new Error('Conditional/ternary operator is not allowed')
    }
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
    if (!this.allowRegexes && node.value instanceof RegExp) {
      throw new Error('Regular expressions are not allowed')
    }
    return Object.assign(() => node.value, { node })
  }

  createLogicalExpression(node: ESTree.LogicalExpression): LogicalExpression {
    const operator = this.operators.logical[node.operator]
    if (!operator) {
      if (!(node.operator in operators.logical)) {
        throw new Error(`Unsupported logical operator: ${node.operator}`)
      }
      throw new Error(`Logical operator ${node.operator} is not allowed`)
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
    if (!this.allowMemberAccess) {
      throw new Error('Member access is not allowed')
    }
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
    if (!this.allowObjects) {
      throw new Error('Object literals are not allowed')
    }
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
    if (!this.allowTaggedTemplates) {
      throw new Error('Tagged template literals are not allowed')
    }
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
    if (!this.allowTemplates) {
      throw new Error('Template literals are not allowed')
    }
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
    const operator = this.operators.unary[node.operator]
    if (!operator) {
      if (!(node.operator in operators.unary)) {
        throw new Error(`Unsupported unary operator: ${node.operator}`)
      }
      throw new Error(`Unary operator ${node.operator} is not allowed`)
    }
    const argument = this.evaluateIfIdentifier(node.argument)

    return Object.assign((scope: any) => operator(argument(scope)), { node })
  }
}
