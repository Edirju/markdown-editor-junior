import { type EditorView } from '@codemirror/view'

let _view: EditorView | null = null

export function setEditorView(view: EditorView): void {
  _view = view
}

export function getEditorView(): EditorView | null {
  return _view
}
