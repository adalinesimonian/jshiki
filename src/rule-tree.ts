export type AccessPathPart = string | symbol
export type AccessPathArray = (string | symbol)[]
/**
 * A path to a property. Can be a string of format `foo.bar.baz` or an array of
 * format `['foo', 'bar', Symbol('baz')]`. '*' can be used as a wildcard. '**'
 * can be used as a wildcard for properties at any depth.
 */
export type AccessPath = string | AccessPathArray
type AllowAccessRule = {
  /** The path to the property to which access should be allowed. */
  allow: AccessPath
}
type BlockAccessRule = {
  /** The path to the property to which access should be blocked. */
  block: AccessPath
}
export type AccessRule = AllowAccessRule | BlockAccessRule
type Action = 'allow' | 'block'
type MatchResult = [number, Action] | boolean

function normalizePath(path: AccessPath): AccessPathArray {
  if (typeof path === 'string') {
    return path.split('.')
  }
  if (!Array.isArray(path)) {
    throw new Error(
      `Path must be a string or an array of strings and/or symbols, got ${typeof path}`
    )
  }
  return path.map(part => {
    if (typeof part !== 'symbol' && typeof part !== 'string') {
      throw new Error(
        `Path part must be a string or a symbol, got ${typeof part}`
      )
    }
    return typeof part === 'symbol' ? part : `${part}`
  })
}

type RuleTreeNodeBase = {
  children: Map<AccessPathPart, RuleTreeNode>
  hasAllowDescendant?: boolean
}

type RuleTreeActionNode = RuleTreeNodeBase & {
  children: Map<AccessPathPart, RuleTreeNode>
  action: Action
  precedence: number
}

type RuleTreeNode = RuleTreeNodeBase | RuleTreeActionNode

function isAllowRule(rule: AccessRule): rule is AllowAccessRule {
  return Object.prototype.hasOwnProperty.call(rule, 'allow')
}

function isActionNode(rule: RuleTreeNode): rule is RuleTreeActionNode {
  return Object.prototype.hasOwnProperty.call(rule, 'action')
}

function unescapeWildcard(part: AccessPathPart): AccessPathPart {
  if (typeof part === 'symbol') {
    return part
  }
  if (part === '\\*') {
    return '*'
  }
  if (part === '\\**') {
    return '**'
  }
  return part
}

export default class RuleTree {
  #rootNodes: Map<AccessPathPart, RuleTreeNode> = new Map()
  #nextPrecedence = 0

  constructor(rules?: AccessRule[]) {
    if (rules) {
      for (const rule of rules) {
        this.add(rule)
      }
    }
  }

  add(rule: AccessRule): RuleTree {
    if (!rule) {
      return this
    }
    const [action, path]: [Action, AccessPathArray] = isAllowRule(rule)
      ? ['allow', normalizePath(rule.allow)]
      : ['block', normalizePath(rule.block)]
    const normalized = normalizePath(path)
    if (normalized.length === 0) {
      return this
    }
    let nodeMap = this.#rootNodes
    const precedence = this.#nextPrecedence++
    for (const [index, path] of normalized.entries()) {
      const isLastPart = index === normalized.length - 1
      const existing = nodeMap.get(path)
      if (!existing) {
        if (isLastPart) {
          nodeMap.set(path, {
            children: new Map(),
            action,
            precedence,
          })
          break
        }
        const newNodeMap = new Map()
        nodeMap.set(path, {
          children: newNodeMap,
        })
        nodeMap = newNodeMap
        continue
      }
      if (isLastPart) {
        const existingActionNode = existing as RuleTreeActionNode
        existingActionNode.action = action
        existingActionNode.precedence = precedence
        if (action === 'block') {
          existing.children.clear()
        }
        break
      }
      nodeMap = existing.children
    }
    for (const rootNode of this.#rootNodes.values()) {
      this.#updateHasAllowDescendant(rootNode)
    }
    return this
  }

  #updateHasAllowDescendant(node: RuleTreeNode): void {
    let hasAllowDescendant = false
    for (const [, child] of node.children) {
      this.#updateHasAllowDescendant(child)
      if (
        child.hasAllowDescendant ||
        (child as RuleTreeActionNode).action === 'allow'
      ) {
        hasAllowDescendant = true
      }
    }
    node.hasAllowDescendant = hasAllowDescendant
  }

  /**
   * Checks if the given path has a matching rule. If it does, returns the index
   * of the property in the given path along with the matching action. If it
   * doesn't, returns a boolean indicating whether or not there is a rule that
   * would allow access to a descendant of the given path.
   * @param path The path to check.
   * @returns If a match is found, a tuple with the first element being the
   * index of the matching property in the path and the second element being the
   * action. If no match is found, a boolean indicating whether or not there is
   * a rule that would allow access to a descendant of the given path.
   * @example
   * const ruleTree = new RuleTree([
   *   { allow: 'a.b.c' },
   * ])
   * let match = ruleTree.match('a.b.c')
   * // match => [2, 'allow']
   * match = ruleTree.match('a.b.d')
   * // match => false
   * match = ruleTree.match('a.b')
   * // match => true
   */
  match(path: AccessPath): MatchResult {
    const normalized = normalizePath(path)
    if (normalized.length === 0) {
      return false
    }

    let currentNodes = [...this.#rootNodes]
    let nextNodes: [AccessPathPart, RuleTreeNode][] = []
    const actions: [precedence: number, index: number, action: Action][] = []
    let hasAllowDescendant = false

    for (const [index, pathPart] of normalized.entries()) {
      hasAllowDescendant = false

      for (const [nodePathPart, node] of currentNodes) {
        if (nodePathPart === '**') {
          const matchingChild = node.children.get(pathPart)
          const matchingNode = matchingChild ?? node

          if (isActionNode(matchingNode)) {
            actions.push([matchingNode.precedence, index, matchingNode.action])
          }

          if (matchingChild) {
            if (matchingChild.hasAllowDescendant) {
              hasAllowDescendant = true
            }

            for (const child of matchingChild.children) {
              nextNodes.push(child)
            }
          } else {
            nextNodes.push([nodePathPart, node])

            if (node.hasAllowDescendant) {
              hasAllowDescendant = true
            }
          }
          continue
        }

        if (
          nodePathPart === '*' ||
          unescapeWildcard(nodePathPart) === pathPart
        ) {
          if (isActionNode(node)) {
            actions.push([node.precedence, index, node.action])
          }
          if (node.hasAllowDescendant) {
            hasAllowDescendant = true
          }
          for (const child of node.children) {
            nextNodes.push(child)
          }
        }
      }

      if (nextNodes.length === 0) {
        break
      }

      currentNodes = nextNodes
      nextNodes = []
    }

    if (actions.length > 0) {
      if (actions.length === 1) {
        return [actions[0][1], actions[0][2]]
      }
      // Pick the action with the highest precedence
      let highestPrecedence = -1
      let highestPrecedenceResult: [number, Action]

      for (const [precedence, index, action] of actions) {
        if (precedence > highestPrecedence) {
          highestPrecedence = precedence
          highestPrecedenceResult = [index, action]
        }
      }

      return highestPrecedenceResult!
    }

    return hasAllowDescendant
  }
}
