import { useRegisterSW } from 'virtual:pwa-register/react'
import './UpdatePrompt.css'

/**
 * The app is an installed PWA -- once someone has it open (or installed to
 * their home screen), a new deploy has no way to reach them except this.
 * The service worker downloads new content in the background, but with
 * registerType: 'prompt' (see vite.config.ts) it waits here instead of
 * silently taking over, so this banner is the only way to actually get on
 * the new version without fully closing and relaunching the app.
 */
export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  if (!needRefresh) return null

  return (
    <div className="update-prompt" role="status">
      <span>A new version of Survival Day is available.</span>
      <button type="button" className="btn btn-primary" onClick={() => updateServiceWorker(true)}>
        Refresh to update
      </button>
    </div>
  )
}
