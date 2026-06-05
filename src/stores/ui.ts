import { atom } from 'nanostores'

export type EditorMode = 'edit' | 'read'
export type PersistenceStatus = 'saved' | 'saving' | 'dirty'
export type MenuId = 'file' | 'edit' | 'view' | 'insert' | 'help'
export type ModalId = 'settings' | 'shortcuts'
export type DropdownId = 'formato' | 'parrafo' | 'insertar'
export type SubmenuId = 'fila' | 'columna'

export const $editorMode = atom<EditorMode>('edit')
export const $cursorLine = atom<number>(1)
export const $cursorCol = atom<number>(1)
export const $persistenceStatus = atom<PersistenceStatus>('saved')
export const $activeMenu = atom<MenuId | null>(null)
export const $activeModal = atom<ModalId | null>(null)
export const $activeDropdown = atom<DropdownId | null>(null)
export const $activeSubmenu = atom<SubmenuId | null>(null)

export function toggleDropdown(dropdown: DropdownId): void {
  $activeDropdown.set($activeDropdown.get() === dropdown ? null : dropdown)
  $activeSubmenu.set(null)
}

export function closeDropdown(): void {
  $activeDropdown.set(null)
  $activeSubmenu.set(null)
}

export function toggleSubmenu(submenu: SubmenuId): void {
  $activeSubmenu.set($activeSubmenu.get() === submenu ? null : submenu)
}

export function toggleMenu(menu: MenuId): void {
  $activeMenu.set($activeMenu.get() === menu ? null : menu)
}

export function closeMenu(): void {
  $activeMenu.set(null)
}

export function openModal(modal: ModalId): void {
  $activeModal.set(modal)
  closeMenu()
}

export function closeModal(): void {
  $activeModal.set(null)
}
