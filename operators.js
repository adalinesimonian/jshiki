exports.unary = {
  '+': v => +v,
  '-': v => -v,
  '!': v => !v,
  '~': v => ~v
}

exports.binary = {
  '+': (l, r) => l + r,
  '-': (l, r) => l - r,
  '*': (l, r) => l * r,
  '**': (l, r) => l ** r,
  '/': (l, r) => l / r,
  '%': (l, r) => l % r,
  '<': (l, r) => l < r,
  '>': (l, r) => l > r,
  '<=': (l, r) => l <= r,
  '>=': (l, r) => l >= r,
  /* eslint-disable eqeqeq */
  '==': (l, r) => l == r,
  '!=': (l, r) => l != r,
  /* eslint-enable eqeqeq */
  '===': (l, r) => l === r,
  '!==': (l, r) => l !== r,
  '&&': (l, r) => l && r,
  '||': (l, r) => l || r,
  '|': (l, r) => l | r,
  '^': (l, r) => l ^ r,
  '&': (l, r) => l & r,
  '<<': (l, r) => l << r,
  '>>': (l, r) => l >> r,
  '>>>': (l, r) => l >>> r
}
