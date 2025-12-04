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

  '==': (l: any, r: any): boolean => l == r,
  '!=': (l: any, r: any): boolean => l != r,

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
  [operator: string]: {
    (l: () => any, r: () => any): any
    async: (
      l: () => Promise<{ value: any }>,
      r: () => Promise<{ value: any }>,
    ) => Promise<{ result: any }>
  }
} = {
  '||': Object.assign((l: () => any, r: () => any): any => l() || r(), {
    async: async (
      l: () => Promise<{ value: any }>,
      r: () => Promise<{ value: any }>,
    ) => ({ result: (await l()).value || (await r()).value }),
  }),
  '&&': Object.assign((l: () => any, r: () => any): any => l() && r(), {
    async: async (
      l: () => Promise<{ value: any }>,
      r: () => Promise<{ value: any }>,
    ) => ({ result: (await l()).value && (await r()).value }),
  }),
  '??': Object.assign((l: () => any, r: () => any): any => l() ?? r(), {
    async: async (
      l: () => Promise<{ value: any }>,
      r: () => Promise<{ value: any }>,
    ) => ({ result: (await l()).value ?? (await r()).value }),
  }),
}

export default {
  unary,
  binary,
  logical,
}
