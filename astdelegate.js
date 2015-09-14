var operators = require('./operators')

function ASTDelegate (options) {
  options = options || {}
  this.scope = options.scope || {}
  this.expression = null
  this.scopeIdentifier = undefined
  this.indexIdentifier = undefined
}

ASTDelegate.prototype = {
  createUnaryExpression: function (op, arg) {
    if (!operators.unary[op]) {
      throw Error('Disallowed operator: ' + op)
    }

    return () => operators.unary[op](arg())
  },

  createBinaryExpression: function (op, left, right) {
    if (!operators.binary[op]) {
      throw Error('Disallowed operator: ' + op)
    }

    return () => operators.binary[op](left(), right())
  },

  createConditionalExpression: function (test, consequent, alternate) {
    return () => test() ? consequent() : alternate()
  },

  createIdentifier: function (name) {
    var self = this
    return options => (options && options.child) ? name : self.scope[name]
  },

  createMemberExpression: function (accessor, object, property) {
    var exp = () => object()[property({ child: true })]
    exp.scope = object()
    return exp
  },

  createCallExpression: function (expression, args) {
    return () => expression().apply(expression.scope, args.map(arg => arg()))
  },

  createLiteral: function (token) {
    return () => token.value
  },

  createArrayExpression: function (elements) {
    return () => {
      var array = []
      for (var i = 0; i < elements.length; i++) {
        array.push(elements[i]())
      }
      return array
    }
  },

  createProperty: function (kind, key, value) {
    return () => ({
      key: key({ child: true }),
      value: value()
    })
  },

  createObjectExpression: function (properties) {
    return () => {
      var object = {}
      for (var i = 0; i < properties.length; i++) {
        object[properties[i]().key] = properties[i]().value
      }
      return object
    }
  },

  createFilter: function (name, args) {
    // TODO (Should filters be supported?)
    throw new Error('Filters are not supported')
  },

  createAsExpression: function (expression, scopeIdentifier) {
    this.expression = expression
    this.scopeIdentifier = scopeIdentifier
  },

  createInExpression: function (scopeIdentifier, indexIdentifier, expression) {
    this.expression = expression
    this.scopeIdentifier = scopeIdentifier
    this.indexIdentifier = indexIdentifier
  },

  createTopLevel: function (expression) {
    this.expression = expression
  },

  createThisExpression: function (expression) {
    // TODO
    throw new Error('`this` is not supported')
  }

}

module.exports = ASTDelegate
