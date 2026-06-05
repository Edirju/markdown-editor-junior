import { AddTop, AddDown, ArrowUp, ArrowDown, Fila, Eliminar } from '../icons'
import { DropdownItem } from './DropdownItem'
import { DropdownDivider } from './DropdownDivider'

export function RowSubmenu() {
  return (
    <>
      <DropdownItem icon={<AddTop size={16} />} label="Añadir fila encima" />
      <DropdownItem icon={<AddDown size={16} />} label="Añadir fila debajo" />
      <DropdownDivider />
      <DropdownItem icon={<ArrowUp size={16} />} label="Mover arriba" />
      <DropdownItem icon={<ArrowDown size={16} />} label="Mover abajo" />
      <DropdownDivider />
      <DropdownItem icon={<Fila size={16} />} label="Duplicar fila" />
      <DropdownItem icon={<Eliminar size={16} />} label="Borrar fila" />
    </>
  )
}
