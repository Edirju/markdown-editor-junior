import { type DecorationSpec } from './types'

const COMMAND_RE = /\\([a-zA-Z]+)/g
const NUMBER_RE = /\b\d+(?:\.\d+)?\b/g
const DELIM_RE = /[{}[\]()]/g
const SCRIPT_RE = /[_^]/g

function applyLatexTokens(
  text: string,
  baseOffset: number,
  decos: DecorationSpec[],
) {
  let m: RegExpExecArray | null

  COMMAND_RE.lastIndex = 0
  NUMBER_RE.lastIndex = 0
  DELIM_RE.lastIndex = 0
  SCRIPT_RE.lastIndex = 0

  while ((m = COMMAND_RE.exec(text)) !== null) {
    decos.push({ from: baseOffset + m.index, to: baseOffset + m.index + m[0].length, class: 'cm-latex-command' })
  }
  while ((m = NUMBER_RE.exec(text)) !== null) {
    decos.push({ from: baseOffset + m.index, to: baseOffset + m.index + m[0].length, class: 'cm-latex-number' })
  }
  while ((m = DELIM_RE.exec(text)) !== null) {
    decos.push({ from: baseOffset + m.index, to: baseOffset + m.index + 1, class: 'cm-latex-delim' })
  }
  while ((m = SCRIPT_RE.exec(text)) !== null) {
    decos.push({ from: baseOffset + m.index, to: baseOffset + m.index + 1, class: 'cm-latex-script' })
  }
}

export function getMathDecorations(doc: string): DecorationSpec[] {
  const decos: DecorationSpec[] = []

  const displayRe = /\$\$([\s\S]*?)\$\$/g
  let match: RegExpExecArray | null
  while ((match = displayRe.exec(doc)) !== null) {
    if (match[0].length === 4) continue

    const from = match.index
    const to = from + match[0].length
    const dollarLen = 2
    const contentFrom = from + dollarLen
    const contentTo = to - dollarLen

    decos.push({ from, to: contentFrom, class: 'cm-md-hide' })
    decos.push({ from: contentTo, to, class: 'cm-md-hide' })
    decos.push({ from: contentFrom, to: contentTo, class: 'cm-md-math-block' })

    applyLatexTokens(match[1], contentFrom, decos)
  }

  return decos
}
