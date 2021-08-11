const operators = require('./operators')

class ASTDelegate {
  constructor(options) {
    options = options || {}
    this.scope = options.scope || {}
    this.expression = null
    this.scopeIdentifier = undefined
    this.indexIdentifier = undefined
  }

  createUnaryExpression(op, arg) {
    if (!operators.unary[op]) {
      throw Error('Disallowed operator: ' + op)
    }

    return () => operators.unary[op](arg())
  }

  createBinaryExpression(op, left, right) {
    if (!operators.binary[op]) {
      throw Error('Disallowed operator: ' + op)
    }

    return () => operators.binary[op](left(), right())
  }

  createConditionalExpression(test, consequent, alternate) {
    return () => (test() ? consequent() : alternate())
  }

  createIdentifier(name) {
    var self = this
    return options => (options && options.child ? name : self.scope[name])
  }

  createMemberExpression(accessor, object, property) {
    var exp = () => object()[property({ child: true })]
    exp.scope = object()
    return exp
  }

  createCallExpression(expression, args) {
    return () =>
      expression().apply(
        expression.scope,
        args.map(arg => arg())
      )
  }

  createLiteral(token) {
    return () => token.value
  }

  createArrayExpression(elements) {
    return () => {
      var array = []
      for (var i = 0; i < elements.length; i++) {
        array.push(elements[i]())
      }
      return array
    }
  }

  createProperty(kind, key, value) {
    return () => ({
      key: key({ child: true }),
      value: value(),
    })
  }

  createObjectExpression(properties) {
    return () => {
      var object = {}
      for (var i = 0; i < properties.length; i++) {
        object[properties[i]().key] = properties[i]().value
      }
      return object
    }
  }

  createFilter(name, args) {
    // TODO (Should filters be supported?)
    throw new Error('Filters are not supported')
  }

  createAsExpression(expression, scopeIdentifier) {
    this.expression = expression
    this.scopeIdentifier = scopeIdentifier
  }

  createInExpression(scopeIdentifier, indexIdentifier, expression) {
    this.expression = expression
    this.scopeIdentifier = scopeIdentifier
    this.indexIdentifier = indexIdentifier
  }

  createTopLevel(expression) {
    this.expression = expression
  }

  createThisExpression(expression) {
    // TODO
    throw new Error('`this` is not supported')
  }
}

module.exports = ASTDelegate
