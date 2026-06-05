import { useStore } from '@nanostores/react'
import { $doc } from '../../stores/document'
import { $editorMode, $persistenceStatus, $activeDropdown, toggleDropdown, closeDropdown } from '../../stores/ui'
import { $isDark, toggleTheme } from '../../stores/theme'
import { useEffect, useState } from 'react'
import { Nuevo, Guardar, Abrir, Copiar, Cortar, Pegar, Dark, Light } from '../icons'
import { Dropdown } from '../ui/Dropdown'
import { FormatDropdown } from '../ui/FormatDropdown'
import { ParagraphDropdown } from '../ui/ParagraphDropdown'
import { InsertDropdown } from '../ui/InsertDropdown'
import { Formato, Parrafo, Insertar } from '../icons'
import { getEditorView } from '../../lib/editor-ref'

export function Toolbar() {
  const doc = useStore($doc)
  const mode = useStore($editorMode)
  const persistStatus = useStore($persistenceStatus)
  const isDark = useStore($isDark)
  const activeDropdown = useStore($activeDropdown)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMobileOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  function extractTitle(doc: string): string {
    const match = doc.match(/^#\s+(.+)$/m)
    return match ? match[1].trim() : 'Untitled'
  }

  function clearDoc() {
    const view = getEditorView()
    if (!view) return
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: '' },
    })
  }

  function saveDoc() {
    const view = getEditorView()
    if (!view) return
    const content = view.state.doc.toString()
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  function openDoc() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.md,.markdown,.txt'
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        const view = getEditorView()
        if (!view || typeof reader.result !== 'string') return
        view.dispatch({
          changes: { from: 0, to: view.state.doc.length, insert: reader.result },
        })
      }
      reader.readAsText(file)
    }
    input.click()
  }

  function execCommand(cmd: string) {
    const view = getEditorView()
    if (!view) return
    view.focus()
    document.execCommand(cmd)
  }

  const title = extractTitle(doc)

  const statusIcon = persistStatus === 'saved' ? '●' : persistStatus === 'saving' ? '◌' : '○'
  const statusColor = persistStatus === 'saved'
    ? 'text-emerald-500'
    : persistStatus === 'saving'
    ? 'text-amber-500'
    : 'text-gray-400'

  return (
    <header className="toolbar">
      <div className="toolbar-inner">
        <div className="toolbar-section toolbar-section--left">
          <div className="toolbar-group">
            <button className="toolbar-btn" title="Nuevo" onClick={clearDoc}>
              <Nuevo size={18} />
            </button>
            <button className="toolbar-btn" title="Guardar" onClick={saveDoc}>
              <Guardar size={18} />
            </button>
            <button className="toolbar-btn" title="Abrir" onClick={openDoc}>
              <Abrir size={18} />
            </button>
          </div>

          <div className="toolbar-divider" />

          <div className="toolbar-group">
            <button className="toolbar-btn" title="Copiar" onClick={() => execCommand('copy')}>
              <Copiar size={18} />
            </button>
            <button className="toolbar-btn" title="Cortar" onClick={() => execCommand('cut')}>
              <Cortar size={18} />
            </button>
            <button className="toolbar-btn" title="Pegar" onClick={() => execCommand('paste')}>
              <Pegar size={18} />
            </button>
          </div>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-section toolbar-section--center">
          <Dropdown
            open={activeDropdown === 'formato'}
            onClose={closeDropdown}
            onToggle={() => toggleDropdown('formato')}
            label="Formato"
            icon={<Formato size={16} />}
          >
            <FormatDropdown />
          </Dropdown>

          <Dropdown
            open={activeDropdown === 'parrafo'}
            onClose={closeDropdown}
            onToggle={() => toggleDropdown('parrafo')}
            label="Párrafo"
            icon={<Parrafo size={16} />}
          >
            <ParagraphDropdown />
          </Dropdown>

          <Dropdown
            open={activeDropdown === 'insertar'}
            onClose={closeDropdown}
            onToggle={() => toggleDropdown('insertar')}
            label="Insertar"
            icon={<Insertar size={16} />}
          >
            <InsertDropdown />
          </Dropdown>
        </div>

        <div className="toolbar-section toolbar-section--right">
          <span className={`toolbar-status ${statusColor}`}>
            {statusIcon}
          </span>

          <button
            className="toolbar-btn toolbar-btn--icon"
            onClick={toggleTheme}
            title={isDark ? 'Modo claro' : 'Modo oscuro'}
          >
            {isDark ? <Light size={18} /> : <Dark size={18} />}
          </button>

          <button
            className="toolbar-btn toolbar-btn--icon"
            onClick={() => $editorMode.set(mode === 'edit' ? 'read' : 'edit')}
            title={mode === 'edit' ? 'Vista previa' : 'Editar'}
          >
            {mode === 'edit' ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={18} height={18}>
                <path d="M12 3C17.392 3 21.878 6.88 22.819 12C21.879 17.12 17.392 21 12 21C6.608 21 2.122 17.12 1.181 12C2.122 6.88 6.608 3 12 3ZM12 5C7.983 5 4.409 7.989 3.406 12C4.409 16.011 7.983 19 12 19C16.017 19 19.591 16.011 20.594 12C19.591 7.989 16.017 5 12 5ZM12 8C14.209 8 16 9.791 16 12C16 14.209 14.209 16 12 16C9.791 16 8 14.209 8 12C8 9.791 9.791 8 12 8Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={18} height={18}>
                <path d="M16.36 14.54L17.78 15.95L19 17.5H15.5L12 15.5L10.5 14.5L12 12L13.5 14.5L16.36 14.54ZM3 4L4.79 6.54L3 8.5H6.5L10 6.5L12.5 7.5L14 6L13.5 4.5L12 3.5L9.5 4.5L6.5 3H3ZM21 21L17.46 18.21L19 16.5H15.5L12 18.5L9.5 17.5L8 19L8.5 20.5L10 21.5L12.5 20.5L15.5 21.5H18.5L21 21Z" />
              </svg>
            )}
          </button>

          <button className="toolbar-btn toolbar-btn--icon mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={18} height={18}>
              {mobileOpen ? (
                <path d="M18 9L12 15L6 9H18Z" />
              ) : (
                <path d="M3 4H21V6H3V4ZM9 11H21V13H9V11ZM3 18H21V20H3V18Z" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div className="toolbar-title-bar">
        <span className="toolbar-title">{title}</span>
      </div>
    </header>
  )
}
