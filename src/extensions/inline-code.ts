import { type MarkdownExtensionConfig, type DecorationSpec } from './types'

const CODE_TYPES = ['InlineCode']

export const inlineCodeExtension: MarkdownExtensionConfig = {
  name: 'inline-code',
  nodeTypes: CODE_TYPES,
  getDecorations: (node, doc, _cursorLine) => {
    if (node.type.name !== 'InlineCode') return null

    const decos: DecorationSpec[] = []
    const text = doc.toString()
    const slice = text.slice(node.from, node.to)

    // Find opening backtick(s) from the start
    let openEnd = 0
    while (openEnd < slice.length && slice[openEnd] === '`') openEnd++

    // Find closing backtick(s) from the end
    let closeStart = slice.length
    while (closeStart > openEnd && slice[closeStart - 1] === '`') closeStart--

    // If we found both opening and closing backticks, apply proper styling
    if (openEnd > 0 && closeStart < slice.length) {
      // Hide opening backticks
      decos.push({ from: node.from, to: node.from + openEnd, class: 'cm-md-hide' })
      // Hide closing backticks
      decos.push({ from: node.from + closeStart, to: node.to, class: 'cm-md-hide' })
      // Style the content as inline code (between the backtick groups)
      decos.push({
        from: node.from + openEnd,
        to: node.from + closeStart,
        class: 'cm-md-inline-code',
      })
    } else {
      // Fallback: style the entire node
      decos.push({ from: node.from, to: node.to, class: 'cm-md-inline-code' })
    }

    return decos
  },
}
