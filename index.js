const Expression = require('./expression')

function parseExpression(str, options) {
  return new Expression(str, options)
}

module.exports = {
  parse: parseExpression,
}
