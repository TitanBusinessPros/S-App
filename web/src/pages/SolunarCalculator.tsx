import { useEffect, useState } from 'react'
import { Shell } from '../components/Shell'
import { useGeolocation } from '../lib/useGeolocation'
import { getSolunarPeriods, type SolunarPeriod } from '../lib/solunar'
import '../components/PageHeader.css'
import './SolunarCalculator.css'

// Continental US fallback if location is denied/unavailable -- same
// coordinates used elsewhere in the app for this purpose.
const FALLBACK_LAT = 39.5
const FALLBACK_LNG = -98.35

function formatTimeRange(period: SolunarPeriod): string {
  const fmt = (ms: number) => new Date(ms).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  return `${fmt(period.start)} – ${fmt(period.end)}`
}

export function SolunarCalculator() {
  const { coords, loading: locating, error: locationError, locate } = useGeolocation()
  const [periods, setPeriods] = useState<SolunarPeriod[]>([])

  useEffect(() => {
    locate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const lat = coords?.lat ?? FALLBACK_LAT
    const lng = coords?.lng ?? FALLBACK_LNG
    setPeriods(getSolunarPeriods(new Date(), lat, lng))
  }, [coords])

  const majors = periods.filter((p) => p.kind === 'major')
  const minors = periods.filter((p) => p.kind === 'minor')

  return (
    <Shell>
      <div className="map-header">
        <h1>Solunar Calculator</h1>
        <p>Today's predicted best times for fish and wildlife activity, based on the moon's position.</p>
      </div>

      <p className="map-disclosure">
        Based on the century-old solunar theory (fish/wildlife activity is believed to peak when the moon is
        overhead, underfoot, rising, or setting) — a real, widely used theory, not a guarantee. Times are
        approximate and location-dependent; without your location this defaults to the center of the continental
        US.
      </p>

      {locationError && (
        <p className="map-disclosure map-disclosure-offline">
          📍 {locationError} Showing estimates for a default US-wide location instead — press below for your own.
        </p>
      )}

      <div className="solunar-recenter-row">
        <button type="button" className="btn" onClick={locate} disabled={locating}>
          {locating ? 'Locating…' : coords ? '📍 Refresh for my location' : '📍 Use my location'}
        </button>
      </div>

      <div className="solunar-columns">
        <div className="card solunar-column">
          <h2>🌕 Major Periods</h2>
          <p className="solunar-column-note">~2 hours each, strongest activity — when the moon is overhead or underfoot.</p>
          {majors.length === 0 && <p className="feature-list-empty">None today at this location.</p>}
          <ul className="solunar-period-list">
            {majors.map((p) => (
              <li key={`${p.label}-${p.start}`} className="solunar-period-item solunar-period-major">
                <span className="solunar-period-label">{p.label}</span>
                <span className="solunar-period-time mono">{formatTimeRange(p)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card solunar-column">
          <h2>🌗 Minor Periods</h2>
          <p className="solunar-column-note">~1 hour each, secondary activity — around moonrise and moonset.</p>
          {minors.length === 0 && <p className="feature-list-empty">None today at this location.</p>}
          <ul className="solunar-period-list">
            {minors.map((p) => (
              <li key={`${p.label}-${p.start}`} className="solunar-period-item solunar-period-minor">
                <span className="solunar-period-label">{p.label}</span>
                <span className="solunar-period-time mono">{formatTimeRange(p)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Shell>
  )
}
