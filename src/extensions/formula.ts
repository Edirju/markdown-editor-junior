import { type MarkdownExtensionConfig, type DecorationSpec } from './types'

export const formulaExtension: MarkdownExtensionConfig = {
  name: 'formula',
  nodeTypes: [],
  getDecorations: () => null,
}

export function getFormulaDecorations(doc: string): DecorationSpec[] {
  const decos: DecorationSpec[] = []
  const formulaRe = /\$(.+?)\$/g
  let match: RegExpExecArray | null

  while ((match = formulaRe.exec(doc)) !== null) {
    const fullStart = match.index
    const fullEnd = fullStart + match[0].length
    const contentStart = fullStart + 1
    const contentEnd = fullEnd - 1

    // Skip $$...$$ (block math)
    if (match[0].startsWith('$$') || match[0].endsWith('$$')) continue
    // Skip if dollar is escaped
    if (fullStart > 0 && doc[fullStart - 1] === '\\') continue

    // Hide $ markers
    decos.push({ from: fullStart, to: contentStart, class: 'cm-md-hide' })
    decos.push({ from: contentEnd, to: fullEnd, class: 'cm-md-hide' })

    // Apply formula style to the whole content
    decos.push({ from: contentStart, to: contentEnd, class: 'cm-md-formula' })

    // Parse subscript (_N) and superscript (^N) within the content
    const content = match[1]
    const contentOffset = contentStart

    const subRe = /_(\d+)/g
    let subMatch: RegExpExecArray | null
    while ((subMatch = subRe.exec(content)) !== null) {
      // Hide the underscore marker
      const markerStart = contentOffset + subMatch.index
      const markerEnd = markerStart + 1
      decos.push({ from: markerStart, to: markerEnd, class: 'cm-md-hide' })
      // Style the digits as subscript
      const numStart = markerEnd
      const numEnd = numStart + subMatch[1].length
      decos.push({ from: numStart, to: numEnd, class: 'cm-md-subscript' })
    }

    const supRe = /\^(\d+)/g
    let supMatch: RegExpExecArray | null
    while ((supMatch = supRe.exec(content)) !== null) {
      // Hide the caret marker
      const markerStart = contentOffset + supMatch.index
      const markerEnd = markerStart + 1
      decos.push({ from: markerStart, to: markerEnd, class: 'cm-md-hide' })
      // Style the digits as superscript
      const numStart = markerEnd
      const numEnd = numStart + supMatch[1].length
      decos.push({ from: numStart, to: numEnd, class: 'cm-md-superscript' })
    }
  }

  return decos
}
