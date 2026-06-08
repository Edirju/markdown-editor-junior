import { type MarkdownExtensionConfig, type DecorationSpec } from './types'
import hljs from 'highlight.js'

const CODE_BLOCK_TYPES = ['FencedCode', 'CodeBlock']

function languageFromAlias(alias: string): string {
  const info = alias.trim().toLowerCase()
  if (!info || info === 'txt' || info === 'text' || info === 'plaintext') return 'plaintext'
  const lang = hljs.getLanguage(info)
  return lang ? lang.name : 'plaintext'
}

function collectHljsTokens(
  root: HTMLElement,
  baseOffset: number,
): DecorationSpec[] {
  const decos: DecorationSpec[] = []
  let offset = 0

  for (const node of root.childNodes) {
    if (node instanceof HTMLElement) {
      const cls = node.className || ''
      const hljsClass = cls.split(' ').find(c => c.startsWith('hljs-'))
      if (hljsClass) {
        const text = node.textContent || ''
        const from = baseOffset + offset
        const to = from + text.length
        decos.push({ from, to, class: hljsClass })
      }
      offset += node.textContent?.length ?? 0
    } else if (node.nodeType === Node.TEXT_NODE) {
      offset += node.textContent?.length ?? 0
    }
  }

  return decos
}

export const codeBlockExtension: MarkdownExtensionConfig = {
  name: 'code-block',
  nodeTypes: CODE_BLOCK_TYPES,
  getDecorations: (node, doc, _cursorLine) => {
    const decos: DecorationSpec[] = []
    const text = doc.toString()

    decos.push({ from: node.from, to: node.to, class: 'cm-md-code-block' })

    let codeText = ''
    let codeTextFrom = 0
    let language = 'plaintext'

    let child = node.firstChild
    while (child) {
      const name = child.type.name
      if (name === 'CodeMark' || name === 'CodeInfo') {
        decos.push({ from: child.from, to: child.to, class: 'cm-md-hide' })
        if (name === 'CodeInfo') {
          language = languageFromAlias(text.slice(child.from, child.to))
        }
      } else if (name === 'CodeText') {
        codeText = text.slice(child.from, child.to)
        codeTextFrom = child.from
        decos.push({ from: child.from, to: child.to, class: 'cm-md-code-text' })
      }
      child = child.nextSibling
    }

    if (codeText && language !== 'plaintext') {
      try {
        const temp = document.createElement('code')
        temp.textContent = codeText
        const result = hljs.highlight(codeText, { language })
        temp.innerHTML = result.value
        const tokens = collectHljsTokens(temp, codeTextFrom)
        decos.push(...tokens)
      } catch {
        // fallback: no syntax highlighting
      }
    }

    return decos
  },
}
