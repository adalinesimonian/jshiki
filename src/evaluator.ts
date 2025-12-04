import * as ESTree from 'estree'
import * as acorn from 'acorn' // does not work as default import
import operators from './operators'

type Expression<T extends ESTree.Node> = {
  (scope: unknown): unknown
  node: T
}

type AsyncExpression<T extends ESTree.Node> = {
  (scope: unknown): Promise<{ value: unknown }>
  node: T
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

type AsyncIfSpecified<
  T extends boolean,
  N extends ESTree.Node = ESTree.Node,
  A extends AsyncExpression<N> = AsyncExpression<N>,
  S extends Expression<N> = Expression<N>,
> = T extends true ? A : S

function assert(condition: boolean): asserts condition {
  console.assert(condition)
}

function* iterateThroughTemplateLiteral(
  node: ESTree.TemplateLiteral,
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
  O extends { allow: (keyof R)[] } | { block: (keyof R)[] },
>(options: O, unfiltered: R): Partial<R> {
  // Allow only specified operators
  if ('allow' in options) {
    if ('block' in options) {
      throw new Error(
        'Cannot specify both an allow list and block list of operators',
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

    return block.reduce<Partial<R>>(
      (filtered, operator) => {
        if (!(operator in unfiltered)) {
          throw new Error(`Operator ${operator} is not supported`)
        }

        delete filtered[operator]
        return filtered
      },
      Object.assign({}, unfiltered),
    )
  }

  throw new Error(
    'Operator options must specify either an allow list or a block list',
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

  /**
   * Parses a string representing an expression and returns an invokable
   * function that evaluates the expression.
   * @param code The expression to parse.
   * @param async Whether or not the expression should be evaluated as an
   * asynchronous function. If true, the expression can use the `await` keyword.
   */
  createExpression(code: string): (scope?: any) => any
  createExpression<T extends boolean>(
    code: string,
    async: T,
  ): T extends true ? (scope?: any) => Promise<any> : (scope?: any) => any
  createExpression<T extends boolean>(
    code: string,
    async?: T,
  ): T extends true ? (scope?: any) => Promise<any> : (scope?: any) => any {
    // Wrapping in an arrow function to allow use of expressions that would
    // otherwise be invalid as a statement.
    const ast = acorn.parse(
      async ? `async () => (${code})` : `() => (${code})`,
      {
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    ) as unknown as ESTree.Program
    assert(ast.body.length === 1)
    const statement = ast.body[0]
    assert(statement.type === 'ExpressionStatement')
    const { expression } = statement
    assert(expression.type === 'ArrowFunctionExpression')
    if (async) {
      const built = this.evaluateIfIdentifier(expression.body, true)
      return async (scope: any = {}) => (await built(scope)).value
    }
    const built = this.evaluateIfIdentifier(expression.body, false)
    return (scope: any = {}): any => built(scope)
  }

  createExpressionForNode<T extends boolean>(
    node: ESTree.Node,
    async: T,
  ): AsyncIfSpecified<T, ESTree.Node> {
    switch (node.type) {
      case 'ArrayExpression':
        return this.createArrayExpression(node, async)
      case 'AwaitExpression':
        return this.createAwaitExpression(node, async)
      case 'BinaryExpression':
        return this.createBinaryExpression(node, async)
      case 'CallExpression':
        return this.createCallExpression(node, async)
      case 'ChainExpression':
        return this.createChainExpression(node, async)
      case 'ConditionalExpression':
        return this.createConditionalExpression(node, async)
      case 'Identifier':
        return this.createIdentifier(node, async)
      case 'Literal':
        return this.createLiteral(node, async)
      case 'LogicalExpression':
        return this.createLogicalExpression(node, async)
      case 'MemberExpression':
        return this.createMemberExpression(node, async)
      case 'ObjectExpression':
        return this.createObjectExpression(node, async)
      case 'TaggedTemplateExpression':
        return this.createTaggedTemplateExpression(node, async)
      case 'TemplateLiteral':
        return this.createTemplateLiteral(node, async)
      case 'UnaryExpression':
        return this.createUnaryExpression(node, async)
      default:
        throw new Error(`Unsupported node type: ${(node as any).type}`)
    }
  }

  evaluateIfIdentifier<T extends boolean>(
    node: ESTree.Node,
    async: T,
  ): AsyncIfSpecified<T, ESTree.Node> {
    if (node.type === 'Identifier') {
      const { name } = node
      switch (name) {
        case 'undefined':
          return Object.assign(
            async ? async () => ({ value: undefined }) : (): any => undefined,
            { node },
          )
        case 'NaN':
          return Object.assign(
            async ? async () => ({ value: NaN }) : (): any => NaN,
            { node },
          )
        case 'Infinity':
          return Object.assign(
            async ? async () => ({ value: Infinity }) : (): any => Infinity,
            { node },
          )
        default:
          return Object.assign(
            async
              ? async (scope: any) => ({ value: scope[name] })
              : (scope: any) => scope[name],
            { node },
          )
      }
    }

    return this.createExpressionForNode(node, async)
  }

  parseCallArgs<T extends boolean>(
    args: (ESTree.Expression | ESTree.SpreadElement)[],
    async: T,
  ): T extends true ? (scope: any) => Promise<any[]> : (scope: any) => any[] {
    if (async) {
      const argFuncs = args.map(argument => {
        if (argument.type === 'SpreadElement') {
          const expression = this.evaluateIfIdentifier(argument.argument, true)
          return async (arr: any[], scope: any) =>
            arr.concat((await expression(scope)).value)
        }

        const expression = this.evaluateIfIdentifier(argument, true)
        return async (arr: any[], scope: any) => {
          arr.push((await expression(scope)).value)
          return arr
        }
      })

      return (async (scope: any) => {
        let evaluatedArgs: any[] = []
        for (const arg of argFuncs) {
          evaluatedArgs = await arg(evaluatedArgs, scope)
        }
        return evaluatedArgs
      }) as T extends true
        ? (scope: any) => Promise<any[]>
        : (scope: any) => any[]
    }
    const argFuncs = args.map(argument => {
      if (argument.type === 'SpreadElement') {
        const expression = this.evaluateIfIdentifier(argument.argument, false)
        return (arr: any[], scope: any) => arr.concat(expression(scope))
      }

      const expression = this.evaluateIfIdentifier(argument, false)
      return (arr: any[], scope: any) => {
        arr.push(expression(scope))
        return arr
      }
    })

    return (scope: any): any => {
      let evaluatedArgs: any[] = []
      for (const arg of argFuncs) {
        evaluatedArgs = arg(evaluatedArgs, scope)
      }
      return evaluatedArgs
    }
  }

  createArrayExpression<T extends boolean>(
    node: ESTree.ArrayExpression,
    async: T,
  ): AsyncIfSpecified<T, ESTree.ArrayExpression> {
    if (!this.allowArrays) {
      throw new Error('Array literals are not allowed')
    }
    if (async) {
      const elements = node.elements.map(element => {
        if (!element) {
          // eslint-disable-next-line no-sparse-arrays
          return (arr: any[]) => arr.concat([,])
        }
        if (element.type === 'SpreadElement') {
          const expression = this.evaluateIfIdentifier(element.argument, true)
          return async (arr: any[], scope: any) => {
            arr.push(...((await expression(scope)).value as any))
            return arr
          }
        }
        const expression = this.evaluateIfIdentifier(element, true)
        return async (arr: any[], scope: any) => {
          arr.push((await expression(scope)).value)
          return arr
        }
      })
      return Object.assign(
        async (scope: any) => {
          let arr: any[] = []
          for (const element of elements) {
            arr = await element(arr, scope)
          }
          return { value: arr }
        },
        { node },
      )
    }
    const elements = node.elements.map(element => {
      if (!element) {
        // eslint-disable-next-line no-sparse-arrays
        return (arr: any[]) => arr.concat([,])
      }
      if (element.type === 'SpreadElement') {
        const expression = this.evaluateIfIdentifier(element.argument, false)
        return (arr: any[], scope: any) => {
          arr.push(...(expression(scope) as any))
          return arr
        }
      }
      const expression = this.evaluateIfIdentifier(element, false)
      return (arr: any[], scope: any) => {
        arr.push(expression(scope))
        return arr
      }
    })
    return Object.assign(
      (scope: any): any =>
        elements.reduce<any[]>((arr, fn) => fn(arr, scope), []),
      { node },
    )
  }

  createAwaitExpression(
    node: ESTree.AwaitExpression,
    async: boolean,
  ): AsyncExpression<ESTree.AwaitExpression> {
    if (!async) {
      throw new Error('await can only be used in async expressions')
    }
    const expression = this.evaluateIfIdentifier(node.argument, async)
    return Object.assign(
      async (scope: any) => ({ value: await (await expression(scope)).value }),
      { node },
    )
  }

  createBinaryExpression<T extends boolean>(
    node: ESTree.BinaryExpression,
    async: T,
  ): AsyncIfSpecified<T, ESTree.BinaryExpression> {
    const operator = this.operators.binary[node.operator]
    if (!operator) {
      if (!(node.operator in operators.binary)) {
        throw new Error(`Unsupported binary operator: ${node.operator}`)
      }
      throw new Error(`Binary operator ${node.operator} is not allowed`)
    }

    if (async) {
      const left = this.evaluateIfIdentifier(node.left, true)
      const right = this.evaluateIfIdentifier(node.right, true)

      return Object.assign(
        async (scope: any) => ({
          value: operator(
            (await left(scope)).value,
            (await right(scope)).value,
          ),
        }),
        { node },
      )
    }

    const left = this.evaluateIfIdentifier(node.left, false)
    const right = this.evaluateIfIdentifier(node.right, false)

    return Object.assign((scope: any) => operator(left(scope), right(scope)), {
      node,
    })
  }

  createCallExpression<T extends boolean>(
    node: ESTree.SimpleCallExpression,
    async: T,
  ): AsyncIfSpecified<T, ESTree.SimpleCallExpression> {
    if (!this.allowCalls) {
      throw new Error('Function calls are not allowed')
    }
    if (node.callee.type !== 'MemberExpression') {
      if (async) {
        const callee = this.evaluateIfIdentifier(node.callee, true)
        const args = this.parseCallArgs(node.arguments, true)

        return Object.assign(
          node.optional
            ? async (scope: any) => ({
                value: ((await callee(scope)).value as any)?.(
                  ...(await args(scope)),
                ),
              })
            : async (scope: any) => ({
                value: ((await callee(scope)).value as any)(
                  ...(await args(scope)),
                ),
              }),
          { node },
        )
      }

      const callee = this.evaluateIfIdentifier(node.callee, false)
      const args = this.parseCallArgs(node.arguments, false)

      return Object.assign(
        node.optional
          ? (scope: any) => (callee(scope) as any)?.(...args(scope))
          : (scope: any) => (callee(scope) as any)(...args(scope)),
        { node },
      )
    }

    if (async) {
      const object = this.evaluateIfIdentifier(node.callee.object, true)
      const property = node.callee.computed
        ? this.evaluateIfIdentifier(node.callee.property, true)
        : this.createExpressionForNode(node.callee.property, true)

      const args = this.parseCallArgs(node.arguments, true)

      if (node.callee.optional) {
        if (node.optional) {
          return Object.assign(
            async (scope: any) => {
              const obj: any = (await object(scope)).value
              const prop: any = (await property(scope)).value
              return { value: obj?.[prop]?.(...(await args(scope))) }
            },
            { node },
          )
        }
        return Object.assign(
          async (scope: any) => {
            const obj: any = (await object(scope)).value
            const prop: any = (await property(scope)).value
            return { value: obj?.[prop](...(await args(scope))) }
          },
          { node },
        )
      }

      if (node.optional) {
        return Object.assign(
          async (scope: any) => {
            const obj: any = (await object(scope)).value
            const prop: any = (await property(scope)).value
            return { value: obj[prop]?.(...(await args(scope))) }
          },
          { node },
        )
      }

      return Object.assign(
        async (scope: any) => {
          const obj: any = (await object(scope)).value
          const prop: any = (await property(scope)).value
          return { value: obj[prop](...(await args(scope))) }
        },
        { node },
      )
    }

    const object = this.evaluateIfIdentifier(node.callee.object, false)
    const property = node.callee.computed
      ? this.evaluateIfIdentifier(node.callee.property, false)
      : this.createExpressionForNode(node.callee.property, false)
    const args = this.parseCallArgs(node.arguments, false)

    if (node.callee.optional) {
      if (node.optional) {
        return Object.assign(
          (scope: any) => {
            const evaluatedObject: any = object(scope)
            return evaluatedObject?.[property(scope) as any]?.(...args(scope))
          },
          { node },
        )
      }

      return Object.assign(
        (scope: any) => {
          const evaluatedObject: any = object(scope)
          return evaluatedObject?.[property(scope) as any](...args(scope))
        },
        { node },
      )
    }

    if (node.optional) {
      return Object.assign(
        (scope: any) => {
          const evaluatedObject: any = object(scope)
          return evaluatedObject[property(scope) as any]?.(...args(scope))
        },
        { node },
      )
    }

    return Object.assign(
      (scope: any) => {
        const evaluatedObject: any = object(scope)
        return evaluatedObject[property(scope) as any](...args(scope))
      },
      { node },
    )
  }

  createChainExpression<T extends boolean>(
    node: ESTree.ChainExpression,
    async: T,
  ): AsyncIfSpecified<T, ESTree.ChainExpression> {
    const expression = this.createExpressionForNode(node.expression, async)
    return Object.assign((scope: any): any => expression(scope), { node })
  }

  createConditionalExpression<T extends boolean>(
    node: ESTree.ConditionalExpression,
    async: T,
  ): AsyncIfSpecified<T, ESTree.ConditionalExpression> {
    if (!this.allowTernary) {
      throw new Error('Conditional/ternary operator is not allowed')
    }

    if (async) {
      const test = this.evaluateIfIdentifier(node.test, true)
      const consequent = this.evaluateIfIdentifier(node.consequent, true)
      const alternate = this.evaluateIfIdentifier(node.alternate, true)

      return Object.assign(
        async (scope: any) => ({
          value: (await test(scope)).value
            ? (await consequent(scope)).value
            : (await alternate(scope)).value,
        }),
        { node },
      )
    }
    const test = this.evaluateIfIdentifier(node.test, false)
    const consequent = this.evaluateIfIdentifier(node.consequent, false)
    const alternate = this.evaluateIfIdentifier(node.alternate, false)

    return Object.assign(
      (scope: any): any => (test(scope) ? consequent(scope) : alternate(scope)),
      { node },
    )
  }

  createIdentifier<T extends boolean>(
    node: ESTree.Identifier,
    async: T,
  ): AsyncIfSpecified<T, ESTree.Identifier> {
    if (async) {
      return Object.assign(async () => ({ value: node.name }), { node })
    }
    return Object.assign((): any => node.name, { node })
  }

  createLiteral<T extends boolean>(
    node: ESTree.SimpleLiteral | ESTree.RegExpLiteral | ESTree.BigIntLiteral,
    async: T,
  ): AsyncIfSpecified<
    T,
    ESTree.SimpleLiteral | ESTree.RegExpLiteral | ESTree.BigIntLiteral
  > {
    if (!this.allowRegexes && node.value instanceof RegExp) {
      throw new Error('Regular expressions are not allowed')
    }
    if (async) {
      return Object.assign(async () => ({ value: node.value }), { node })
    }
    return Object.assign((): any => node.value, { node })
  }

  createLogicalExpression<T extends boolean>(
    node: ESTree.LogicalExpression,
    async: T,
  ): AsyncIfSpecified<T, ESTree.LogicalExpression> {
    const operator = this.operators.logical[node.operator]
    if (!operator) {
      if (!(node.operator in operators.logical)) {
        throw new Error(`Unsupported logical operator: ${node.operator}`)
      }
      throw new Error(`Logical operator ${node.operator} is not allowed`)
    }

    if (async) {
      const left = this.evaluateIfIdentifier(node.left, true)
      const right = this.evaluateIfIdentifier(node.right, true)

      return Object.assign(
        async (scope: any) => ({
          value: (
            await operator.async(
              async (): Promise<any> => await left(scope),
              async (): Promise<any> => await right(scope),
            )
          ).result,
        }),
        { node },
      )
    }

    const left = this.evaluateIfIdentifier(node.left, false)
    const right = this.evaluateIfIdentifier(node.right, false)

    return Object.assign(
      (scope: any) =>
        operator(
          () => left(scope),
          () => right(scope),
        ),
      { node },
    )
  }

  createMemberExpression<T extends boolean>(
    node: ESTree.MemberExpression,
    async: T,
  ): AsyncIfSpecified<T, ESTree.MemberExpression> {
    if (!this.allowMemberAccess) {
      throw new Error('Member access is not allowed')
    }

    if (async) {
      const object = this.evaluateIfIdentifier(node.object, true)
      const property = node.computed
        ? this.evaluateIfIdentifier(node.property, true)
        : this.createExpressionForNode(node.property, true)

      return Object.assign(
        node.optional
          ? async (scope: any) => ({
              value: ((await object(scope)).value as any)?.[
                (await property(scope)).value as any
              ],
            })
          : async (scope: any) => ({
              value: ((await object(scope)).value as any)[
                (await property(scope)).value as any
              ],
            }),
        { node },
      )
    }

    const object = this.evaluateIfIdentifier(node.object, false)
    const property = node.computed
      ? this.evaluateIfIdentifier(node.property, false)
      : this.createExpressionForNode(node.property, false)

    return node.optional
      ? Object.assign(
          (scope: any) => (object(scope) as any)?.[property(scope) as any],
          {
            node,
          },
        )
      : Object.assign(
          (scope: any) => (object(scope) as any)[property(scope) as any],
          { node },
        )
  }

  createObjectExpression<T extends boolean>(
    node: ESTree.ObjectExpression,
    async: T,
  ): AsyncIfSpecified<T, ESTree.ObjectExpression> {
    if (!this.allowObjects) {
      throw new Error('Object literals are not allowed')
    }

    if (async) {
      const properties = node.properties.map(property => {
        if (property.type === 'SpreadElement') {
          const argument = this.evaluateIfIdentifier(property.argument, true)
          return async (obj: any, scope: any) => ({
            ...obj,
            ...((await argument(scope)).value as any),
          })
        }

        if (property.kind !== 'init') {
          throw new Error('Only assignment properties are allowed')
        }

        const key = property.computed
          ? this.evaluateIfIdentifier(property.key, true)
          : this.createExpressionForNode(property.key, true)
        const value = this.evaluateIfIdentifier(property.value, true)

        return async (obj: any, scope: any) => {
          obj[(await key(scope)).value as any] = (await value(scope)).value
          return obj
        }
      })

      return Object.assign(
        async (scope: any) => {
          let obj: Record<any, any> = {}
          for (const property of properties) {
            obj = await property(obj, scope)
          }
          return { value: obj }
        },
        { node },
      )
    }

    const properties = node.properties.map(property => {
      if (property.type === 'SpreadElement') {
        const argument = this.evaluateIfIdentifier(property.argument, false)
        return (obj: any, scope: any) => ({
          ...obj,
          ...(argument(scope) as any),
        })
      }

      if (property.kind !== 'init') {
        throw new Error('Only assignment properties are allowed')
      }

      const key = property.computed
        ? this.evaluateIfIdentifier(property.key, false)
        : this.createExpressionForNode(property.key, false)
      const value = this.evaluateIfIdentifier(property.value, false)

      return (obj: any, scope: any) => {
        obj[key(scope) as any] = value(scope)
        return obj
      }
    })
    return Object.assign(
      (scope: any): any => properties.reduce((obj, fn) => fn(obj, scope), {}),
      { node },
    )
  }

  createTaggedTemplateExpression<T extends boolean>(
    node: ESTree.TaggedTemplateExpression,
    async: T,
  ): AsyncIfSpecified<T, ESTree.TaggedTemplateExpression> {
    if (!this.allowTaggedTemplates) {
      throw new Error('Tagged template literals are not allowed')
    }

    const tag = this.evaluateIfIdentifier(node.tag, async)

    const strings: TemplateStringsArray = node.quasi.quasis.reduce<
      string[] & { raw: string[] }
    >(
      (strs, quasi) => {
        strs.push(quasi.value.cooked!)
        strs.raw.push(quasi.value.raw)
        return strs
      },
      Object.assign([], { raw: [] }),
    )

    const expressions = node.quasi.expressions.map(expression =>
      this.evaluateIfIdentifier(expression, async),
    )

    if (async) {
      const evalExpressions = async (scope: any) => {
        const exprs = []
        for (const expression of expressions as AsyncExpression<ESTree.Node>[]) {
          exprs.push((await expression(scope)).value)
        }
        return exprs
      }

      return Object.assign(
        async (scope: any) => ({
          value: (
            (await (tag as AsyncExpression<ESTree.Node>)(scope)).value as any
          )(
            Object.assign(strings.slice(), { raw: strings.raw.slice() }),
            ...(await evalExpressions(scope)),
          ),
        }),
        { node },
      )
    }

    return Object.assign(
      (scope: any) =>
        ((tag as Expression<ESTree.Node>)(scope) as any)(
          Object.assign(strings.slice(), { raw: strings.raw.slice() }),
          ...expressions.map(expr => expr(scope)),
        ),
      { node },
    )
  }

  createTemplateLiteral<T extends boolean>(
    node: ESTree.TemplateLiteral,
    async: T,
  ): AsyncIfSpecified<T, ESTree.TemplateLiteral> {
    if (!this.allowTemplates) {
      throw new Error('Template literals are not allowed')
    }

    if (async) {
      const expressions: ((scope: any) => Promise<string>)[] = []
      for (const element of iterateThroughTemplateLiteral(node)) {
        if (element.type === 'TemplateElement') {
          const str = element.value.cooked!
          expressions.push(async () => str)
        } else {
          const expression = this.evaluateIfIdentifier(element, true)
          expressions.push(
            async (scope: any) => `${(await expression(scope)).value}`,
          )
        }
      }
      return Object.assign(
        async (scope: any) => {
          let str = ''
          for (const expression of expressions) {
            str += await expression(scope)
          }
          return { value: str }
        },
        { node },
      )
    }

    const expressions: ((scope: any) => string)[] = []
    for (const element of iterateThroughTemplateLiteral(node)) {
      if (element.type === 'TemplateElement') {
        const str = element.value.cooked!
        expressions.push(() => str)
      } else {
        const expression = this.evaluateIfIdentifier(element, false)
        expressions.push((scope: any) => `${expression(scope)}`)
      }
    }
    return Object.assign(
      (scope: any): any =>
        expressions.reduce((str, elem) => str + elem(scope), ''),
      { node },
    )
  }

  createUnaryExpression<T extends boolean>(
    node: ESTree.UnaryExpression,
    async: T,
  ): AsyncIfSpecified<T, ESTree.UnaryExpression> {
    const operator = this.operators.unary[node.operator]
    if (!operator) {
      if (!(node.operator in operators.unary)) {
        throw new Error(`Unsupported unary operator: ${node.operator}`)
      }
      throw new Error(`Unary operator ${node.operator} is not allowed`)
    }

    if (async) {
      const argument = this.evaluateIfIdentifier(node.argument, true)

      return Object.assign(
        async (scope: any) => ({
          value: operator((await argument(scope)).value),
        }),
        { node },
      )
    }

    const argument = this.evaluateIfIdentifier(node.argument, false)

    return Object.assign((scope: any) => operator(argument(scope)), { node })
  }
}
