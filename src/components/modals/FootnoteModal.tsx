import { useRef, useEffect } from 'react'
import { useStore } from '@nanostores/react'
import { $activeModal, $footnoteState, closeModal } from '../../stores/ui'
import { Modal } from './Modal'
import { getEditorView } from '../../lib/editor-ref'
import { insertFootnote, getNextFootnoteId } from '../../lib/format-commands'

export function FootnoteModal() {
  const activeModal = useStore($activeModal)
  const footnoteState = useStore($footnoteState)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (activeModal === 'footnote' && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.value = ''
      textareaRef.current.setAttribute('data-id', getNextFootnoteId())
    }
  }, [activeModal])

  function handleInsert() {
    const view = getEditorView()
    if (!view) return
    const content = textareaRef.current?.value.trim()
    if (!content) return
    const id = getNextFootnoteId()
    const { selectionFrom, selectionTo } = $footnoteState.get()
    insertFootnote(id, content, selectionFrom, selectionTo)
    closeModal()
    view.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleInsert()
    }
    if (e.key === 'Escape') {
      closeModal()
      const view = getEditorView()
      if (view) view.focus()
    }
  }

  return (
    <Modal open={activeModal === 'footnote'} title="Insertar nota al pie" onClose={() => { closeModal(); const view = getEditorView(); if (view) view.focus() }}>
      <div className="footnote-modal">
        {footnoteState.selectedText && (
          <div className="footnote-modal-selected">
            Palabra seleccionada: <strong>{footnoteState.selectedText}</strong>
          </div>
        )}
        <textarea
          ref={textareaRef}
          className="footnote-modal-textarea"
          placeholder="Escribe el contenido de la nota al pie..."
          onKeyDown={handleKeyDown}
          rows={4}
        />
        <div className="footnote-modal-actions">
          <span className="footnote-modal-hint">
            {footnoteState.selectedText
              ? `Se usará "[^${footnoteState.selectedText}]" como identificador`
              : 'Se asignará un número automáticamente'}
          </span>
          <div className="footnote-modal-buttons">
            <button className="settings-btn settings-btn--secondary" onClick={() => { closeModal(); const view = getEditorView(); if (view) view.focus() }}>
              Cancelar
            </button>
            <button className="settings-btn settings-btn--primary" onClick={handleInsert}>
              Insertar
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
