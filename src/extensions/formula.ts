import { type MarkdownExtensionConfig, type DecorationSpec } from './types'

export const formulaExtension: MarkdownExtensionConfig = {
  name: 'formula',
  nodeTypes: [],
  getDecorations: () => null,
}

export function getFormulaDecorations(doc: string): DecorationSpec[] {
  const decos: DecorationSpec[] = []
  // Match inline math: $...$ but not $$...$$
  const formulaRe = /(?<!\$)\$(?!\$)(.+?)(?<!\$)\$(?!\$)/g
  let match: RegExpExecArray | null

  while ((match = formulaRe.exec(doc)) !== null) {
    const fullStart = match.index
    const fullEnd = fullStart + match[0].length
    const contentStart = fullStart + 1
    const contentEnd = fullEnd - 1

    decos.push({ from: fullStart, to: contentStart, class: 'cm-md-hide' })
    decos.push({ from: contentEnd, to: fullEnd, class: 'cm-md-hide' })
    decos.push({ from: contentStart, to: contentEnd, class: 'cm-md-formula' })
  }

  return decos
}
