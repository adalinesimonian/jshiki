export const unary = {
  '+': (v: any): number => +v,
  '-': (v: any): number => -v,
  '!': (v: any): boolean => !v,
  '~': (v: any): number => ~v,
}

export const binary = {
  '+': (l: any, r: any): any => l + r,
  '-': (l: any, r: any): number => l - r,
  '*': (l: any, r: any): number => l * r,
  '**': (l: any, r: any): number => l ** r,
  '/': (l: any, r: any): number => l / r,
  '%': (l: any, r: any): number => l % r,
  '<': (l: any, r: any): boolean => l < r,
  '>': (l: any, r: any): boolean => l > r,
  '<=': (l: any, r: any): boolean => l <= r,
  '>=': (l: any, r: any): boolean => l >= r,
  /* eslint-disable eqeqeq */
  '==': (l: any, r: any): boolean => l == r,
  '!=': (l: any, r: any): boolean => l != r,
  /* eslint-enable eqeqeq */
  '===': (l: any, r: any): boolean => l === r,
  '!==': (l: any, r: any): boolean => l !== r,
  '&&': (l: any, r: any): any => l && r,
  '||': (l: any, r: any): any => l || r,
  '|': (l: any, r: any): number => l | r,
  '^': (l: any, r: any): number => l ^ r,
  '&': (l: any, r: any): number => l & r,
  '<<': (l: any, r: any): number => l << r,
  '>>': (l: any, r: any): number => l >> r,
  '>>>': (l: any, r: any): number => l >>> r,
}

export default {
  unary,
  binary,
}
