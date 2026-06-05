import { type MarkdownExtensionConfig, type DecorationSpec } from './types'

export const wikiLinksExtension: MarkdownExtensionConfig = {
  name: 'wiki-links',
  nodeTypes: [], // Not handled via syntax tree; we scan manually
  getDecorations: () => null,
}

// Wiki-links are not part of standard markdown syntax trees,
// so we use a regex-based approach in the live preview.
export function getWikiLinkDecorations(doc: string): DecorationSpec[] {
  const decos: DecorationSpec[] = []
  const wikiLinkRe = /\[\[([^\]]+)\]\]/g
  let match: RegExpExecArray | null

  while ((match = wikiLinkRe.exec(doc)) !== null) {
    const fullStart = match.index
    const fullEnd = fullStart + match[0].length
    const contentStart = fullStart + 2
    const contentEnd = fullEnd - 2

    // Hide the [[ and ]] markers
    decos.push({ from: fullStart, to: contentStart, class: 'cm-md-hide' })
    decos.push({ from: contentEnd, to: fullEnd, class: 'cm-md-hide' })
    // Style the content as a wiki link
    decos.push({ from: contentStart, to: contentEnd, class: 'cm-md-wiki-link' })
  }

  return decos
}
