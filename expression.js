const esprima = require('./lib/esprima')
const ASTDelegate = require('./astdelegate')

class Expression {
  constructor(str, options) {
    options = options || {}

    var delegate = new ASTDelegate(options)
    try {
      esprima.parse(str, delegate)
    } catch (err) {
      delegate = err
    }

    this.eval = function () {
      return evaluate(delegate)
    }
  }
}

function evaluate(delegate) {
  if (delegate instanceof Error) {
    throw delegate
  }
  return delegate.expression()
}

module.exports = Expression
