import { getEditorView } from './editor-ref'

type SyntaxPair = [string, string]
type LineType = 'bullet' | 'numbered' | 'task' | 'blockquote'

interface LineInfo {
  type: LineType
  level: number
  content: string
  prefixLen: number
}

function getLineInfo(text: string): LineInfo | null {
  const trimmed = text.trimStart()
  const indentLen = text.length - trimmed.length

  const bqMatch = trimmed.match(/^(>+)(\s*)/)
  if (bqMatch) {
    return {
      type: 'blockquote',
      level: bqMatch[1].length - 1,
      content: trimmed.slice(bqMatch[0].length),
      prefixLen: indentLen + bqMatch[0].length,
    }
  }

  const level = Math.floor(indentLen / 2)

  const taskMatch = trimmed.match(/^([-*])\s+\[[ x]\]\s+/)
  if (taskMatch) {
    return {
      type: 'task',
      level,
      content: trimmed.slice(taskMatch[0].length),
      prefixLen: indentLen + taskMatch[0].length,
    }
  }

  const numMatch = trimmed.match(/^(\d+)\.\s+/)
  if (numMatch) {
    return {
      type: 'numbered',
      level,
      content: trimmed.slice(numMatch[0].length),
      prefixLen: indentLen + numMatch[0].length,
    }
  }

  const bulletMatch = trimmed.match(/^([-*+])\s+/)
  if (bulletMatch) {
    return {
      type: 'bullet',
      level,
      content: trimmed.slice(bulletMatch[0].length),
      prefixLen: indentLen + bulletMatch[0].length,
    }
  }

  return null
}

function getContinuationPrefix(text: string, info: LineInfo): string {
  const indent = '  '.repeat(info.level)

  if (info.type === 'blockquote') {
    return '>'.repeat(info.level + 1) + ' '
  }

  if (info.type === 'task') {
    return indent + text.trimStart()[0] + ' [ ] '
  }

  if (info.type === 'numbered') {
    const numMatch = text.trimStart().match(/^(\d+)\./)
    const nextNum = numMatch ? parseInt(numMatch[1], 10) + 1 : 1
    return indent + nextNum + '. '
  }

  return indent + text.trimStart()[0] + ' '
}

function wrapRange(before: SyntaxPair | string, after?: string): void {
  const view = getEditorView()
  if (!view) return

  const pair: SyntaxPair = Array.isArray(before) ? before : [before, after ?? before]
  const [open, close] = pair
  const { from, to } = view.state.selection.main
  const selected = view.state.sliceDoc(from, to)
  const hasSelection = from !== to

  if (hasSelection) {
    // Check if already wrapped — toggle off
    if (selected.startsWith(open) && selected.endsWith(close)) {
      view.dispatch({
        changes: { from, to, insert: selected.slice(open.length, -close.length) },
        selection: { anchor: from },
      })
      return
    }

    view.dispatch({
      changes: { from, to, insert: open + selected + close },
      selection: { anchor: from + open.length, head: to + open.length },
    })
  } else {
    view.dispatch({
      changes: { from, to, insert: open + close },
      selection: { anchor: from + open.length },
    })
  }
}

function insertAtLineStart(prefix: string): void {
  const view = getEditorView()
  if (!view) return

  const { from } = view.state.selection.main
  const line = view.state.doc.lineAt(from)
  const lineText = view.state.sliceDoc(line.from, line.to)

  const trimmed = lineText.trimStart()
  const indent = lineText.length - trimmed.length

  // If line already has this prefix, remove it (toggle)
  if (trimmed.startsWith(prefix)) {
    view.dispatch({
      changes: {
        from: line.from + indent,
        to: line.to,
        insert: trimmed.slice(prefix.length),
      },
      selection: { anchor: line.from + indent + trimmed.slice(prefix.length).length },
    })
    return
  }

  view.dispatch({
    changes: {
      from: line.from + indent,
      to: line.from + indent,
      insert: prefix,
    },
    selection: { anchor: from + prefix.length },
  })
}

function insertBlock(open: string, close: string): void {
  const view = getEditorView()
  if (!view) return

  const { from, to } = view.state.selection.main
  const selected = view.state.sliceDoc(from, to)
  const hasSelection = from !== to

  if (hasSelection) {
    view.dispatch({
      changes: { from, to, insert: open + '\n' + selected + '\n' + close },
      selection: { anchor: from + open.length + 1 },
    })
  } else {
    const cursor = from
    view.dispatch({
      changes: { from: cursor, to: cursor, insert: open + '\n\n' + close },
      selection: { anchor: cursor + open.length + 1 },
    })
  }
}

// ── Tab / Enter list handlers ──

