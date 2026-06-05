import { atom } from 'nanostores'

export const $isDark = atom<boolean>(false)

export function toggleTheme() {
  const next = !$isDark.get()
  $isDark.set(next)
  document.documentElement.classList.toggle('dark', next)
}

export function initTheme() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const stored = localStorage.getItem('markdown-editor-theme')
  const isDark = stored !== null ? stored === 'dark' : prefersDark
  $isDark.set(isDark)
  document.documentElement.classList.toggle('dark', isDark)
}
