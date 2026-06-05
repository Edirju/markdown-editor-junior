export interface DecorationSpec {
  from: number
  to: number
  class: string
}

export interface MarkdownExtensionConfig {
  name: string
  nodeTypes: string[]
  getDecorations: (
    node: { from: number; to: number; type: { name: string }; firstChild: any; parent: any },
    doc: { line: (n: number) => { number: number }; toString: () => string },
    cursorLine: number,
  ) => DecorationSpec[] | null
}
