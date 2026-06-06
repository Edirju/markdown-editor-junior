import { type MarkdownExtensionConfig, type DecorationSpec } from './types'

export const highlightExtension: MarkdownExtensionConfig = {
  name: 'highlight',
  nodeTypes: [],
  getDecorations: () => null,
}

export function getHighlightDecorations(doc: string): DecorationSpec[] {
  const decos: DecorationSpec[] = []
  const highlightRe = /==(.+?)==/g
  let match: RegExpExecArray | null

  while ((match = highlightRe.exec(doc)) !== null) {
    const fullStart = match.index
    const fullEnd = fullStart + match[0].length
    const contentStart = fullStart + 2
    const contentEnd = fullEnd - 2

    decos.push({ from: fullStart, to: contentStart, class: 'cm-md-hide' })
    decos.push({ from: contentEnd, to: fullEnd, class: 'cm-md-hide' })
    decos.push({ from: contentStart, to: contentEnd, class: 'cm-md-highlight' })
  }

  return decos
}
