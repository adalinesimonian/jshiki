import Evaluator, {
  UnaryOperatorOptions,
  BinaryOperatorOptions,
  LogicalOperatorOptions,
  OperatorOptions,
  EvaluatorOptions,
} from './evaluator'
import getRuleProxy from './rule-proxy'
import RuleTree, {
  AccessPath,
  AccessRule,
  AllowAccessRule,
  BlockAccessRule,
} from './rule-tree'

export {
  AccessPath,
  AccessRule,
  AllowAccessRule,
  BlockAccessRule,
  UnaryOperatorOptions,
  BinaryOperatorOptions,
  LogicalOperatorOptions,
  OperatorOptions,
}

/**
 * Options for parsing.
 */
export interface JshikiParseOptions extends EvaluatorOptions {
  /**
   * Access rules to use when determining what properties can be accessed by the
   * expression. The rules are evaluated in order.
   * @example
   * ```js
   * const options = {
   *   rules: [
   *     { allow: 'foo.bar' },
   *     { block: ['baz', 'qux'] },
   *   ]
   * }
   * const obj = {
   *   foo: { bar: 'baz' },
   *   baz: { qux: 'quux' },
   * }
   * let expr = jshiki.parse('foo.bar', options)
   * expr(obj) // => 'baz'
   *
   * expr = jshiki.parse('baz.qux', options)
   * expr(obj) // => undefined
   * ```
   */
  rules?: AccessRule[]
  /**
   * If true, only properties with a matching allow rule can be accessed by the
   * expression. If false, all properties can be accessed unless they have a
   * block rule. Defaults to false.
   * @default false
   * @example
   * ```js
   * const options = {
   *   explicitAllow: true,
   *   rules: [{ allow: 'foo.bar' }]
   * }
   * const obj = {
   *   foo: { bar: 'baz' },
   *   baz: { qux: 'quux' },
   * }
   * let expr = jshiki.parse('foo.bar', options)
   * expr(obj) // => 'baz'
   *
   * let expr = jshiki.parse('baz', options)
   * expr(obj) // => undefined
   * ```
   */
  explicitAllow?: boolean
}

/**
 * Options for evaluating.
 */
export interface JshikiEvaluateOptions extends JshikiParseOptions {
  /**
   * The scope to use when evaluating the expression. The expression will be
   * limited to accessing the properties of the scope.
   * @example
   * ```js
   * const options = {
   *   scope: {
   *     foo: 'bar',
   *     baz: {
   *       qux: 'quux',
   *     }
   *   }
   * }
   * jshiki.evaluate('foo', options) // => 'bar'
   * jshiki.evaluate('baz.qux', options) // => 'quux'
   * ```
   */
  scope?: Record<any, any>
}

/**
 * A compiled, executable expression.
 *
 * ```js
 * const expression = jshiki.parse('foo.bar')
 * expression({
 *   foo: { bar: 'baz' },
 * }) // => 'baz'
 * ```
 * @param scope The scope to use when evaluating the expression. The expression
 * will be limited to accessing the properties of the scope.
 */
export type JshikiExpression = (scope?: Record<any, any>) => any

/**
 * Parses an expression into an executable function.
 * @param str The expression to parse.
 * @param options The options to use.
 * @returns The parsed expression.
 * @example
 * ```js
 * const expression = jshiki.parse('(a || 1) + 2')
 * let result = expression()
 * // result => 3
 * result = expression({ a: 5 })
 * // result => 7
 * ```
 */
export function parse(
  str: string,
  { rules, explicitAllow, operators, expressions }: JshikiParseOptions = {}
): JshikiExpression {
  const ruleTree = rules ? new RuleTree(rules) : undefined
  const expression = new Evaluator({ operators, expressions }).createExpression(
    str
  )

  return (scope: Record<any, any> = {}) => {
    const proxiedScope = ruleTree
      ? getRuleProxy(scope, ruleTree, Boolean(explicitAllow))
      : scope
    return expression(proxiedScope)
  }
}

/**
 * Evaluates an expression.
 * @param str The expression to evaluate.
 * @param options The options to use.
 * @returns The result of the expression.
 * @example
 * ```js
 * let result = jshiki.evaluate('1 + 2')
 * // result => 3
 * result = jshiki.evaluate('a + 2', { scope: { a: 5 } })
 * // result => 7
 * ```
 */
export function evaluate(str: string, options?: JshikiEvaluateOptions): any {
  return parse(str, options)(options?.scope)
}

export default { parse, evaluate }
