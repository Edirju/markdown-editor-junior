import { type MarkdownExtensionConfig, type DecorationSpec } from './types'

const TASK_TYPES = ['Task', 'ListMark']

export const taskListsExtension: MarkdownExtensionConfig = {
  name: 'task-lists',
  nodeTypes: TASK_TYPES,
  getDecorations: (node, doc, _cursorLine) => {
    const decos: DecorationSpec[] = []

    // Hide the bullet marker (- or *) only for task lists
    if (node.type.name === 'ListMark') {
      const parent = node.parent
      if (parent) {
        let child = parent.firstChild
        while (child) {
          if (child.type.name === 'Task') {
            decos.push({ from: node.from, to: node.to, class: 'cm-md-hide' })
            break
          }
          child = child.nextSibling
        }
      }
      return decos
    }

    // Task node: [ ] or [x]
    const text = doc.toString().slice(node.from, node.to)
    if (/^\[.\s*\]$/.test(text)) {
      const checked = text[1]?.toLowerCase() === 'x'
      decos.push({
        from: node.from,
        to: node.to,
        class: `cm-md-task ${checked ? 'cm-md-task-checked' : 'cm-md-task-unchecked'}`,
      })

      // Hide bracket characters ([ and ]) via child TaskMark nodes
      let child = node.firstChild
      while (child) {
        if (child.type.name === 'TaskMark') {
          decos.push({ from: child.from, to: child.to, class: 'cm-md-hide' })
        }
        child = child.nextSibling
      }
    }

    return decos.length > 0 ? decos : null
  },
}
