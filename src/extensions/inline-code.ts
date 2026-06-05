import { type MarkdownExtensionConfig, type DecorationSpec } from './types'

const CODE_TYPES = ['InlineCode', 'CodeMark', 'CodeText']

export const inlineCodeExtension: MarkdownExtensionConfig = {
  name: 'inline-code',
  nodeTypes: CODE_TYPES,
  getDecorations: (node, _doc, _cursorLine) => {
    const decos: DecorationSpec[] = []

    if (node.type.name === 'InlineCode') {
      let child = node.firstChild
      while (child) {
        if (child.type.name === 'CodeMark' || child.type.name === 'Backtick') {
          decos.push({ from: child.from, to: child.to, class: 'cm-md-hide' })
        } else {
          decos.push({ from: child.from, to: child.to, class: 'cm-md-inline-code' })
        }
        child = child.nextSibling
      }
    }

    return decos.length > 0 ? decos : null
  },
}
