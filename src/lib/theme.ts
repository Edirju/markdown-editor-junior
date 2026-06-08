import { EditorView } from '@codemirror/view'

export const cmTheme = EditorView.theme(
  {
    "&": {
      fontFamily: "Inter, sans-serif",
      fontSize: "15px",
      lineHeight: "1.6",
      height: "100%",
    },
    ".cm-scroller": {
      fontFamily: "inherit",
      overflow: "auto",
    },
    ".cm-content": {
      fontFamily: "inherit",
      padding: "1rem 1.5rem",
      caretColor: "var(--cm-caret)",
    },
    ".cm-cursor": {
      borderLeftColor: "var(--cm-caret)",
    },
    ".cm-selectionBackground": {
      backgroundColor: "var(--cm-selection-bg) !important",
    },
    ".cm-activeLine": {
      backgroundColor: "var(--cm-active-line-bg)",
    },
    ".cm-gutters": {
      display: "none",
    },
    ".cm-foldPlaceholder": {
      display: "none",
    },
    ".cm-md-hide": {
      display: "none",
    },
    ".cm-md-header-1": {
      fontSize: "48px",
      fontWeight: "700",
      lineHeight: "1.1",
      fontFamily: "Inter, sans-serif",
      textDecoration: "none !important",
    },
    ".cm-md-header-2": {
      fontSize: "40px",
      fontWeight: "700",
      lineHeight: "1.1",
      fontFamily: "Inter, sans-serif",
      textDecoration: "none !important",
    },
    ".cm-md-header-3": {
      fontSize: "36px",
      fontWeight: "700",
      lineHeight: "1.1",
      fontFamily: "Inter, sans-serif",
      textDecoration: "none !important",
    },
    ".cm-md-header-4": {
      fontSize: "32px",
      fontWeight: "700",
      lineHeight: "1.1",
      fontFamily: "Inter, sans-serif",
      textDecoration: "none !important",
    },
    ".cm-md-header-5": {
      fontSize: "24px",
      fontWeight: "700",
      lineHeight: "1.1",
      fontFamily: "Inter, sans-serif",
      textDecoration: "none !important",
    },
    ".cm-md-header-6": {
      fontSize: "20px",
      fontWeight: "700",
      lineHeight: "1.1",
      fontFamily: "Inter, sans-serif",
      textDecoration: "none !important",
    },
    ".cm-md-blockquote": {
      borderLeft: "2px solid var(--accent)",
      paddingLeft: "1em",
      color: "var(--text-secondary)",
      fontStyle: "italic",
    },
    ".cm-md-blockquote-1": {
      borderLeft: "3px solid var(--accent)",
      paddingLeft: "1em",
    },
    ".cm-md-blockquote-2": {
      borderLeft: "3px solid var(--accent)",
      paddingLeft: "1em",
    },
    ".cm-md-emphasis": {
      fontStyle: "italic",
    },
    ".cm-md-strong": {
      fontWeight: "700",
    },
    ".cm-md-wiki-link": {
      color: "var(--cm-wiki-link)",
      textDecoration: "underline",
      cursor: "pointer",
    },
    ".cm-md-strikethrough": {
      textDecoration: "line-through",
    },
    ".cm-md-inline-code": {
      fontFamily: "Inconsolata, 'JetBrains Mono', ui-monospace, monospace",
      fontSize: "0.8125em",
      fontWeight: "300",
      backgroundColor: "var(--cm-code-bg)",
      padding: "0.15em 0.45em",
      borderRadius: "4px",
      border: "1px solid var(--cm-code-border)",
      color: "var(--cm-code-text)",
      letterSpacing: "-0.01em",
    },
    ".cm-md-formula": {
      fontFamily: '"Latin Modern Math", "STIX Two Math", "Cambria Math", serif',
      fontSize: "1.05em",
      letterSpacing: "0.05em",
      fontStyle: "normal",
      color: "var(--cm-formula-text)",
      backgroundColor: "var(--cm-formula-bg)",
      padding: "0.4em 0.45em",
      borderRadius: "3px",
    },
    ".cm-md-code-block": {
      display: "block",
      fontFamily: "Inconsolata, 'JetBrains Mono', ui-monospace, monospace",
      fontSize: ".875rem",
      backgroundColor: "rgb(var(--cm-code-inline-bg))",
      color: "rgb(var(--cm-code-inline-tx),0.85)",
      borderLeft: "3px solid var(--accent)",
      paddingLeft: "1em",
      letterSpacing: "0.025em",
      borderRadius: "0px",
    },
    ".cm-md-code-text": {
      fontFamily: "Inconsolata, 'JetBrains Mono', ui-monospace, monospace",
      fontSize: "0.875em",
    },
    ".cm-md-highlight": {
      backgroundColor: "var(--cm-highlight-bg)",
      borderRadius: "3px",
      padding: "0.1em 0.15em",
    },
    ".cm-md-subscript": {
      fontSize: "0.75em",
      verticalAlign: "sub",
      lineHeight: "1",
    },
    ".cm-md-superscript": {
      fontSize: "0.75em",
      verticalAlign: "super",
      lineHeight: "1",
    },
    ".cm-md-horizontal-rule": {
      display: "inline-block",
      width: "100%",
      height: "0",
      color: "transparent",
      overflow: "hidden",
      borderBottom: "1px solid rgb(var(--cm-code-border-line), 0.12)",
      verticalAlign: "middle",
    },
  },
  { dark: false },
);
