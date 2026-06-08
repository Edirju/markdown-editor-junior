import {
  type DecorationSet,
  type EditorView,
  ViewPlugin,
  type ViewUpdate,
  Decoration,
  WidgetType,
  EditorView as EV,
} from '@codemirror/view'
import { type Range } from '@codemirror/state'

class FootnoteWidget extends WidgetType {
  constructor(readonly id: string) {
    super()
  }

  toDOM(): HTMLElement {
    const sup = document.createElement('sup')
    sup.className = 'cm-footnote-marker'
    sup.textContent = this.id
    sup.dataset.footnoteId = this.id
    sup.title = `Ir a la nota [${this.id}]`
    return sup
  }
}

class BackrefWidget extends WidgetType {
  constructor(readonly id: string) {
    super()
  }

  toDOM(): HTMLElement {
    const span = document.createElement('span')
    span.className = 'cm-footnote-backref'
    span.textContent = '↩'
    span.dataset.footnoteId = this.id
    span.title = `Volver al marcador [${this.id}]`
    return span
  }
}

class FootnoteSepWidget extends WidgetType {
  toDOM(): HTMLElement {
    const div = document.createElement('div')
    div.className = 'cm-footnote-separator'
    const hr = document.createElement('hr')
    const label = document.createElement('span')
    label.className = 'cm-footnote-separator-label'
    label.textContent = 'Notas al pie'
    div.appendChild(hr)
    div.appendChild(label)
    return div
  }
}

let lastClickedMarkerPos: number | null = null
let lastClickedMarkerId: string | null = null

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function findDefinitionRange(doc: string, defStart: number): number {
  let pos = defStart
  while (pos < doc.length) {
    const nl = doc.indexOf('\n', pos)
    if (nl === -1) return doc.length
    const nextLineStart = nl + 1
    const rest = doc.slice(nextLineStart)
    const nextNl = rest.indexOf('\n')
    const line = nextNl === -1 ? rest : rest.slice(0, nextNl)
    if (line.trim() === '') return nl
    if (/^\[\^[^\]]+\]:/.test(line.trim())) return nl
    pos = nextLineStart
  }
  return doc.length
}

export function footnotePlugin() {
  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet

      constructor(view: EditorView) {
        this.decorations = this.build(view)
      }

      update(update: ViewUpdate) {
        if (update.docChanged || update.selectionSet) {
          this.decorations = this.build(update.view)
        }
      }

      build(view: EditorView): DecorationSet {
        const decos: Range<Decoration>[] = []
        const doc = view.state.doc.toString()
        const cursor = view.state.selection.main.head

        const definitions: { id: string; from: number; to: number }[] = []

        // 1. Collect definitions [^id]: content (multi-line until blank line or next def)
        const defRe = /^\[\^([^\]]+)\]:\s*/gm
        let match: RegExpExecArray | null
        while ((match = defRe.exec(doc)) !== null) {
          const from = match.index
          const id = match[1]
          const contentStart = from + match[0].length
          const contentEnd = findDefinitionRange(doc, contentStart)
          definitions.push({ id, from, to: contentEnd })
        }

        // 2. Add separator + heading before first definition
        if (definitions.length > 0) {
          const firstDef = definitions.reduce((a, b) => (a.from < b.from ? a : b))
          const lineBefore = doc.lastIndexOf('\n', firstDef.from - 2)
          const sepPos = lineBefore !== -1 ? lineBefore + 1 : 0
          if (cursor < sepPos || cursor > firstDef.from) {
            decos.push(
              Decoration.widget({
                widget: new FootnoteSepWidget(),
                side: 1,
              }).range(sepPos, sepPos),
            )
          }
        }

        // 3. Inline markers [^id] (not followed by ':')
        const markerRe = /\[\^([^\]]+)\](?!:)/g
        while ((match = markerRe.exec(doc)) !== null) {
          const from = match.index
          const to = from + match[0].length
          if (cursor >= from && cursor <= to) continue
          decos.push(
            Decoration.replace({ widget: new FootnoteWidget(match[1]) }).range(from, to),
          )
        }

        // 4. Decorate definitions
        for (const def of definitions) {
          if (cursor >= def.from && cursor <= def.to) continue

          const prefixEnd = def.from + `[^${def.id}]:`.length

          decos.push(
            Decoration.mark({ class: 'cm-md-hide' }).range(def.from, prefixEnd),
          )
          decos.push(
            Decoration.mark({ class: 'cm-footnote-def-text' }).range(prefixEnd, def.to),
          )
          decos.push(
            Decoration.widget({
              widget: new BackrefWidget(def.id),
              side: 1,
            }).range(def.to, def.to),
          )
        }

        return Decoration.set(decos)
      }
    },
    {
      decorations: (v) => v.decorations,
      eventHandlers: {
        click: (e, view) => {
          const target = e.target as HTMLElement

          if (target.classList.contains('cm-footnote-marker')) {
            const id = target.dataset.footnoteId
            if (!id) return false
            const docText = view.state.doc.toString()
            const defRe = new RegExp(`^\\[\\^${escapeRegExp(id)}\\]\\:`, 'm')
            const defMatch = docText.match(defRe)
            if (defMatch) {
              const markerPos = view.state.selection.main.head
              const defPos = defMatch.index!
              lastClickedMarkerPos = markerPos
              lastClickedMarkerId = id
              view.dispatch({
                effects: EV.scrollIntoView(defPos, { y: 'start' }),
                selection: { anchor: defPos },
              })
            }
            return true
          }

          if (target.classList.contains('cm-footnote-backref')) {
            const id = target.dataset.footnoteId
            if (!id) return false
            const docText = view.state.doc.toString()
            let pos = -1
            if (lastClickedMarkerPos !== null && lastClickedMarkerId === id) {
              pos = lastClickedMarkerPos
            } else {
              const markerRe = new RegExp(`\\[\\^${escapeRegExp(id)}\\]`, 'g')
              const cursorPos = view.state.selection.main.head
              let closestPos = -1
              let m: RegExpExecArray | null
              while ((m = markerRe.exec(docText)) !== null) {
                if (m.index + m[0].length <= cursorPos) {
                  closestPos = m.index
                }
              }
              pos = closestPos !== -1 ? closestPos : docText.indexOf(`[^${id}]`)
            }
            if (pos !== -1) {
              view.dispatch({
                effects: EV.scrollIntoView(pos, { y: 'center' }),
                selection: { anchor: pos },
              })
            }
            return true
          }

          return false
        },
      },
    },
  )
}
