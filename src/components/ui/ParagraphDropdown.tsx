import { ListaVineta, ListaNumerada, ListaTareas, H1, H2, H3, H4, H5, H6, TextoCuerpo, Cita } from '../icons'
import { DropdownItem } from './DropdownItem'
import { DropdownDivider } from './DropdownDivider'

export function ParagraphDropdown() {
  return (
    <>
      <DropdownItem icon={<ListaVineta size={16} />} label="Lista con viñetas" shortcut="Ctrl+Shift+U" />
      <DropdownItem icon={<ListaNumerada size={16} />} label="Lista numerada" shortcut="Ctrl+Shift+O" />
      <DropdownItem icon={<ListaTareas size={16} />} label="Lista de Tareas" shortcut="Ctrl+Shift+T" />
      <DropdownDivider />
      <DropdownItem icon={<H1 size={16} />} label="Título 1" shortcut="Ctrl+1" />
      <DropdownItem icon={<H2 size={16} />} label="Título 2" shortcut="Ctrl+2" />
      <DropdownItem icon={<H3 size={16} />} label="Título 3" shortcut="Ctrl+3" />
      <DropdownItem icon={<H4 size={16} />} label="Título 4" shortcut="Ctrl+4" />
      <DropdownItem icon={<H5 size={16} />} label="Título 5" shortcut="Ctrl+5" />
      <DropdownItem icon={<H6 size={16} />} label="Título 6" shortcut="Ctrl+6" />
      <DropdownItem icon={<TextoCuerpo size={16} />} label="Texto" shortcut="Ctrl+0" />
      <DropdownItem icon={<Cita size={16} />} label="Cita" shortcut="Ctrl+Shift+Q" />
    </>
  )
}
