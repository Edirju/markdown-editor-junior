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

export const headersExtension: MarkdownExtensionConfig = {
  name: 'headers',
  nodeTypes: HEADING_TYPES,
  getDecorations: (node, doc, _cursorLine) => {
    const name = node.type.name
    const match = name.match(/(\d+)/)
    if (!match) return null
    const level = match[1]
    const text = doc.toString()
    const slice = text.slice(node.from, node.to)

    // Find where the # markers end
    let markerEnd = 0
    while (markerEnd < slice.length && slice[markerEnd] === '#') markerEnd++

    // Skip the space after markers if present
    const contentStart = markerEnd + (slice[markerEnd] === ' ' ? 1 : 0)

    const decos: DecorationSpec[] = []

    // Hide markers and the trailing space
    decos.push({ from: node.from, to: node.from + contentStart, class: 'cm-md-hide' })

    // Apply heading style to the content
    decos.push({ from: node.from + contentStart, to: node.to, class: `cm-md-header-${level}` })

    return decos
  },
}
