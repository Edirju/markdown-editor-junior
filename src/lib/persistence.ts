import { get, set, del } from 'idb-keyval'
import { $doc, $noteMeta } from '../stores/document'
import { $persistenceStatus } from '../stores/ui'

const DOC_KEY = 'markdown-editor-doc'
const META_KEY = 'markdown-editor-meta'

let debounceTimer: ReturnType<typeof setTimeout> | null = null
const DEBOUNCE_MS = 500

async function saveToIndexedDB(key: string, value: unknown): Promise<boolean> {
  try {
    await set(key, value)
    return true
  } catch {
    return false
  }
}

function saveToLocalStorage(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

export async function persistDoc(doc: string): Promise<void> {
  $persistenceStatus.set('saving')

  const indexedOk = await saveToIndexedDB(DOC_KEY, doc)
  if (!indexedOk) {
    saveToLocalStorage(DOC_KEY, doc)
  }

  const meta = $noteMeta.get()
  const metaJson = JSON.stringify({ ...meta, updatedAt: new Date().toISOString() })
  const metaIndexedOk = await saveToIndexedDB(META_KEY, metaJson)
  if (!metaIndexedOk) {
    saveToLocalStorage(META_KEY, metaJson)
  }

  $persistenceStatus.set('saved')
}

export function schedulePersist(doc: string): void {
  $persistenceStatus.set('dirty')
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => persistDoc(doc), DEBOUNCE_MS)
}

export async function loadDoc(): Promise<string | null> {
  try {
    const fromIndexed = await get<string>(DOC_KEY)
    if (fromIndexed !== undefined) return fromIndexed
  } catch { /* fall through */ }

  try {
    return localStorage.getItem(DOC_KEY)
  } catch {
    return null
  }
}

export async function loadMeta(): Promise<Record<string, string> | null> {
  try {
    const fromIndexed = await get<string>(META_KEY)
    if (fromIndexed !== undefined) return JSON.parse(fromIndexed)
  } catch { /* fall through */ }

  try {
    const raw = localStorage.getItem(META_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export async function clearSaved(): Promise<void> {
  await del(DOC_KEY)
  await del(META_KEY)
  localStorage.removeItem(DOC_KEY)
  localStorage.removeItem(META_KEY)
}