export function indentLine(): boolean {
  const view = getEditorView()
  if (!view) return false

  const sel = view.state.selection.main
  if (!sel.empty) return false

  const line = view.state.doc.lineAt(sel.head)
  const info = getLineInfo(line.text)
  if (!info) return false

  if (info.type === 'blockquote') {
    if (info.level >= 2) return true
    const trimmed = line.text.trimStart()
    const wsLen = line.text.length - trimmed.length
    const markersEnd = line.from + wsLen + info.level + 1
    view.dispatch({
      changes: { from: markersEnd, to: markersEnd, insert: '>' },
      selection: { anchor: sel.head + 1 },
    })
    return true
  }

  view.dispatch({
    changes: { from: line.from, to: line.from, insert: '  ' },
    selection: { anchor: sel.head + 2 },
  })
  return true
}

export function outdentLine(): boolean {
  const view = getEditorView()
  if (!view) return false

  const sel = view.state.selection.main
  if (!sel.empty) return false

  const line = view.state.doc.lineAt(sel.head)
  const info = getLineInfo(line.text)
  if (!info) return false

  if (info.type === 'blockquote') {
    const trimmed = line.text.trimStart()
    const wsLen = line.text.length - trimmed.length
    const firstMarker = line.from + wsLen

    if (info.level > 0) {
      view.dispatch({
        changes: { from: firstMarker, to: firstMarker + 1, insert: '' },
        selection: { anchor: Math.max(sel.head - 1, firstMarker) },
      })
    } else {
      const bqMatch = trimmed.match(/^>+\s*/)
      if (bqMatch) {
        const prefixLen = bqMatch[0].length
        view.dispatch({
          changes: { from: firstMarker, to: firstMarker + prefixLen, insert: '' },
          selection: { anchor: Math.max(sel.head - prefixLen, firstMarker) },
        })
      }
    }
    return true
  }

  if (info.level > 0) {
    view.dispatch({
      changes: { from: line.from, to: line.from + 2, insert: '' },
      selection: { anchor: Math.max(sel.head - 2, line.from) },
    })
  } else {
    const trimmed = line.text.trimStart()
    const prefixMatch = trimmed.match(/^[-*+]\s+|^\d+\.\s+|^[-*+]\s+\[[ x]\]\s+/)
    if (prefixMatch) {
      const prefixLen = prefixMatch[0].length
      view.dispatch({
        changes: { from: line.from, to: line.from + prefixLen, insert: '' },
        selection: { anchor: Math.max(sel.head - prefixLen, line.from) },
      })
    } else {
      return false
    }
  }
  return true
}

export function handleListEnter(): boolean {
  const view = getEditorView()
  if (!view) return false

  const sel = view.state.selection.main
  if (!sel.empty) return false

  const line = view.state.doc.lineAt(sel.head)
  const info = getLineInfo(line.text)
  if (!info) return false

  const cursorRel = sel.head - line.from
  if (cursorRel < info.prefixLen) return false

  const isContentEmpty = info.content.trim() === ''
  if (isContentEmpty && cursorRel >= info.prefixLen) {
    view.dispatch({
      changes: { from: line.from, to: line.from + info.prefixLen, insert: '' },
      selection: { anchor: line.from },
    })
    return true
  }

  const beforeCursor = line.text.slice(0, cursorRel)
  const afterCursor = line.text.slice(cursorRel).trimStart()
  const newPrefix = getContinuationPrefix(line.text, info)

  view.dispatch({
    changes: {
      from: line.from,
      to: line.to,
      insert: beforeCursor + '\n' + newPrefix + afterCursor,
    },
    selection: { anchor: line.from + beforeCursor.length + 1 + newPrefix.length },
  })
  return true
}

// ── Format functions ──

export function toggleBold(): void {
  wrapRange('**')
}

export function toggleItalic(): void {
  wrapRange('*')
}

export function toggleStrikethrough(): void {
  wrapRange('~~')
}

export function toggleHighlight(): void {
  wrapRange('==')
}

export function toggleInlineCode(): void {
  wrapRange('`')
}

export function toggleFormula(): void {
  wrapRange('$')
}

