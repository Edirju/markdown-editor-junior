import { useEffect, useRef } from 'react'
import { useStore } from '@nanostores/react'
import { $activeSubmenu, toggleSubmenu } from '../../stores/ui'
import { NotaPie, DoubleQuotes, ReglaHorizontal, Tabla, CodigoBloque, FormulaBloque, Fila, Columna } from '../icons'
import { DropdownItem } from './DropdownItem'
import { DropdownDivider } from './DropdownDivider'
import { RowSubmenu } from './RowSubmenu'
import { ColumnSubmenu } from './ColumnSubmenu'

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
      <DropdownItem icon={<NotaPie size={16} />} label="Nota al pie" />
      <DropdownItem icon={<DoubleQuotes size={16} />} label="Destacado" />
      <DropdownItem icon={<ReglaHorizontal size={16} />} label="Regla horizontal" />
      <DropdownItem icon={<Tabla size={16} />} label="Tabla" />
      <DropdownItem icon={<CodigoBloque size={16} />} label="Bloque de Código" />
      <DropdownItem icon={<FormulaBloque size={16} />} label="Bloque Matemático" />
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
