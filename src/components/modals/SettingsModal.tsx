import { useStore } from '@nanostores/react'
import { $activeModal, closeModal } from '../../stores/ui'
import { $isDark, toggleTheme } from '../../stores/theme'
import { Modal } from './Modal'

export function SettingsModal() {
  const activeModal = useStore($activeModal)
  const isDark = useStore($isDark)

  return (
    <Modal open={activeModal === 'settings'} title="Configuración" onClose={closeModal}>
      <div class="settings-form">
        <div class="settings-field">
          <label class="settings-label">Tema</label>
          <div class="settings-options">
            <label class="settings-radio">
              <input type="radio" name="theme" checked={!isDark} onChange={() => { if (isDark) toggleTheme() }} />
              Claro
            </label>
            <label class="settings-radio">
              <input type="radio" name="theme" checked={isDark} onChange={() => { if (!isDark) toggleTheme() }} />
              Oscuro
            </label>
          </div>
        </div>

        <div class="settings-field">
          <label class="settings-label">Fuente del editor</label>
          <select class="settings-select">
            <option>Inter</option>
            <option selected>Inconsolata</option>
            <option>JetBrains Mono</option>
            <option>Fira Code</option>
          </select>
        </div>

        <div class="settings-field">
          <label class="settings-label">Tamaño de fuente</label>
          <select class="settings-select">
            <option>12px</option>
            <option selected>14px</option>
            <option>16px</option>
            <option>18px</option>
            <option>20px</option>
          </select>
        </div>

        <div class="settings-field">
          <label class="settings-checkbox">
            <input type="checkbox" defaultChecked />
            Ajuste de línea
          </label>
          <label class="settings-checkbox">
            <input type="checkbox" />
            Numeración de líneas
          </label>
          <label class="settings-checkbox">
            <input type="checkbox" defaultChecked />
            Vista previa en vivo
          </label>
          <label class="settings-checkbox">
            <input type="checkbox" defaultChecked />
            Auto-guardado
          </label>
        </div>

        <div class="settings-actions">
          <button class="settings-btn settings-btn--secondary" onClick={closeModal}>
            Cancelar
          </button>
          <button class="settings-btn settings-btn--primary" onClick={closeModal}>
            Guardar
          </button>
        </div>
      </div>
    </Modal>
  )
}
