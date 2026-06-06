import { useStore } from '@nanostores/react'
import { $activeMenu, $activeModal, toggleMenu, closeMenu, openModal, type MenuId } from '../../stores/ui'
import { useEffect, useRef } from 'react'

interface MenuItem {
  label: string
  shortcut?: string
  divider?: boolean
  action?: () => void
}

interface MenuConfig {
  id: MenuId
  label: string
  items: MenuItem[]
}

const menus: MenuConfig[] = [
  {
    id: 'file',
    label: 'Archivo',
    items: [
      { label: 'Nuevo', shortcut: 'Ctrl+N' },
      { label: 'Abrir...', shortcut: 'Ctrl+O' },
      { divider: true, label: '' },
      { label: 'Guardar', shortcut: 'Ctrl+S' },
      { label: 'Guardar como...' },
      { divider: true, label: '' },
      { label: 'Exportar PDF' },
      { label: 'Exportar HTML' },
      { divider: true, label: '' },
      { label: 'Salir' },
    ],
  },
  {
    id: 'edit',
    label: 'Editar',
    items: [
      { label: 'Deshacer', shortcut: 'Ctrl+Z' },
      { label: 'Rehacer', shortcut: 'Ctrl+Shift+Z' },
      { divider: true, label: '' },
      { label: 'Cortar', shortcut: 'Ctrl+X' },
      { label: 'Copiar', shortcut: 'Ctrl+C' },
      { label: 'Pegar', shortcut: 'Ctrl+V' },
    ],
  },
  {
    id: 'view',
    label: 'Ver',
    items: [
      { label: 'Modo oscuro' },
      { label: 'Vista previa', shortcut: 'Ctrl+Shift+P' },
      { divider: true, label: '' },
      { label: 'Pantalla completa', shortcut: 'F11' },
    ],
  },
  {
    id: 'insert',
    label: 'Insertar',
    items: [
      { label: 'Enlace', shortcut: 'Ctrl+K' },
      { label: 'Imagen' },
      { label: 'Tabla' },
      { label: 'Bloque de código' },
      { label: 'Cita' },
      { label: 'Línea horizontal' },
    ],
  },
  {
    id: 'help',
    label: 'Ayuda',
    items: [
      {
        label: 'Configuración',
        action: () => openModal('settings'),
      },
      {
        label: 'Atajos de teclado',
        action: () => openModal('shortcuts'),
      },
      { divider: true, label: '' },
      { label: 'Acerca de' },
    ],
  },
]

export function MenuBar() {
  const activeMenu = useStore($activeMenu)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        closeMenu()
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closeMenu()
      }
    }
    if (activeMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeMenu])

  return (
    <div ref={barRef} className="menu-bar">
      {menus.map((menu) => (
        <div key={menu.id} className="menu-item-wrapper">
          <button
            className={`menu-trigger ${activeMenu === menu.id ? 'menu-trigger--active' : ''}`}
            onClick={() => toggleMenu(menu.id)}
          >
            {menu.label}
          </button>
          {activeMenu === menu.id && (
            <div className="menu-dropdown">
              {menu.items.map((item, i) => {
                if (item.divider) {
                  return <div key={`div-${i}`} className="menu-divider" />
                }
                return (
                  <button
                    key={item.label}
                    className="menu-dropdown-item"
                    onClick={() => {
                      if (item.action) item.action()
                      closeMenu()
                    }}
                  >
                    <span className="menu-dropdown-label">{item.label}</span>
                    {item.shortcut && (
                      <span className="menu-dropdown-shortcut">{item.shortcut}</span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
