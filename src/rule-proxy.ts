import RuleTree, { AccessPathArray, AccessPathPart } from './rule-tree'

function hasAccess(
  ruleTree: RuleTree,
  explicitAllow: boolean,
  propertyScope: AccessPathArray
) {
  const match = ruleTree.match(propertyScope)
  return explicitAllow
    ? match === true || (typeof match === 'string' && match === 'allow')
    : !(typeof match === 'string' && match === 'block')
}

function getProxyHandler<T extends object>(
  ruleTree: RuleTree,
  explicitAllow: boolean,
  scope: AccessPathArray = []
): ProxyHandler<T> {
  const cache = new Map<AccessPathPart, any>()

  return {
    get(target: T, property: AccessPathPart) {
      if (cache.has(property)) {
        return cache.get(property)
      }

      const propertyScope = scope.concat(property)

      if (!hasAccess(ruleTree, explicitAllow, propertyScope)) {
        cache.set(property, undefined)
        return undefined
      }

      const propValue = (target as any)[property]
      const returnValue =
        (propValue && typeof propValue === 'object') ||
        typeof propValue === 'function'
          ? new Proxy(
              (target as any)[property],
              getProxyHandler(ruleTree, explicitAllow, propertyScope)
            )
          : propValue
      cache.set(property, returnValue)
      return returnValue
    },

    set(_target: T, _property: AccessPathPart, value: any) {
      return value
    },
  }
}

export default function getRuleProxy<T extends object>(
  target: T,
  ruleTree: RuleTree,
  explicitAllow?: boolean
): T {
  return (target && typeof target === 'object') || typeof target === 'function'
    ? new Proxy(target, getProxyHandler(ruleTree, Boolean(explicitAllow)))
    : target
}
