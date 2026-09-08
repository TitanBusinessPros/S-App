import { useEffect, useRef } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { useAuth } from '../lib/AuthContext'
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
  const { user } = useAuth()
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null)
  const wasLoggedIn = useRef(false)

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      registrationRef.current = registration ?? null
    },
  })

  // Force a fresh check right when someone logs in -- that's the moment
  // they're actually looking at the app and most likely to notice this
  // banner, rather than relying on the browser's own background check
  // interval, which can be long enough that someone opens the app, uses
  // it, and leaves again before a check ever runs.
  useEffect(() => {
    if (user && !wasLoggedIn.current) {
      registrationRef.current?.update()
    }
    wasLoggedIn.current = !!user
  }, [user])

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
