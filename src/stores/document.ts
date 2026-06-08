import { atom, map } from 'nanostores'

interface NoteMeta {
  title: string
  createdAt: Date
  updatedAt: Date
}

export const $doc = atom<string>('# Welcome\n\nStart typing your markdown here...\n\n## Features\n\n- **Bold** and *italic* text\n- [ ] Task lists\n- [[Wiki links]]\n- Headers')

export const $noteMeta = map<NoteMeta>({
  title: 'Untitled',
  createdAt: new Date(),
  updatedAt: new Date(),
})
