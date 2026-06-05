import { type MarkdownExtensionConfig, type DecorationSpec } from './types'

const EMPHASIS_TYPES = ['Emphasis', 'StrongEmphasis']
const EMPHASIS_MARK_NAMES = new Set(['EmphasisMark', 'StrongEmphasisMark'])

export const emphasisExtension: MarkdownExtensionConfig = {
  name: 'emphasis',
  nodeTypes: EMPHASIS_TYPES,
  getDecorations: (node, _doc, _cursorLine) => {
    const decos: DecorationSpec[] = []
    const isStrong = node.type.name === 'StrongEmphasis'

    let child = node.firstChild
    while (child) {
      if (EMPHASIS_MARK_NAMES.has(child.type.name)) {
        decos.push({ from: child.from, to: child.to, class: 'cm-md-hide' })
      } else {
        decos.push({
          from: child.from,
          to: child.to,
          class: isStrong ? 'cm-md-strong' : 'cm-md-emphasis',
        })
      }
      child = child.nextSibling
    }

    return decos.length > 0 ? decos : null
  },
}
