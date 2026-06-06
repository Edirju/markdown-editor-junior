import { ListaVineta, ListaNumerada, ListaTareas, H1, H2, H3, H4, H5, H6, TextoCuerpo, Cita } from '../icons'
import { DropdownItem } from './DropdownItem'
import { DropdownDivider } from './DropdownDivider'
import { closeDropdown } from '../../stores/ui'
import { getEditorView } from '../../lib/editor-ref'
import {
  insertBulletList,
  insertNumberedList,
  insertTaskList,
  insertHeading,
  insertBodyText,
  insertBlockquote,
} from '../../lib/format-commands'

function exec(fn: () => void) {
  const view = getEditorView()
  if (!view) return
  fn()
  view.focus()
  closeDropdown()
}

export function ParagraphDropdown() {
  return (
    <>
      <DropdownItem icon={<ListaVineta size={16} />} label="Lista con viñetas" shortcut="Ctrl+Shift+U" onClick={() => exec(insertBulletList)} />
      <DropdownItem icon={<ListaNumerada size={16} />} label="Lista numerada" shortcut="Ctrl+Shift+O" onClick={() => exec(insertNumberedList)} />
      <DropdownItem icon={<ListaTareas size={16} />} label="Lista de Tareas" shortcut="Ctrl+Shift+T" onClick={() => exec(insertTaskList)} />
      <DropdownDivider />
      <DropdownItem icon={<H1 size={16} />} label="Título 1" shortcut="Ctrl+1" onClick={() => exec(() => insertHeading(1))} />
      <DropdownItem icon={<H2 size={16} />} label="Título 2" shortcut="Ctrl+2" onClick={() => exec(() => insertHeading(2))} />
      <DropdownItem icon={<H3 size={16} />} label="Título 3" shortcut="Ctrl+3" onClick={() => exec(() => insertHeading(3))} />
      <DropdownItem icon={<H4 size={16} />} label="Título 4" shortcut="Ctrl+4" onClick={() => exec(() => insertHeading(4))} />
      <DropdownItem icon={<H5 size={16} />} label="Título 5" shortcut="Ctrl+5" onClick={() => exec(() => insertHeading(5))} />
      <DropdownItem icon={<H6 size={16} />} label="Título 6" shortcut="Ctrl+6" onClick={() => exec(() => insertHeading(6))} />
      <DropdownItem icon={<TextoCuerpo size={16} />} label="Texto" shortcut="Ctrl+0" onClick={() => exec(insertBodyText)} />
      <DropdownItem icon={<Cita size={16} />} label="Cita" shortcut="Ctrl+Shift+Q" onClick={() => exec(insertBlockquote)} />
    </>
  )
}
