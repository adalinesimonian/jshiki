import ASTDelegate, { ASTDelegateOptions } from './astdelegate'
import esprima from './lib/esprima'
import { Expression } from './lib/esprima/types'

interface JshikiOptions extends ASTDelegateOptions {}

export function parse(str: string, options?: JshikiOptions): Expression {
  const delegate = new ASTDelegate(options)
  return esprima.parse(str, delegate)
}

export function evaluate(str: string, options?: JshikiOptions): any {
  return parse(str, options)()
}

export default { parse, evaluate }
