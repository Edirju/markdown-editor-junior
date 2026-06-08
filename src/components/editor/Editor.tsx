import { useEffect, useRef } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { EditorState, Compartment } from '@codemirror/state'
import { keymap } from '@codemirror/view'
import { syntaxHighlighting, HighlightStyle } from '@codemirror/language'
import { defaultKeymap } from '@codemirror/commands'
import { tags } from '@lezer/highlight'
import { $doc } from '../../stores/document'
import { $cursorLine, $cursorCol, $editorMode } from '../../stores/ui'
import { schedulePersist, loadDoc } from '../../lib/persistence'
import { cmTheme } from '../../lib/theme'
import { livePreview, defaultExtensions } from '../../extensions/live-preview'
import { footnotePlugin } from '../../extensions/footnotes'
import { setEditorView } from '../../lib/editor-ref'
import {
  toggleBold,
  toggleItalic,
  toggleStrikethrough,
  toggleHighlight,
  toggleInlineCode,
  toggleFormula,
  clearFormatting,
  insertHeading,
  insertBulletList,
  insertNumberedList,
  insertTaskList,
  insertBlockquote,
  insertBodyText,
  insertHorizontalRule,
  insertCodeBlock,
  insertFootnote,
  insertMathBlock,
  insertLink,
  insertImage,
  indentLine,
  outdentLine,
  handleListEnter,
} from '../../lib/format-commands'

const customKeymap = keymap.of([
  { key: 'Mod-b', run: () => { toggleBold(); return true } },
  { key: 'Mod-i', run: () => { toggleItalic(); return true } },
  { key: 'Mod-Shift-s', run: () => { toggleStrikethrough(); return true } },
  { key: 'Mod-Shift-h', run: () => { toggleHighlight(); return true } },
  { key: 'Mod-e', run: () => { toggleInlineCode(); return true } },
  { key: 'Mod-Shift-m', run: () => { toggleFormula(); return true } },
  { key: 'Mod-\\', run: () => { clearFormatting(); return true } },
  { key: 'Mod-1', run: () => { insertHeading(1); return true } },
  { key: 'Mod-2', run: () => { insertHeading(2); return true } },
  { key: 'Mod-3', run: () => { insertHeading(3); return true } },
  { key: 'Mod-4', run: () => { insertHeading(4); return true } },
  { key: 'Mod-5', run: () => { insertHeading(5); return true } },
  { key: 'Mod-6', run: () => { insertHeading(6); return true } },
  { key: 'Mod-Shift-u', run: () => { insertBulletList(); return true } },
  { key: 'Mod-Shift-o', run: () => { insertNumberedList(); return true } },
  { key: 'Mod-Shift-t', run: () => { insertTaskList(); return true } },
  { key: 'Mod-Shift-q', run: () => { insertBlockquote(); return true } },
  { key: 'Mod-0', run: () => { insertBodyText(); return true } },
  { key: 'Mod-Shift--', run: () => { insertHorizontalRule(); return true } },
  { key: 'Mod-Shift-c', run: () => { insertCodeBlock(); return true } },
  { key: 'Mod-k', run: () => { insertLink(); return true } },
  { key: 'Tab', run: () => indentLine() },
  { key: 'Shift-Tab', run: () => outdentLine() },
  { key: 'Enter', run: () => handleListEnter() },
])

const headingHighlightStyle = HighlightStyle.define([
  { tag: tags.meta, color: "#404740" },
  { tag: tags.link, textDecoration: "underline" },
  { tag: tags.heading, fontWeight: "bold" },
  { tag: tags.emphasis, fontStyle: "italic" },
  { tag: tags.strong, fontWeight: "bold" },
  { tag: tags.strikethrough, textDecoration: "line-through" },
  { tag: tags.keyword, color: "var(--syntax-keyword)" },
  { tag: [tags.atom, tags.bool, tags.url, tags.contentSeparator, tags.labelName], color: "var(--syntax-constant)" },
  { tag: [tags.literal, tags.inserted], color: "var(--syntax-literal)" },
  { tag: [tags.string, tags.deleted], color: "var(--syntax-string)" },
  { tag: [tags.regexp, tags.escape, tags.special(tags.string)], color: "var(--syntax-string)" },
  { tag: tags.definition(tags.variableName), color: "var(--syntax-function)" },
  { tag: tags.local(tags.variableName), color: "var(--syntax-variable)" },
  { tag: [tags.typeName, tags.namespace], color: "var(--syntax-type)" },
  { tag: tags.className, color: "var(--syntax-type)" },
  { tag: [tags.special(tags.variableName), tags.macroName], color: "var(--syntax-function)" },
  { tag: tags.definition(tags.propertyName), color: "var(--syntax-function)" },
  { tag: tags.comment, color: "var(--syntax-comment)" },
  { tag: tags.invalid, color: "var(--syntax-string)" },
])

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
        const head = update.state.selection.main.head
        const line = update.state.doc.lineAt(head)
        $cursorLine.set(line.number)
        $cursorCol.set(head - line.from + 1)
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
        customKeymap,
        livePreview(defaultExtensions),
        footnotePlugin(),
        updateListener,
        editableCompartment.current.of(EditorView.editable.of(true)),
        syntaxHighlighting(headingHighlightStyle),
        EditorView.lineWrapping,
        cmTheme,
      ],
    })

    const view = new EditorView({
      state,
      parent: editorRef.current,
    })

    viewRef.current = view
    setEditorView(view)

    // Load saved doc from persistence
    loadDoc().then((saved) => {
      if (saved && saved !== state.doc.toString()) {
        view.dispatch({
          changes: { from: 0, to: state.doc.length, insert: saved },
        })
        $doc.set(saved)
      }
    })

    return () => {
      setEditorView(null!)
      view.destroy()
    }
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
