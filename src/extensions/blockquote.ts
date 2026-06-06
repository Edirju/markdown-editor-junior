import { type MarkdownExtensionConfig, type DecorationSpec } from './types'

const BLOCKQUOTE_TYPES = ['Blockquote']
const QUOTE_MARK_NAMES = new Set(['QuoteMark'])

const LEVEL_CLASSES = ['cm-md-blockquote', 'cm-md-blockquote-1', 'cm-md-blockquote-2']

export const blockquoteExtension: MarkdownExtensionConfig = {
  name: 'blockquote',
  nodeTypes: BLOCKQUOTE_TYPES,
  getDecorations: (node, _doc, _cursorLine) => {
    const decos: DecorationSpec[] = []

    function walk(n: { firstChild: any; nextSibling: any; type: { name: string }; from: number; to: number }, depth: number) {
      let child = n.firstChild
      while (child) {
        if (QUOTE_MARK_NAMES.has(child.type.name)) {
          decos.push({ from: child.from, to: child.to, class: 'cm-md-hide' })
          const spaceEnd = child.to + 1
          decos.push({ from: child.to, to: Math.min(spaceEnd, n.to), class: 'cm-md-hide' })
        } else if (child.type.name === 'Blockquote') {
          walk(child, depth + 1)
        } else {
          for (let d = 0; d <= Math.min(depth, LEVEL_CLASSES.length - 1); d++) {
            decos.push({ from: child.from, to: child.to, class: LEVEL_CLASSES[d] })
          }
        }
        child = child.nextSibling
      }
    }

    walk(node, 0)

    return decos.length > 0 ? decos : null
  },
}
