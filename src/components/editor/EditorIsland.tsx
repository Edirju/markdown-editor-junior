import { useEffect } from 'react'
import { Editor } from './Editor'
import { initTheme } from '../../stores/theme'

export function EditorIsland() {
  useEffect(() => {
    initTheme()
  }, [])

  return (
    <div className="editor-container">
      <main className="editor-main">
        <Editor />
      </main>
    </div>
  )
}
