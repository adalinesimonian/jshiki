export type AccessPathPart = string | symbol
export type AccessPathArray = (string | symbol)[]
/**
 * A path to a property. Can be a string of format `foo.bar.baz` or an array of
 * format `['foo', 'bar', Symbol('baz')]`. '*' can be used as a wildcard. '**'
 * can be used as a wildcard for properties at any depth.
 */
export type AccessPath = string | AccessPathArray
export type AllowAccessRule = {
  /** The path to the property to which access should be allowed. */
  allow: AccessPath
}
export type BlockAccessRule = {
  /** The path to the property to which access should be blocked. */
  block: AccessPath
}
export type AccessRule = AllowAccessRule | BlockAccessRule
type Action = 'allow' | 'block'
type MatchResult = Action | boolean

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
    const [action, normalized]: [Action, AccessPathArray] = isAllowRule(rule)
      ? ['allow', normalizePath(rule.allow)]
      : ['block', normalizePath(rule.block)]
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
   * Checks if the given path has a matching rule. If it does, returns the
   * matching action. If it doesn't, returns a boolean indicating whether or not
   * there is a rule that would allow access to a descendant of the given path.
   * @param path The path to check.
   * @returns If a match is found, the action, either `'allow'` or `'block'`. If
   * no match is found, a boolean indicating whether or not there is a rule that
   * would allow access to a descendant of the given path.
   * @example
   * ```js
   * const ruleTree = new RuleTree([
   *   { allow: 'a.b.c' },
   *   { block: 'x.y.z' },
   * ])
   * let match = ruleTree.match('a.b.c')
   * // match => 'allow'
   * match = ruleTree.match('a.b.d')
   * // match => false
   * match = ruleTree.match('a.b')
   * // match => true
   * match = ruleTree.match('x.y.z')
   * // match => 'block'
   * match = ruleTree.match('x.y.z.alpha')
   * // match => false
   * ```
   */
  match(path: AccessPath): MatchResult {
    const normalized = normalizePath(path)
    if (normalized.length === 0) {
      return false
    }

    let currentNodes = [...this.#rootNodes]
    let nextNodes: [AccessPathPart, RuleTreeNode][] = []
    const actions: Map<
      RuleTreeNode,
      [precedence: number, index: number, action: Action]
    > = new Map()
    let hasAllowDescendant = false

    for (const [index, pathPart] of normalized.entries()) {
      hasAllowDescendant = false

      for (const [nodePathPart, node] of currentNodes) {
        if (nodePathPart === '**') {
          const matchingChild = node.children.get(pathPart)
          const matchingNode = matchingChild ?? node

          if (isActionNode(matchingNode)) {
            actions.set(matchingNode, [
              matchingNode.precedence,
              index,
              matchingNode.action,
            ])
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
        }

        if (
          nodePathPart === '*' ||
          unescapeWildcard(nodePathPart) === pathPart
        ) {
          if (isActionNode(node)) {
            actions.set(node, [node.precedence, index, node.action])
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

    if (actions.size > 0) {
      if (actions.size === 1) {
        const action = actions.values().next().value
        return action[1] === normalized.length - 1
          ? action[2]
          : hasAllowDescendant
      }
      // Pick the action with the highest precedence
      let highestPrecedence = -1
      let highestPrecedenceResult: [number, Action]

      const actionArray = [...actions.values()]

      while (actionArray.length > 0) {
        const [precedence, index, action] = actionArray.pop()!
        if (precedence > highestPrecedence) {
          highestPrecedence = precedence
          highestPrecedenceResult = [index, action]
        }
      }

      const [index, action] = highestPrecedenceResult!

      return index === normalized.length - 1 ? action : hasAllowDescendant
    }

    return hasAllowDescendant
  }
}
