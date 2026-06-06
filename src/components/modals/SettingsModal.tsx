import { useStore } from '@nanostores/react'
import { $activeModal, closeModal } from '../../stores/ui'
import { $isDark, toggleTheme } from '../../stores/theme'
import { Modal } from './Modal'

export function SettingsModal() {
  const activeModal = useStore($activeModal)
  const isDark = useStore($isDark)

  return (
    <Modal open={activeModal === 'settings'} title="Configuración" onClose={closeModal}>
      <div className="settings-form">
        <div className="settings-field">
          <label className="settings-label">Tema</label>
          <div className="settings-options">
            <label className="settings-radio">
              <input type="radio" name="theme" checked={!isDark} onChange={() => { if (isDark) toggleTheme() }} />
              Claro
            </label>
            <label className="settings-radio">
              <input type="radio" name="theme" checked={isDark} onChange={() => { if (!isDark) toggleTheme() }} />
              Oscuro
            </label>
          </div>
        </div>

        <div className="settings-field">
          <label className="settings-label">Fuente del editor</label>
          <select className="settings-select">
            <option>Inter</option>
            <option selected>Inconsolata</option>
            <option>JetBrains Mono</option>
            <option>Fira Code</option>
          </select>
        </div>

        <div className="settings-field">
          <label className="settings-label">Tamaño de fuente</label>
          <select className="settings-select">
            <option>12px</option>
            <option selected>14px</option>
            <option>16px</option>
            <option>18px</option>
            <option>20px</option>
          </select>
        </div>

        <div className="settings-field">
          <label className="settings-checkbox">
            <input type="checkbox" defaultChecked />
            Ajuste de línea
          </label>
          <label className="settings-checkbox">
            <input type="checkbox" />
            Numeración de líneas
          </label>
          <label className="settings-checkbox">
            <input type="checkbox" defaultChecked />
            Vista previa en vivo
          </label>
          <label className="settings-checkbox">
            <input type="checkbox" defaultChecked />
            Auto-guardado
          </label>
        </div>

        <div className="settings-actions">
          <button className="settings-btn settings-btn--secondary" onClick={closeModal}>
            Cancelar
          </button>
          <button className="settings-btn settings-btn--primary" onClick={closeModal}>
            Guardar
          </button>
        </div>
      </div>
    </Modal>
  )
}
