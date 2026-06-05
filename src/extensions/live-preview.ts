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

export const defaultExtensions: MarkdownExtensionConfig[] = [
  headersExtension,
  emphasisExtension,
  taskListsExtension,
  inlineCodeExtension,
  strikethroughExtension,
]

function getDecorations(view: EditorView, extensions: MarkdownExtensionConfig[]): DecorationSet {
  const decos: Range<Decoration>[] = []
  const state = view.state
  const cursorLine = state.doc.lineAt(state.selection.main.head).number
  const docStr = state.doc.toString()

  // 1. Syntax-tree-based extensions
  syntaxTree(state).iterate({
    enter: (nodeRef) => {
      const { node } = nodeRef
      const fromLine = state.doc.lineAt(node.from).number
      const toLine = state.doc.lineAt(Math.max(node.to - 1, node.from)).number

      // Skip cursor line entirely — show raw syntax there
      if (fromLine === cursorLine || toLine === cursorLine) return false

      for (const ext of extensions) {
        if (ext.nodeTypes.includes(node.type.name)) {
          const specs = ext.getDecorations(
            {
              from: node.from,
              to: node.to,
              type: { name: node.type.name },
              firstChild: node.firstChild,
              parent: node.parent,
            },
            state.doc,
            cursorLine,
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
    const fromLine = state.doc.lineAt(spec.from).number
    const toLine = state.doc.lineAt(spec.to).number
    if (fromLine !== cursorLine && toLine !== cursorLine) {
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
