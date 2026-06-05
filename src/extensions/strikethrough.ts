import { type MarkdownExtensionConfig, type DecorationSpec } from './types'

const STRIKETHROUGH_TYPES = ['Strikethrough', 'StrikeFormat']
const STRIKETHROUGH_MARK_NAMES = new Set(['StrikethroughMark', 'StrikeFormatMark'])

export const strikethroughExtension: MarkdownExtensionConfig = {
  name: 'strikethrough',
  nodeTypes: STRIKETHROUGH_TYPES,
  getDecorations: (node, _doc, _cursorLine) => {
    const decos: DecorationSpec[] = []

    let child = node.firstChild
    while (child) {
      if (STRIKETHROUGH_MARK_NAMES.has(child.type.name)) {
        decos.push({ from: child.from, to: child.to, class: 'cm-md-hide' })
      } else {
        decos.push({ from: child.from, to: child.to, class: 'cm-md-strikethrough' })
      }
      child = child.nextSibling
    }

    return decos.length > 0 ? decos : null
  },
}
