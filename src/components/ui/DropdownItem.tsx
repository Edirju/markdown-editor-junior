import type { ReactNode } from 'react'

interface Props {
  icon?: ReactNode
  label: string
  shortcut?: string
  onClick?: () => void
  disabled?: boolean
  hasSubmenu?: boolean
}

export function DropdownItem({ icon, label, shortcut, onClick, disabled, hasSubmenu }: Props) {
  return (
    <button
      className={`toolbar-dropdown-item ${disabled ? 'toolbar-dropdown-item--disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="toolbar-dropdown-item-icon">{icon}</span>}
      <span className="toolbar-dropdown-item-label">{label}</span>
      {shortcut && <span className="toolbar-dropdown-item-shortcut">{shortcut}</span>}
      {hasSubmenu && (
        <svg className="ml-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={14} height={14}>
          <path d="M14 12L10 16V8L14 12Z" />
        </svg>
      )}
    </button>
  )
}
