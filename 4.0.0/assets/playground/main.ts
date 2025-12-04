import { EditorState, Extension } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { basicSetup } from 'codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { json } from '@codemirror/lang-json'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags } from '@lezer/highlight'
import hljs from 'highlight.js/lib/core'
import javascriptHighlight from 'highlight.js/lib/languages/javascript'
import jsonHighlight from 'highlight.js/lib/languages/json'
import { parse } from '../../../src/index.ts'

const defaultExpression = "`Hello! My name's ${name}`"
const defaultContext = JSON.stringify(
  {
    name: 'Azumi',
    role: 'Navigator',
    favorites: {
      beverage: 'matcha latte',
      language: 'TypeScript',
    },
  },
  null,
  2,
)

hljs.registerLanguage('javascript', javascriptHighlight)
hljs.registerLanguage('json', jsonHighlight)

const playgroundHighlightStyle = HighlightStyle.define([
  {
    tag: [
      tags.keyword,
      tags.controlKeyword,
      tags.definitionKeyword,
      tags.operatorKeyword,
    ],
    color: 'var(--playground-token-keyword)',
  },
  {
    tag: [
      tags.operator,
      tags.compareOperator,
      tags.logicOperator,
      tags.arithmeticOperator,
    ],
    color: 'var(--playground-token-operator)',
  },
  {
    tag: [tags.string, tags.special(tags.string), tags.character],
    color: 'var(--playground-token-string)',
  },
  {
    tag: [
      tags.number,
      tags.integer,
      tags.float,
      tags.literal,
      tags.bool,
      tags.atom,
    ],
    color: 'var(--playground-token-number)',
  },
  {
    tag: [tags.comment, tags.lineComment, tags.blockComment],
    color: 'var(--playground-token-comment)',
    fontStyle: 'italic',
  },
])
const playgroundSyntaxTheme = syntaxHighlighting(playgroundHighlightStyle)

type HighlightLanguage = 'javascript' | 'json'

type PlaygroundElements = {
  root: HTMLElement
  expressionMount: HTMLElement
  contextMount: HTMLElement
  resultNode: HTMLElement
  snippetNode: HTMLElement
}

type PlaygroundEditors = {
  expressionEditor: EditorView
  contextEditor: EditorView
}

type PlaygroundContext = PlaygroundElements & PlaygroundEditors

const highlightCode = (code: string, language: HighlightLanguage): string => {
  try {
    return hljs.highlight(code, { language }).value
  } catch {
    return hljs.highlightAuto(code).value
  }
}

const renderHighlighted = (
  node: HTMLElement,
  code: string,
  language: HighlightLanguage,
): void => {
  node.innerHTML = highlightCode(code, language)
  node.classList.remove('language-javascript', 'language-json')
  node.classList.add('hljs', `language-${language}`)
}

const renderError = (node: HTMLElement, message: string): void => {
  node.textContent = message
  node.classList.remove('hljs', 'language-javascript', 'language-json')
}

const formatSnippet = (
  expressionSource: string,
  scopeSource: string,
): string => {
  const expressionLine = `const expressionSource = ${JSON.stringify(expressionSource)}`
  const contextLine = `const context = ${scopeSource.trim() || '{}'}`
  return [
    'import * as jshiki from "jshiki"',
    expressionLine,
    'const expression = jshiki.parse(expressionSource)',
    contextLine,
    'expression(context)',
  ].join('\n')
}

const formatResult = (
  value: unknown,
): { code: string; language: HighlightLanguage } => {
  if (value === undefined) {
    return { code: 'undefined', language: 'javascript' }
  }

  if (typeof value === 'string') {
    return { code: JSON.stringify(value), language: 'javascript' }
  }

  try {
    return { code: JSON.stringify(value, null, 2), language: 'json' }
  } catch {
    return { code: String(value), language: 'javascript' }
  }
}

const parseScope = (scopeText: string): Record<string, unknown> => {
  const trimmed = scopeText.trim()
  if (!trimmed) {
    return {}
  }

  return JSON.parse(trimmed)
}

const getExpressionSource = (context: PlaygroundContext): string => {
  return context.expressionEditor.state.doc.toString()
}

const getContextSource = (context: PlaygroundContext): string => {
  return context.contextEditor.state.doc.toString()
}

const updateSnippet = (context: PlaygroundContext): void => {
  const snippet = formatSnippet(
    getExpressionSource(context),
    getContextSource(context),
  )
  renderHighlighted(context.snippetNode, snippet, 'javascript')
}

const runEvaluation = (context: PlaygroundContext): void => {
  try {
    const scope = parseScope(getContextSource(context))
    const expression = parse(getExpressionSource(context))
    const result = expression(scope)
    const formatted = formatResult(result)
    renderHighlighted(context.resultNode, formatted.code, formatted.language)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    renderError(context.resultNode, message)
  }
}

const createEditor = (
  mount: HTMLElement,
  initialDoc: string,
  languageExtension: Extension,
  onEvaluate: () => void,
): EditorView => {
  return new EditorView({
    parent: mount,
    state: EditorState.create({
      doc: initialDoc,
      extensions: [
        basicSetup,
        EditorView.lineWrapping,
        playgroundSyntaxTheme,
        languageExtension,
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            onEvaluate()
          }
        }),
        keymap.of([
          {
            key: 'Mod-Enter',
            preventDefault: true,
            run: () => {
              onEvaluate()
              return true
            },
          },
        ]),
      ],
    }),
  })
}

const createEditors = (
  elements: PlaygroundElements,
  onEvaluate: () => void,
): PlaygroundEditors => {
  const expressionEditor = createEditor(
    elements.expressionMount,
    defaultExpression,
    javascript(),
    onEvaluate,
  )
  const contextEditor = createEditor(
    elements.contextMount,
    defaultContext,
    json(),
    onEvaluate,
  )

  return { expressionEditor, contextEditor }
}

const buildElements = (): PlaygroundElements | null => {
  const root = document.querySelector<HTMLElement>('[data-playground-root]')
  if (!root) {
    return null
  }

  const expressionMount = root.querySelector<HTMLElement>(
    '[data-playground="expression"]',
  )
  const contextMount = root.querySelector<HTMLElement>(
    '[data-playground="context"]',
  )
  const resultNode = root.querySelector<HTMLElement>(
    '[data-playground="result"]',
  )
  const snippetNode = root.querySelector<HTMLElement>(
    '[data-playground="snippet"]',
  )

  if (!expressionMount || !contextMount || !resultNode || !snippetNode) {
    return null
  }

  return {
    root,
    expressionMount,
    contextMount,
    resultNode,
    snippetNode,
  }
}

const init = (): void => {
  const elements = buildElements()
  if (!elements) {
    return
  }

  let playground: PlaygroundContext | null = null

  const evaluate = (): void => {
    if (!playground) {
      return
    }
    updateSnippet(playground)
    runEvaluation(playground)
  }

  const editors = createEditors(elements, evaluate)

  playground = { ...elements, ...editors }

  evaluate()
}

document.addEventListener('DOMContentLoaded', init)
