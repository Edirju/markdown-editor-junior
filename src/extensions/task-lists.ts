import { type MarkdownExtensionConfig, type DecorationSpec } from './types'

const TASK_TYPES = ['Task', 'TaskMark']

export const taskListsExtension: MarkdownExtensionConfig = {
  name: 'task-lists',
  nodeTypes: TASK_TYPES,
  getDecorations: (node, doc, _cursorLine) => {
    const decos: DecorationSpec[] = []
    const text = doc.toString().slice(node.from, node.to)

    // Detect [ ] or [x]
    if (/^\[.\s*\]/.test(text)) {
      const checked = text[1]?.toLowerCase() === 'x'
      decos.push({
        from: node.from,
        to: node.to,
        class: `cm-md-task ${checked ? 'cm-md-task-checked' : 'cm-md-task-unchecked'}`,
      })
    }

    return decos.length > 0 ? decos : null
  },
}
