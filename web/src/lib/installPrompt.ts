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

// Chrome only fires `beforeinstallprompt` when it currently considers the
// site NOT installed — but that check is per page-load, and it's not
// perfectly reliable (WebAPK registration on Android happens
// asynchronously and can take several seconds after `userChoice` resolves,
// so `appinstalled` can arrive late or, on some Chrome/Android
// combinations, not arrive at all for that session). Without a durable
// record of "the user already went through install", a later page load —
// especially one opened from a regular browser tab rather than the
// installed app's own icon, where `display-mode: standalone` correctly
// reads false — can see `beforeinstallprompt` fire again and re-offer
// install even though the app is already on the home screen. Persisting
// the flag the moment the user accepts closes that gap.
const INSTALLED_STORAGE_KEY = 'survivalday:pwaInstalled'

function readPersistedInstalled(): boolean {
  try {
    return typeof window !== 'undefined' && window.localStorage.getItem(INSTALLED_STORAGE_KEY) === 'true'
  } catch {
    // Private browsing / storage blocked — fall back to the in-session signal only.
    return false
  }
}

function persistInstalled() {
  try {
    window.localStorage.setItem(INSTALLED_STORAGE_KEY, 'true')
  } catch {
    // Ignore — worst case we just fall back to per-session detection.
  }
}

let deferredPrompt: BeforeInstallPromptEvent | null = null
let installed =
  (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) ||
  readPersistedInstalled()
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
    persistInstalled()
    notify()
  })
}

export function getInstallState() {
  return { canInstall: !!deferredPrompt && !installed, installed }
}

export async function triggerInstallPrompt() {
  if (!deferredPrompt) return
  await deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice
  deferredPrompt = null
  // Don't wait on `appinstalled` to hide the button — mark it installed as
  // soon as the user accepts, since that event can lag behind (or, on some
  // Android/Chrome versions, silently never fire) while WebAPK generation
  // finishes in the background.
  if (outcome === 'accepted') {
    installed = true
    persistInstalled()
  }
  notify()
}

export function subscribeInstallState(callback: () => void) {
  listeners.add(callback)
  return () => {
    listeners.delete(callback)
  }
}
