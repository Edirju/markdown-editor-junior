import { getEditorView } from './editor-ref'

type SyntaxPair = [string, string]

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

  const { from, to } = view.state.selection.main
  if (from === to) return

  let text = view.state.sliceDoc(from, to)

  // Strip common markdown syntax markers
  text = text
    .replace(/^\s*#{1,6}\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/~~(.+?)~~/g, '$1')
    .replace(/==(.+?)==/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\$(.+?)\$/g, '$1')
    .replace(/^>\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')

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
  insertAtLineStart('> ')
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
