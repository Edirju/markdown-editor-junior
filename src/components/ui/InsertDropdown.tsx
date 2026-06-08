import { useEffect, useRef } from 'react'
import { useStore } from '@nanostores/react'
import { $activeSubmenu, toggleSubmenu, closeDropdown } from '../../stores/ui'
import {
  NotaPie,
  DoubleQuotes,
  ReglaHorizontal,
  Tabla,
  CodigoBloque,
  FormulaBloque,
  Enlace,
  Imagen,
  Fila,
  Columna,
} from '../icons'
import { DropdownItem } from './DropdownItem'
import { DropdownDivider } from './DropdownDivider'
import { RowSubmenu } from './RowSubmenu'
import { ColumnSubmenu } from './ColumnSubmenu'
import { getEditorView } from '../../lib/editor-ref'
import {
  insertCallout,
  insertHorizontalRule,
  insertCodeBlock,
  insertMathBlock,
  insertLink,
  insertImage,
} from '../../lib/format-commands'
import { $activeModal, $footnoteState, openModal } from '../../stores/ui'

function exec(fn: () => void) {
  const view = getEditorView()
  if (!view) return
  fn()
  view.focus()
  closeDropdown()
}

function execFootnote() {
  const view = getEditorView()
  if (!view) return
  const { from, to } = view.state.selection.main
  const selectedText = from !== to ? view.state.sliceDoc(from, to) : ''
  $footnoteState.set({ selectionFrom: from, selectionTo: to, selectedText })
  openModal('footnote')
  closeDropdown()
}

export function InsertDropdown() {
  const activeSubmenu = useStore($activeSubmenu)
  const rowRef = useRef<HTMLDivElement>(null)
  const colRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (activeSubmenu === 'fila' && rowRef.current) {
      const rect = rowRef.current.getBoundingClientRect()
      const parent = rowRef.current.closest('.toolbar-dropdown') as HTMLElement
      if (parent) {
        const parentRect = parent.getBoundingClientRect()
        rowRef.current.style.left = `${parentRect.width}px`
        rowRef.current.style.top = `${rect.top - parentRect.top}px`
      }
    }
    if (activeSubmenu === 'columna' && colRef.current) {
      const rect = colRef.current.getBoundingClientRect()
      const parent = colRef.current.closest('.toolbar-dropdown') as HTMLElement
      if (parent) {
        const parentRect = parent.getBoundingClientRect()
        colRef.current.style.left = `${parentRect.width}px`
        colRef.current.style.top = `${rect.top - parentRect.top}px`
      }
    }
  }, [activeSubmenu])

  return (
    <>
      <DropdownItem
        icon={<NotaPie size={16} />}
        label="Nota al pie"
        onClick={execFootnote}
      />
      <DropdownItem
        icon={<DoubleQuotes size={16} />}
        label="Destacado"
        onClick={() => exec(insertCallout)}
      />
      <DropdownItem
        icon={<ReglaHorizontal size={16} />}
        label="Regla horizontal"
        shortcut="Ctrl+Shift+-"
        onClick={() => exec(insertHorizontalRule)}
      />
      <DropdownItem icon={<Tabla size={16} />} label="Tabla" />
      <DropdownItem
        icon={<CodigoBloque size={16} />}
        label="Bloque de Código"
        shortcut="Ctrl+Shift+C"
        onClick={() => exec(insertCodeBlock)}
      />
      <DropdownItem
        icon={<FormulaBloque size={16} />}
        label="Bloque Matemático"
        onClick={() => exec(insertMathBlock)}
      />
      <DropdownDivider />
      <DropdownItem
        icon={<Enlace size={16} />}
        label="Enlace"
        shortcut="Ctrl+K"
        onClick={() => exec(insertLink)}
      />
      <DropdownItem
        icon={<Imagen size={16} />}
        label="Imagen"
        onClick={() => exec(insertImage)}
      />
      <DropdownDivider />
      <div ref={rowRef} className="relative">
        <DropdownItem
          icon={<Fila size={16} />}
          label="Fila"
          hasSubmenu
          onClick={() => toggleSubmenu('fila')}
        />
        {activeSubmenu === 'fila' && (
          <div className="toolbar-dropdown toolbar-dropdown--nested">
            <RowSubmenu />
          </div>
        )}
      </div>
      <div ref={colRef} className="relative">
        <DropdownItem
          icon={<Columna size={16} />}
          label="Columna"
          hasSubmenu
          onClick={() => toggleSubmenu('columna')}
        />
        {activeSubmenu === 'columna' && (
          <div className="toolbar-dropdown toolbar-dropdown--nested">
            <ColumnSubmenu />
          </div>
        )}
      </div>
    </>
  )
}
