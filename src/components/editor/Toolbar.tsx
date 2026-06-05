import { useStore } from '@nanostores/react'
import { $doc, $noteMeta, type NoteMeta } from '../../stores/document'
import { $editorMode, $persistenceStatus } from '../../stores/ui'
import { $isDark, toggleTheme } from '../../stores/theme'
import { useEffect } from 'react'

const statusIcons: Record<string, string> = {
  saved: 'ri-checkbox-circle-line',
  saving: 'ri-loader-2-line',
  dirty: 'ri-edit-circle-line',
}

const statusLabels: Record<string, string> = {
  saved: 'Saved',
  saving: 'Saving...',
  dirty: 'Unsaved',
}

function extractTitle(doc: string): string {
  const match = doc.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : 'Untitled'
}

export function Toolbar() {
  const doc = useStore($doc)
  const meta = useStore($noteMeta) as unknown as NoteMeta
  const mode = useStore($editorMode)
  const persistStatus = useStore($persistenceStatus)
  const isDark = useStore($isDark)

  const title = extractTitle(doc)

  return (
    <div class="toolbar">
      <div class="toolbar-header">
        <div class="toolbar-header-left">
          <span class="ri-markdown-line" />
          <h1 class="toolbar-title">{title}</h1>
        </div>
        <div class="toolbar-header-right">
          <span class={`toolbar-status toolbar-status--${persistStatus}`}>
            <i className={`${statusIcons[persistStatus]} ${persistStatus === 'saving' ? 'animate-spin' : ''}`} />
            {statusLabels[persistStatus]}
          </span>
          <div class="toolbar-divider" />
          <button
            class="toolbar-btn"
            onClick={toggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <i class="ri-sun-line" />
            ) : (
              <i class="ri-moon-line" />
            )}
          </button>
          <button
            class="toolbar-btn"
            onClick={() => $editorMode.set(mode === 'edit' ? 'read' : 'edit')}
            title={mode === 'edit' ? 'Switch to read mode' : 'Switch to edit mode'}
          >
            {mode === 'edit' ? (
              <i class="ri-eye-line" />
            ) : (
              <i class="ri-pencil-line" />
            )}
          </button>
        </div>
      </div>
      <div class="toolbar-format">
        <button class="toolbar-format-btn" title="Bold"><b>B</b></button>
        <button class="toolbar-format-btn" title="Italic"><i>I</i></button>
        <button class="toolbar-format-btn" title="Strikethrough"><s>S</s></button>
        <button class="toolbar-format-btn" title="Inline code">&lt;/&gt;</button>

        <div class="toolbar-separator" />

        <button class="toolbar-format-btn" title="Heading 1">H1</button>
        <button class="toolbar-format-btn" title="Heading 2">H2</button>
        <button class="toolbar-format-btn" title="Heading 3">H3</button>

        <div class="toolbar-separator" />

        <button class="toolbar-format-btn" title="Unordered list">UL</button>
        <button class="toolbar-format-btn" title="Ordered list">OL</button>
        <button class="toolbar-format-btn" title="Task list">☑</button>

        <div class="toolbar-separator" />

        <button class="toolbar-format-btn" title="Link">🔗</button>
        <button class="toolbar-format-btn" title="Image">🖼</button>
        <button class="toolbar-format-btn" title="Blockquote">◆</button>
        <button class="toolbar-format-btn" title="Horizontal rule">—</button>
      </div>
    </div>
  )
}
