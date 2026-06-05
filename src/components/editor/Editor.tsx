import { useEffect, useRef } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { EditorState, Compartment } from '@codemirror/state'
import { keymap } from '@codemirror/view'
import { defaultKeymap } from '@codemirror/commands'
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language'
import { $doc } from '../../stores/document'
import { $cursorLine, $editorMode, $persistenceStatus } from '../../stores/ui'
import { schedulePersist, loadDoc } from '../../lib/persistence'
import { cmTheme } from '../../lib/theme'
import { livePreview, defaultExtensions } from '../../extensions/live-preview'

export function Editor() {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const editableCompartment = useRef(new Compartment())

  useEffect(() => {
    if (!editorRef.current) return

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const content = update.state.doc.toString()
        $doc.set(content)
        schedulePersist(content)
      }
      if (update.selectionSet) {
        const line = update.state.doc.lineAt(update.state.selection.main.head)
        $cursorLine.set(line.number)
      }
    })

    const startDoc = typeof $doc.get() === 'string' && $doc.get().length > 0
      ? $doc.get()
      : '# Welcome\n\nStart typing...'

    const state = EditorState.create({
      doc: startDoc,
      extensions: [
        basicSetup,
        markdown({ base: markdownLanguage }),
        keymap.of(defaultKeymap),
        cmTheme,
        livePreview(defaultExtensions),
        updateListener,
        editableCompartment.current.of(EditorView.editable.of(true)),
        syntaxHighlighting(defaultHighlightStyle),
        EditorView.lineWrapping,
      ],
    })

    const view = new EditorView({
      state,
      parent: editorRef.current,
    })

    viewRef.current = view

    // Load saved doc from persistence
    loadDoc().then((saved) => {
      if (saved && saved !== state.doc.toString()) {
        view.dispatch({
          changes: { from: 0, to: state.doc.length, insert: saved },
        })
        $doc.set(saved)
      }
    })

    return () => view.destroy()
  }, [])

  // React to edit/read mode changes
  useEffect(() => {
    const unsub = $editorMode.listen((mode) => {
      if (!viewRef.current) return
      const isEditable = mode === 'edit'
      viewRef.current.dispatch({
        effects: editableCompartment.current.reconfigure(
          EditorView.editable.of(isEditable),
        ),
      })
    })
    return unsub
  }, [])

  return (
    <div
      ref={editorRef}
      className="h-full w-full overflow-hidden"
      data-editor
    />
  )
}
