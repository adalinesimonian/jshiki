var esprima = require('./lib/esprima')
var ASTDelegate = require('./astdelegate')

function Expression (str, options) {
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

function evaluate (delegate) {
  if (delegate instanceof Error) {
    throw delegate
  }
  return delegate.expression()
}

module.exports = Expression
