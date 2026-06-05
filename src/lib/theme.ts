import { EditorView } from '@codemirror/view'

export const cmTheme = EditorView.theme(
  {
    '&': {
      fontFamily: 'Inter, sans-serif',
      fontSize: '15px',
      lineHeight: '1.6',
      height: '100%',
    },
    '.cm-scroller': {
      fontFamily: 'inherit',
      overflow: 'auto',
    },
    '.cm-content': {
      fontFamily: 'inherit',
      padding: '1rem 1.5rem',
      caretColor: 'var(--cm-caret)',
    },
    '.cm-cursor': {
      borderLeftColor: 'var(--cm-caret)',
    },
    '.cm-selectionBackground': {
      backgroundColor: 'var(--cm-selection-bg) !important',
    },
    '.cm-activeLine': {
      backgroundColor: 'var(--cm-active-line-bg)',
    },
    '.cm-gutters': {
      display: 'none',
    },
    '.cm-foldPlaceholder': {
      display: 'none',
    },
    '.cm-md-hide': {
      visibility: 'hidden',
      userSelect: 'none',
    },
    '.cm-md-header-1': {
      fontSize: '2em',
      fontWeight: '700',
      lineHeight: '1.3',
      display: 'block',
      margin: '0.67em 0',
    },
    '.cm-md-header-2': {
      fontSize: '1.5em',
      fontWeight: '700',
      lineHeight: '1.3',
      display: 'block',
      margin: '0.75em 0',
    },
    '.cm-md-header-3': {
      fontSize: '1.25em',
      fontWeight: '600',
      lineHeight: '1.3',
      display: 'block',
      margin: '0.83em 0',
    },
    '.cm-md-header-4': {
      fontSize: '1em',
      fontWeight: '600',
      lineHeight: '1.3',
    },
    '.cm-md-header-5, .cm-md-header-6': {
      fontSize: '0.875em',
      fontWeight: '600',
      lineHeight: '1.3',
    },
    '.cm-md-emphasis': {
      fontStyle: 'italic',
    },
    '.cm-md-strong': {
      fontWeight: '700',
    },
    '.cm-md-link': {
      color: 'var(--cm-link)',
      textDecoration: 'underline',
      cursor: 'pointer',
    },
    '.cm-md-wiki-link': {
      color: 'var(--cm-wiki-link)',
      textDecoration: 'underline',
      cursor: 'pointer',
    },
    '.cm-md-strikethrough': {
      textDecoration: 'line-through',
    },
    '.cm-md-inline-code': {
      fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
      fontSize: '0.875em',
      backgroundColor: 'var(--cm-code-bg)',
      padding: '0.2em 0.4em',
      borderRadius: '3px',
    },
  },
  { dark: false },
)