export function clearFormatting(): void {
  const view = getEditorView()
  if (!view) return

  let { from, to } = view.state.selection.main

  // If no selection, expand to the word/phrase under cursor
  if (from === to) {
    const line = view.state.doc.lineAt(from)
    const lineText = line.text
    const relativePos = from - line.from

    const wordStart = lineText.slice(0, relativePos).search(/\S+$/)
    const fromIdx = wordStart === -1 ? relativePos : wordStart
    const rest = lineText.slice(relativePos)
    const wordEnd = rest.search(/\s/)
    const toIdx = wordEnd === -1 ? lineText.length : relativePos + wordEnd

    from = line.from + fromIdx
    to = line.from + toIdx
  }

  if (from === to) return

  let text = view.state.sliceDoc(from, to)

  // Strip common markdown syntax markers
  text = text
    // Block-level: headings
    .replace(/^\s*#{1,6}\s+/gm, '')
    // Block-level: blockquotes
    .replace(/^>+\s*/gm, '')
    // Bold+Italic (must come before bold or italic alone)
    .replace(/\*\*\*(.+?)\*\*\*/g, '$1')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '$1')
    // Italic (now safe from conflicting with **)
    .replace(/\*(.+?)\*/g, '$1')
    // Strikethrough
    .replace(/~~(.+?)~~/g, '$1')
    // Highlight
    .replace(/==(.+?)==/g, '$1')
    // Inline code (single backtick)
    .replace(/`([^`]+)`/g, '$1')
    // Formula
    .replace(/\$(.+?)\$/g, '$1')
    // Image ![alt](url)
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Link [text](url)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Wiki-link [[text]]
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    // Footnote [^n]
    .replace(/\[\^(\d+)\]/g, '$1')

  view.dispatch({
    changes: { from, to, insert: text },
    selection: { anchor: from },
  })
}

// ── Heading ──

export function insertHeading(level: number): void {
  const view = getEditorView()
  if (!view) return

  const { from } = view.state.selection.main
  const line = view.state.doc.lineAt(from)
  const lineText = view.state.sliceDoc(line.from, line.to)
  const headingMatch = lineText.match(/^(#{1,6})\s/)

  if (headingMatch) {
    const currentLevel = headingMatch[1].length
    if (currentLevel === level) {
      // Same level — remove heading
      view.dispatch({
        changes: { from: line.from, to: line.from + level + 1, insert: '' },
      })
      return
    }
    // Change level
    const before = lineText.slice(0, lineText.indexOf(headingMatch[0]))
    const after = lineText.slice(lineText.indexOf(headingMatch[0]) + headingMatch[0].length)
    view.dispatch({
      changes: {
        from: line.from,
        to: line.to,
        insert: before + '#'.repeat(level) + ' ' + after,
      },
    })
    return
  }

  // Insert heading
  view.dispatch({
    changes: { from: line.from, to: line.from, insert: '#'.repeat(level) + ' ' },
    selection: { anchor: from + level + 1 },
  })
}

// ── List helpers ──

export function insertBulletList(): void {
  insertAtLineStart('- ')
}

export function insertNumberedList(): void {
  insertAtLineStart('1. ')
}

export function insertTaskList(): void {
  insertAtLineStart('- [ ] ')
}

export function insertBlockquote(): void {
  const view = getEditorView()
  if (!view) return

  const { from } = view.state.selection.main
  const line = view.state.doc.lineAt(from)
  const lineText = line.text
  const trimmed = lineText.trimStart()
  const indent = lineText.length - trimmed.length

  const bqMatch = trimmed.match(/^(>+)(\s*)/)
  if (bqMatch) {
    const prefixLen = bqMatch[0].length
    view.dispatch({
      changes: {
        from: line.from + indent,
        to: line.from + indent + prefixLen,
        insert: '',
      },
      selection: { anchor: Math.max(from - prefixLen, line.from + indent) },
    })
    return
  }

  view.dispatch({
    changes: {
      from: line.from + indent,
      to: line.from + indent,
      insert: '> ',
    },
    selection: { anchor: from + 2 },
  })
}

export function insertBodyText(): void {
  const view = getEditorView()
  if (!view) return

  const { from } = view.state.selection.main
  const line = view.state.doc.lineAt(from)
  const lineText = view.state.sliceDoc(line.from, line.to)
  const trimmed = lineText.trimStart()
  const indent = lineText.length - trimmed.length

  // Remove block-level prefix if present
  const blockMatch = trimmed.match(/^(#{1,6}\s|>+\s?|[-*+]\s|\d+\.\s|[-*+]\s+\[[ x]\]\s)/)
  if (blockMatch) {
    const prefixLen = blockMatch[1].length
    view.dispatch({
      changes: { from: line.from + indent, to: line.from + indent + prefixLen, insert: '' },
      selection: { anchor: Math.max(from - prefixLen, line.from + indent) },
    })
  }
}

// ── Insert helpers ──

export function insertHorizontalRule(): void {
  const view = getEditorView()
  if (!view) return

  const { from } = view.state.selection.main
  const line = view.state.doc.lineAt(from)

  view.dispatch({
    changes: { from: line.to, to: line.to, insert: '\n\n---\n\n' },
    selection: { anchor: line.to + 4 },
  })
}

export function insertCodeBlock(): void {
  insertBlock('```', '```')
}

export function insertTable(): void {
  const view = getEditorView()
  if (!view) return

  const { from } = view.state.selection.main
  const line = view.state.doc.lineAt(from)

  const table = [
    '| Columna 1 | Columna 2 | Columna 3 |',
    '| --------- | --------- | --------- |',
    '|           |           |           |',
    '',
  ].join('\n')

  view.dispatch({
    changes: { from: line.to, to: line.to, insert: '\n\n' + table },
    selection: { anchor: line.to + 4 + table.indexOf('| ') },
  })
}

export function insertFootnote(): void {
  const view = getEditorView()
  if (!view) return

  const { from } = view.state.selection.main
  const line = view.state.doc.lineAt(from)

  view.dispatch({
    changes: { from: line.to, to: line.to, insert: '\n\n[^1]: Nota al pie' },
    selection: { anchor: from },
  })
}
