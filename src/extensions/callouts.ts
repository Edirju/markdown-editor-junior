import { type DecorationSpec } from './types'

const CALLOUT_CLASS_MAP: Record<string, string> = {
  note: 'cm-md-callout--note',
  info: 'cm-md-callout--note',
  todo: 'cm-md-callout--todo',
  tip: 'cm-md-callout--tip',
  hint: 'cm-md-callout--tip',
  important: 'cm-md-callout--tip',
  warning: 'cm-md-callout--warning',
  caution: 'cm-md-callout--warning',
  attention: 'cm-md-callout--warning',
  error: 'cm-md-callout--error',
  danger: 'cm-md-callout--error',
  question: 'cm-md-callout--question',
  help: 'cm-md-callout--question',
  success: 'cm-md-callout--success',
  check: 'cm-md-callout--success',
  done: 'cm-md-callout--success',
  quote: 'cm-md-callout--quote',
  cite: 'cm-md-callout--quote',
}

const CALLOUT_TYPE_NAMES = new Set(Object.keys(CALLOUT_CLASS_MAP))

export function isCalloutLine(text: string): boolean {
  return /^> \[!\w+\]/.test(text)
}

export function getCalloutDecorations(doc: string): DecorationSpec[] {
  const decos: DecorationSpec[] = []
  const lines = doc.split('\n')
  let charPos = 0
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const calloutMatch = line.match(/^> \[!(\w+)\](.*)/)

    if (calloutMatch) {
      const type = calloutMatch[1].toLowerCase()
      const typeClass = CALLOUT_CLASS_MAP[type]
      if (!typeClass) {
        charPos += line.length + 1
        i++
        continue
      }

      // Hide "> " prefix and "[!TYPE]" syntax
      const typeEnd = line.indexOf(']')
      const calloutHeaderEnd = typeEnd + 2 // +2 for "]" and the space after it

      decos.push({ from: charPos, to: charPos + calloutHeaderEnd, class: 'cm-md-hide' })

      // Style the title part on the first line
      if (line.length > calloutHeaderEnd) {
        decos.push({
          from: charPos + calloutHeaderEnd,
          to: charPos + line.length,
          class: `cm-md-callout-title ${typeClass}`,
        })
      }

      charPos += line.length + 1
      i++

      // Continuation lines — body content
      while (i < lines.length) {
        const contLine = lines[i]
        if (contLine === '>' || contLine.startsWith('> ')) {
          const prefixLen = contLine === '>' ? 1 : 2
          // Hide ">" or "> " prefix
          decos.push({ from: charPos, to: charPos + prefixLen, class: 'cm-md-hide' })
          if (contLine.length > prefixLen) {
            decos.push({
              from: charPos + prefixLen,
              to: charPos + contLine.length,
              class: `cm-md-callout ${typeClass}`,
            })
          }
          charPos += contLine.length + 1
          i++
        } else {
          break
        }
      }
    } else {
      charPos += line.length + 1
      i++
    }
  }

  return decos
}
