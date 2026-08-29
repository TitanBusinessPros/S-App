import { useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { MapContainer, TileLayer, Circle, Marker, Popup } from 'react-leaflet'
import { Shell } from '../components/Shell'
import { useGeolocation } from '../lib/useGeolocation'
import { fetchWaterFeatures } from '../lib/functionsApi'
import {
  DEFAULT_RADIUS_MILES,
  MIN_RADIUS_MILES,
  MAX_RADIUS_MILES,
  waterTypeIcon,
  waterTypeLabel,
  type WaterFeature,
} from '../lib/water'
import './MapWater.css'

const MILES_TO_METERS = 1609.344

function waterIcon(type: WaterFeature['waterType']) {
  return L.divIcon({
    html: `<span class="water-divicon">${waterTypeIcon(type)}</span>`,
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })
}

export function MapWater() {
  const { coords, loading: locating, error: locationError, locate } = useGeolocation()
  const [radiusMiles, setRadiusMiles] = useState(DEFAULT_RADIUS_MILES)
  const [features, setFeatures] = useState<WaterFeature[]>([])
  const [truncated, setTruncated] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    locate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!coords) return

    let cancelled = false
    setFetching(true)
    setFetchError(null)

    fetchWaterFeatures(coords.lat, coords.lng, radiusMiles)
      .then((result) => {
        if (cancelled) return
        setFeatures(result.features)
        setTruncated(result.truncated)
      })
      .catch(() => {
        if (cancelled) return
        setFetchError('Could not load water data. Try again in a moment.')
      })
      .finally(() => {
        if (!cancelled) setFetching(false)
      })

    return () => {
      cancelled = true
    }
  }, [coords, radiusMiles])

  return (
    <Shell>
      <div className="map-header">
        <h1>Water & Terrain Map</h1>
        <p>Ponds, creeks, rivers, and lakes near you — adjust the radius to search wider or narrower.</p>
      </div>

      <div className="map-controls">
        <div className="radius-control">
          <label htmlFor="radius">Search radius</label>
          <input
            id="radius"
            type="range"
            min={MIN_RADIUS_MILES}
            max={MAX_RADIUS_MILES}
            value={radiusMiles}
            onChange={(e) => setRadiusMiles(Number(e.target.value))}
          />
          <span className="radius-value mono">{radiusMiles} mi</span>
        </div>
        <button type="button" className="btn" onClick={locate} disabled={locating}>
          {locating ? 'Locating…' : coords ? 'Re-center on me' : 'Use my location'}
        </button>
      </div>

      <div className="map-layout">
        <div className="card map-card">
          {coords ? (
            <MapContainer center={[coords.lat, coords.lng]} zoom={11} scrollWheelZoom>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Circle
                center={[coords.lat, coords.lng]}
                radius={radiusMiles * MILES_TO_METERS}
                pathOptions={{ color: '#e8a33d', fillOpacity: 0.05, weight: 1.5 }}
              />
              {features.map((f) => (
                <Marker key={f.id} position={[f.lat, f.lng]} icon={waterIcon(f.waterType)}>
                  <Popup>
                    <strong>{f.name ?? waterTypeLabel(f.waterType)}</strong>
                    <br />
                    {waterTypeLabel(f.waterType)}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <div className="map-placeholder">
              {locationError ? (
                <p className="login-error">{locationError}</p>
              ) : (
                <p>Locating you…</p>
              )}
              <button type="button" className="btn btn-primary" onClick={locate}>
                Try again
              </button>
            </div>
          )}
        </div>

        <div className="card feature-list-card">
          <h2>
            {fetching
              ? 'Searching…'
              : `${features.length} water source${features.length === 1 ? '' : 's'} found`}
          </h2>

          {fetchError && <p className="login-error">{fetchError}</p>}
          {truncated && (
            <p className="map-truncated-note">
              Showing the first 500 results — narrow the radius to see everything nearby.
            </p>
          )}

          {!fetching && !fetchError && features.length === 0 && (
            <p className="feature-list-empty">No water sources found in this radius. Try widening it.</p>
          )}

          <ul className="feature-list">
            {features.map((f) => (
              <li key={f.id} className="feature-list-item">
                <span>{waterTypeIcon(f.waterType)}</span>
                <span className="feature-list-name">{f.name ?? `Unnamed ${waterTypeLabel(f.waterType).toLowerCase()}`}</span>
                <span className="feature-list-type">{waterTypeLabel(f.waterType)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Shell>
  )
}
