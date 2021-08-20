import Evaluator from './evaluator'
import getRuleProxy from './rule-proxy'
import RuleTree, { AccessRule } from './rule-tree'

interface JshikiParseOptions {
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

interface JshikiEvaluateOptions extends JshikiParseOptions {
  /**
   * The scope to use when evaluating the expression. The expression will be
   * limited to accessing the properties of the scope.
   */
  scope?: Record<any, any>
}

/**
 * An executable expression.
 */
type JshikiExpression = (
  /**
   * The scope to use when evaluating the expression. The expression will be
   * limited to accessing the properties of the scope.
   */
  scope?: Record<any, any>
) => any

/**
 * Parses an expression into an executable function.
 * @param str The expression to parse.
 * @param options The options to use.
 * @returns The parsed expression.
 * @example
 * const expression = jshiki.parse('(a || 1) + 2')
 * let result = expression()
 * // result => 3
 * result = expression({ a: 5 })
 * // result => 7
 */
export function parse(
  str: string,
  { rules, explicitAllow }: JshikiParseOptions = {}
): JshikiExpression {
  const ruleTree = rules ? new RuleTree(rules) : undefined
  const expression = new Evaluator().createExpression(str)

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
 * let result = jshiki.evaluate('1 + 2')
 * // result => 3
 * result = jshiki.evaluate('a + 2', { scope: { a: 5 } })
 * // result => 7
 */
export function evaluate(str: string, options?: JshikiEvaluateOptions): any {
  return parse(str, options)(options?.scope)
}

export default { parse, evaluate }
