import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div ref={backdropRef} class="modal-backdrop" onClick={(e) => { if (e.target === backdropRef.current) onClose() }}>
      <div class="modal-container" role="dialog" aria-modal="true" aria-label={title}>
        <div class="modal-header">
          <h2 class="modal-title">{title}</h2>
          <button class="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>
        <div class="modal-body">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
