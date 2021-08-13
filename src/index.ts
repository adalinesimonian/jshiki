import ASTDelegate, { ASTDelegateOptions } from './astdelegate'
import esprima from './lib/esprima'
import { Expression } from './lib/esprima/types'

interface JshikiOptions extends ASTDelegateOptions {}

/**
 * Parses an expression into an executable function.
 * @param str The expression to parse.
 * @param options The options to use.
 * @returns The parsed expression.
 * @example
 * const expression = jshiki.parse('1 + 2')
 * const result = expression()
 * // result => 3
 */
export function parse(str: string, options?: JshikiOptions): Expression {
  const delegate = new ASTDelegate(options)
  return esprima.parse(str, delegate)
}

/**
 * Evaluates an expression.
 * @param str The expression to evaluate.
 * @param options The options to use.
 * @returns The result of the expression.
 * @example
 * const result = jshiki.evaluate('1 + 2')
 * // result => 3
 */
export function evaluate(str: string, options?: JshikiOptions): any {
  return parse(str, options)()
}

export default { parse, evaluate }
