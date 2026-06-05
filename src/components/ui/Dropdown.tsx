import { useEffect, useRef, type ReactNode } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  onToggle: () => void
  label: string
  icon: ReactNode
  children: ReactNode
  align?: 'left' | 'right'
}

export function Dropdown({ open, onClose, onToggle, label, icon, children, align = 'left' }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={onToggle}
        className={`toolbar-dropdown-trigger ${open ? 'toolbar-dropdown-trigger--active' : ''}`}
      >
        {icon}
        <span className="toolbar-dropdown-label">{label}</span>
        <svg className={`toolbar-chevron ${open ? 'toolbar-chevron--open' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={12} height={12}>
          <path d="M12 14L8 10H16L12 14Z" />
        </svg>
      </button>
      {open && (
        <div className={`toolbar-dropdown ${align === 'right' ? 'toolbar-dropdown--right' : ''}`}>
          {children}
        </div>
      )}
    </div>
  )
}
