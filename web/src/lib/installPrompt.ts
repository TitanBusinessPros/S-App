// Module-level (not React-scoped) capture of the browser's install prompt.
//
// Chrome can fire `beforeinstallprompt` as soon as it finishes evaluating
// installability — which can happen immediately on page load, well before
// React has rendered, auth has resolved, and a user has reached a
// logged-in page. The event only fires once per page load and there's no
// way to ask for it again, so a listener that only attaches once some
// deep, post-login component mounts (as this used to) can silently miss it
// every time. Attaching the listener here, at module scope, and importing
// this module from main.tsx (the very first thing that runs) captures it
// as early as our own code possibly can, regardless of what page or auth
// state the app is in when it actually fires.
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferredPrompt: BeforeInstallPromptEvent | null = null
let installed = typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches
const listeners = new Set<() => void>()

function notify() {
  listeners.forEach((l) => l())
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e as BeforeInstallPromptEvent
    notify()
  })
  window.addEventListener('appinstalled', () => {
    installed = true
    deferredPrompt = null
    notify()
  })
}

export function getInstallState() {
  return { canInstall: !!deferredPrompt && !installed, installed }
}

export async function triggerInstallPrompt() {
  if (!deferredPrompt) return
  await deferredPrompt.prompt()
  await deferredPrompt.userChoice
  deferredPrompt = null
  notify()
}

export function subscribeInstallState(callback: () => void) {
  listeners.add(callback)
  return () => {
    listeners.delete(callback)
  }
}
