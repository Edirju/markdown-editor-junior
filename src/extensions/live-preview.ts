import { Decoration, type DecorationSet, ViewPlugin, type PluginValue, type ViewUpdate, type EditorView } from '@codemirror/view'
import { syntaxTree } from '@codemirror/language'
import { type Range } from '@codemirror/state'
import { type MarkdownExtensionConfig } from './types'
import { headersExtension } from './headers'
import { emphasisExtension } from './emphasis'
import { taskListsExtension } from './task-lists'
import { wikiLinksExtension, getWikiLinkDecorations } from './wiki-links'
import { inlineCodeExtension } from './inline-code'
import { strikethroughExtension } from './strikethrough'
import { highlightExtension, getHighlightDecorations } from './highlight'
import { formulaExtension, getFormulaDecorations } from './formula'
import { getMathDecorations } from './math-block'
import { getCalloutDecorations, isCalloutLine } from './callouts'
import { blockquoteExtension } from './blockquote'
import { horizontalRuleExtension } from './horizontal-rule'
import { codeBlockExtension } from './code-block'

export const defaultExtensions: MarkdownExtensionConfig[] = [
  headersExtension,
  emphasisExtension,
  taskListsExtension,
  inlineCodeExtension,
  strikethroughExtension,
  highlightExtension,
  formulaExtension,
  blockquoteExtension,
  horizontalRuleExtension,
  codeBlockExtension,
]

function cursorInsideNode(state: { selection: { main: { head: number } } }, from: number, to: number): boolean {
  const cursorPos = state.selection.main.head
  return cursorPos >= from && cursorPos <= to
}

function getDecorations(view: EditorView, extensions: MarkdownExtensionConfig[]): DecorationSet {
  const decos: Range<Decoration>[] = []
  const state = view.state
  const docStr = state.doc.toString()

  // 1. Syntax-tree-based extensions
  syntaxTree(state).iterate({
    enter: (nodeRef) => {
      const { node } = nodeRef

      // Callouts use ">" syntax but are visually independent from blockquotes
      const isCallout = node.type.name === 'Blockquote' && isCalloutLine(state.doc.sliceString(node.from, node.from + 20))

      for (const ext of extensions) {
        if (ext.nodeTypes.includes(node.type.name)) {
          // Skip blockquote extension for callout blocks
          if (isCallout && ext.name === 'blockquote') continue

          // Show raw syntax only for this specific formatting node
          if (cursorInsideNode(state, node.from, node.to)) return false

          const specs = ext.getDecorations(
            {
              from: node.from,
              to: node.to,
              type: { name: node.type.name },
              firstChild: node.firstChild,
              parent: node.parent,
            },
            state.doc,
            state.doc.lineAt(state.selection.main.head).number,
          )

          if (specs) {
            for (const spec of specs) {
              decos.push(Decoration.mark({ class: spec.class }).range(spec.from, spec.to))
            }
            return false
          }
        }
      }
      return true
    },
  })

  // 2. Wiki-links — handled via regex since not in standard syntax tree
  const wikiDecos = getWikiLinkDecorations(docStr)
  for (const spec of wikiDecos) {
    if (!cursorInsideNode(state, spec.from, spec.to)) {
      decos.push(Decoration.mark({ class: spec.class }).range(spec.from, spec.to))
    }
  }

  // 3. Formulas ($...$) — handled via regex
  const formulaDecos = getFormulaDecorations(docStr)
  for (const spec of formulaDecos) {
    if (!cursorInsideNode(state, spec.from, spec.to)) {
      decos.push(Decoration.mark({ class: spec.class }).range(spec.from, spec.to))
    }
  }

  // 4. Highlight (==...==) — handled via regex
  const highlightDecos = getHighlightDecorations(docStr)
  for (const spec of highlightDecos) {
    if (!cursorInsideNode(state, spec.from, spec.to)) {
      decos.push(Decoration.mark({ class: spec.class }).range(spec.from, spec.to))
    }
  }

  // 5. Display math blocks ($$...$$) — handled via regex
  const mathDecos = getMathDecorations(docStr)
  for (const spec of mathDecos) {
    if (!cursorInsideNode(state, spec.from, spec.to)) {
      decos.push(Decoration.mark({ class: spec.class }).range(spec.from, spec.to))
    }
  }

  // 6. Callouts (> [!TYPE] ...) — handled via regex
  const calloutDecos = getCalloutDecorations(docStr)
  for (const spec of calloutDecos) {
    if (!cursorInsideNode(state, spec.from, spec.to)) {
      decos.push(Decoration.mark({ class: spec.class }).range(spec.from, spec.to))
    }
  }

  return Decoration.set(decos, true)
}

export function livePreview(extensions: MarkdownExtensionConfig[] = defaultExtensions) {
  return ViewPlugin.fromClass(
    class implements PluginValue {
      decorations: DecorationSet

      constructor(view: EditorView) {
        this.decorations = getDecorations(view, extensions)
      }

      update(update: ViewUpdate) {
        if (update.docChanged || update.selectionSet || update.viewportChanged) {
          this.decorations = getDecorations(update.view, extensions)
        }
      }
    },
    { decorations: (v) => v.decorations },
  )
}
