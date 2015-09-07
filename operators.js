exports.unary = {
  '+': function (v) { return +v },
  '-': function (v) { return -v },
  '!': function (v) { return !v }
}

exports.binary = {
  '+': function (l, r) { return l + r },
  '-': function (l, r) { return l - r },
  '*': function (l, r) { return l * r },
  '/': function (l, r) { return l / r },
  '%': function (l, r) { return l % r },
  '<': function (l, r) { return l < r },
  '>': function (l, r) { return l > r },
  '<=': function (l, r) { return l <= r },
  '>=': function (l, r) { return l >= r },
  /* eslint-disable eqeqeq */
  '==': function (l, r) { return l == r },
  '!=': function (l, r) { return l != r },
  /* eslint-enable eqeqeq */
  '===': function (l, r) { return l === r },
  '!==': function (l, r) { return l !== r },
  '&&': function (l, r) { return l && r },
  '||': function (l, r) { return l || r }
}
