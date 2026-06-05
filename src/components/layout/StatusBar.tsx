import { useStore } from '@nanostores/react'
import { $cursorLine, $cursorCol, $persistenceStatus } from '../../stores/ui'

const persistConfig = {
  saved: { label: 'Guardado', dot: '●', color: 'text-emerald-500' },
  saving: { label: 'Guardando...', dot: '◌', color: 'text-amber-500' },
  dirty: { label: 'Sin guardar', dot: '○', color: 'text-gray-400' },
}

export function StatusBar() {
  const line = useStore($cursorLine)
  const col = useStore($cursorCol)
  const persistStatus = useStore($persistenceStatus)
  const { label, dot, color } = persistConfig[persistStatus]

  return (
    <footer className="statusbar">
      <div className="statusbar-group">
        <span className="statusbar-item">
          <svg className="statusbar-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={12} height={12}>
            <path d="M12 3C17.392 3 21.878 6.88 22.819 12C21.879 17.12 17.392 21 12 21C6.608 21 2.122 17.12 1.181 12C2.122 6.88 6.608 3 12 3ZM12 5C7.983 5 4.409 7.989 3.406 12C4.409 16.011 7.983 19 12 19C16.017 19 19.591 16.011 20.594 12C19.591 7.989 16.017 5 12 5ZM12 8C14.209 8 16 9.791 16 12C16 14.209 14.209 16 12 16C9.791 16 8 14.209 8 12C8 9.791 9.791 8 12 8Z" />
          </svg>
          Ln {line}, Col {col}
        </span>
        <span className="statusbar-sep" />
        <span className="statusbar-item">Markdown</span>
        <span className="statusbar-sep" />
        <span className="statusbar-item">UTF-8</span>
      </div>
      <div className="statusbar-group">
        <span className={`statusbar-item ${color}`}>
          <span className="statusbar-dot">{dot}</span>
          {label}
        </span>
      </div>
    </footer>
  )
}
