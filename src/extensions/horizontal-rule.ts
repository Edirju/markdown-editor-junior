import { type MarkdownExtensionConfig, type DecorationSpec } from './types'

export const horizontalRuleExtension: MarkdownExtensionConfig = {
  name: 'horizontal-rule',
  nodeTypes: ['HorizontalRule'],
  getDecorations: (node, _doc, _cursorLine) => {
    return [{ from: node.from, to: node.to, class: 'cm-md-horizontal-rule' }]
  },
}
