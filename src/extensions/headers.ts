import { type MarkdownExtensionConfig, type DecorationSpec } from './types'

const HEADING_TYPES = [
  'ATXHeading1',
  'ATXHeading2',
  'ATXHeading3',
  'ATXHeading4',
  'ATXHeading5',
  'ATXHeading6',
  'Heading1',
  'Heading2',
  'Heading3',
  'Heading4',
  'Heading5',
  'Heading6',
]

const HEADER_MARK_NAMES = new Set(['HeaderMark'])

export const headersExtension: MarkdownExtensionConfig = {
  name: 'headers',
  nodeTypes: HEADING_TYPES,
  getDecorations: (node, _doc, _cursorLine) => {
    const decos: DecorationSpec[] = []
    const name = node.type.name
    const match = name.match(/(\d+)/)
    if (!match) return null
    const level = match[1]

    let child = node.firstChild
    while (child) {
      if (HEADER_MARK_NAMES.has(child.type.name)) {
        // Hide the # markers
        const len = child.to - child.from
        decos.push({ from: child.from, to: child.to, class: 'cm-md-hide' })
        // Also hide trailing whitespace after the markers
        decos.push({ from: child.to, to: child.to + 1, class: 'cm-md-hide' })
      } else {
        decos.push({ from: child.from, to: child.to, class: `cm-md-header-${level}` })
      }
      child = child.nextSibling
    }

    return decos.length > 0 ? decos : null
  },
}
