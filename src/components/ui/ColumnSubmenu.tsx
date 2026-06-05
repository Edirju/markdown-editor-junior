import { ArrowLeft, ArrowRight, AlignLeft, AlignCenter, AlignRight, Columna, Eliminar } from '../icons'
import { DropdownItem } from './DropdownItem'
import { DropdownDivider } from './DropdownDivider'

export function ColumnSubmenu() {
  return (
    <>
      <DropdownItem icon={<ArrowLeft size={16} />} label="Añadir Col. izquierda" />
      <DropdownItem icon={<ArrowRight size={16} />} label="Añadir Col. derecha" />
      <DropdownDivider />
      <DropdownItem icon={<ArrowLeft size={16} />} label="Mover izquierda" />
      <DropdownItem icon={<ArrowRight size={16} />} label="Mover derecha" />
      <DropdownDivider />
      <DropdownItem icon={<AlignLeft size={16} />} label="Alinear izquierda" />
      <DropdownItem icon={<AlignCenter size={16} />} label="Alinear centro" />
      <DropdownItem icon={<AlignRight size={16} />} label="Alinear derecha" />
      <DropdownDivider />
      <DropdownItem icon={<Columna size={16} />} label="Duplicar columna" />
      <DropdownItem icon={<Eliminar size={16} />} label="Borrar columna" />
    </>
  )
}
