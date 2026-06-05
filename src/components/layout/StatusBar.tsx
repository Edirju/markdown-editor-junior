import { useStore } from '@nanostores/react'
import { $cursorLine, $cursorCol, $persistenceStatus } from '../../stores/ui'

const statusLabels: Record<string, string> = {
  saved: 'Guardado',
  saving: 'Guardando...',
  dirty: 'Sin guardar',
}

export function StatusBar() {
  const line = useStore($cursorLine)
  const col = useStore($cursorCol)
  const persistStatus = useStore($persistenceStatus)

  return (
    <div class="status-bar">
      <div class="status-bar-left">
        <span class="status-bar-item">Ln {line}, Col {col}</span>
        <span class="status-bar-separator" />
        <span class="status-bar-item">Markdown</span>
        <span class="status-bar-separator" />
        <span class="status-bar-item">UTF-8</span>
      </div>
      <div class="status-bar-right">
        <span class={`status-bar-item status-bar-persist--${persistStatus}`}>
          {persistStatus === 'saved' ? '●' : persistStatus === 'saving' ? '◌' : '○'} {statusLabels[persistStatus]}
        </span>
      </div>
    </div>
  )
}
