import { logEvent } from 'firebase/analytics'
import { analyticsReady } from './firebase'

// Fire-and-forget wrapper around Firebase Analytics: every call site just
// calls trackEvent(...) without awaiting or checking support itself. It
// resolves the (cached, one-time) support check in firebase.ts and no-ops
// wherever Analytics isn't available, rather than every caller needing its
// own guard.
export function trackEvent(name: string, params?: Record<string, unknown>): void {
  void analyticsReady.then((analytics) => {
    if (analytics) logEvent(analytics, name, params)
  })
}

// Firebase Analytics auto-logs a page_view on initial load, but this is a
// client-side-routed SPA — nothing fires again as the user navigates
// between routes unless we log it ourselves.
export function trackPageView(pagePath: string): void {
  trackEvent('page_view', { page_path: pagePath })
}
