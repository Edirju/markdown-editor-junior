import { Bold, Italic, Tachado, Resaltado, Codigo, Formula, BorrarFormato } from '../icons'
import { DropdownItem } from './DropdownItem'
import { DropdownDivider } from './DropdownDivider'
import {
  toggleBold,
  toggleItalic,
  toggleStrikethrough,
  toggleHighlight,
  toggleInlineCode,
  toggleFormula,
  clearFormatting,
} from '../../lib/format-commands'

export function FormatDropdown() {
  return (
    <>
      <DropdownItem
        icon={<Bold size={16} />}
        label="Negrita"
        shortcut="Ctrl+B"
        onClick={toggleBold}
      />
      <DropdownItem
        icon={<Italic size={16} />}
        label="Cursiva"
        shortcut="Ctrl+I"
        onClick={toggleItalic}
      />
      <DropdownItem
        icon={<Tachado size={16} />}
        label="Tachado"
        shortcut="Ctrl+Shift+S"
        onClick={toggleStrikethrough}
      />
      <DropdownItem
        icon={<Resaltado size={16} />}
        label="Resaltado"
        shortcut="Ctrl+Shift+H"
        onClick={toggleHighlight}
      />
      <DropdownItem
        icon={<Codigo size={16} />}
        label="Código"
        shortcut="Ctrl+E"
        onClick={toggleInlineCode}
      />
      <DropdownItem
        icon={<Formula size={16} />}
        label="Fórmula"
        shortcut="Ctrl+Shift+M"
        onClick={toggleFormula}
      />
      <DropdownDivider />
      <DropdownItem
        icon={<BorrarFormato size={16} />}
        label="Limpiar Formato"
        shortcut="Ctrl+\"
        onClick={clearFormatting}
      />
    </>
  )
}
