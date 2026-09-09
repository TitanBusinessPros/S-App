import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '../lib/analytics'

// Firebase Analytics only auto-logs a page_view on the initial script load —
// this app is a client-side-routed SPA, so nothing fires again as the user
// moves between routes unless something calls trackPageView itself. Sits
// inside BrowserRouter (for useLocation) and renders nothing.
export function AnalyticsPageViews() {
  const location = useLocation()

  useEffect(() => {
    trackPageView(location.pathname)
  }, [location.pathname])

  return null
}
