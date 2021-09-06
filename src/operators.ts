export const unary: { [operator: string]: (o: any) => any } = {
  '+': (o: any): number => +o,
  '-': (o: any): number => -o,
  '!': (o: any): boolean => !o,
  '~': (o: any): number => ~o,
  typeof: (o: any): string => typeof o,
}

export const binary: { [operator: string]: (l: any, r: any) => any } = {
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
  '|': (l: any, r: any): number => l | r,
  '^': (l: any, r: any): number => l ^ r,
  '&': (l: any, r: any): number => l & r,
  '<<': (l: any, r: any): number => l << r,
  '>>': (l: any, r: any): number => l >> r,
  '>>>': (l: any, r: any): number => l >>> r,
  in: (l: any, r: any): boolean => l in r,
  instanceof: (l: any, r: any): boolean => l instanceof r,
}

export const logical: {
  [operator: string]: (l: () => any, r: () => any) => any
} = {
  '||': (l: () => any, r: () => any): any => l() || r(),
  '&&': (l: () => any, r: () => any): any => l() && r(),
  '??': (l: () => any, r: () => any): any => l() ?? r(),
}

export default {
  unary,
  binary,
  logical,
}
