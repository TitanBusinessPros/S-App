import { useEffect, useRef, useState } from 'react'
import { Map as MaplibreMap, NavigationControl } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Shell } from '../components/Shell'
import { useGeolocation } from '../lib/useGeolocation'
import './MapWater.css' // shared .map-header / .map-disclosure styles
import './Map3D.css'

// Same OpenFreeMap style + tile service the "street" basemap used, but this
// page talks to it via plain MapLibre GL directly instead of the MapLibre
// GL Leaflet binding -- that binding is what broke (a canvas-sizing race
// condition on mount, see git history) and it also flatly can't do
// pitch/bearing at all ("No rotation / bearing / pitch support" per its own
// docs), which a 3D view requires. Plain MapLibre GL is the standard,
// most-tested way to use this style and has none of that binding's
// limitations. Verified against OpenFreeMap's ToS already (see the
// removed OpenFreeMapLayer's history) -- no non-commercial restriction.
const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty'

// A tilted pitch + rotated bearing is what makes an ordinary vector-tile
// style read as "3D" -- buildings in the Liberty style already have
// extrusion height data, it just isn't visually obvious from a flat
// straight-down view. These values match OpenFreeMap's own "3D" demo
// button (openfreemap.org's map.js) applied to wherever the user actually
// is, instead of the demo's fixed London coordinates.
const DEFAULT_PITCH = 60
const DEFAULT_BEARING = 55.2
const DEFAULT_ZOOM = 16

// Fallback center (continental US) if location is denied/unavailable --
// still shows a usable, if arbitrary, 3D view rather than nothing.
const FALLBACK_CENTER: [number, number] = [-98.35, 39.5]

export function Map3D() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<MaplibreMap | null>(null)
  const { coords, loading: locating, error: locationError, locate } = useGeolocation()
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    locate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Created once, recentered imperatively when a location arrives -- same
  // pattern as MapWater's RecenterMap, so an initial "locating..." state
  // doesn't force tearing the whole map down and rebuilding it.
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const map = new MaplibreMap({
      container: mapContainerRef.current,
      style: STYLE_URL,
      center: coords ? [coords.lng, coords.lat] : FALLBACK_CENTER,
      zoom: coords ? DEFAULT_ZOOM : 4,
      pitch: coords ? DEFAULT_PITCH : 0,
      bearing: coords ? DEFAULT_BEARING : 0,
    })
    map.addControl(new NavigationControl({ visualizePitch: true }), 'top-right')
    map.on('load', () => setMapReady(true))
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fly to the user's real position once it's known, tilted into the 3D
  // view -- covers both the initial locate() and pressing "Re-center on me".
  useEffect(() => {
    if (!coords || !mapRef.current) return
    mapRef.current.flyTo({
      center: [coords.lng, coords.lat],
      zoom: DEFAULT_ZOOM,
      pitch: DEFAULT_PITCH,
      bearing: DEFAULT_BEARING,
      essential: true,
    })
  }, [coords])

  return (
    <Shell>
      <div className="map-header">
        <h1>3D Maps</h1>
        <p>A tilted, rotatable 3D view of your area — drag to look around, or use the compass to reset.</p>
      </div>

      <p className="map-disclosure">
        Buildings and terrain are shown at an angle for depth, not to scale with real elevation.
      </p>

      <div className="card map3d-card">
        <div ref={mapContainerRef} className="map3d-container" />
        {!mapReady && (
          <div className="map3d-overlay">
            {locationError ? (
              <>
                <p className="login-error">{locationError}</p>
                <button type="button" className="btn btn-primary" onClick={locate}>
                  Try again
                </button>
              </>
            ) : (
              <p className="mono">{locating ? 'Locating…' : 'Loading map…'}</p>
            )}
          </div>
        )}
        <button type="button" className="btn map3d-recenter" onClick={locate} disabled={locating}>
          {locating ? 'Locating…' : 'Re-center on me'}
        </button>
      </div>
    </Shell>
  )
}
