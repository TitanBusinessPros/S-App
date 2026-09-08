import { useEffect } from 'react'
import L from 'leaflet'
import { useMap } from 'react-leaflet'

// USGSTopo is USGS's official public-domain topographic basemap (contours,
// shaded relief, elevation-informed terrain). No API key, no billing.
// Shared by the Water & Terrain Map and the Topography Map -- same
// basemap, different purpose-built pages, promoted here rather than
// duplicated a second time.
export const TOPO_BASEMAP = {
  // Esri tile-cache URL order is z/y/x (not the usual z/x/y).
  url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}',
  attribution: 'USGS National Map — USGSTopo (public domain)',
}

export function meIcon() {
  return L.divIcon({
    html: '<span class="me-divicon" aria-label="Your location"><span class="me-divicon-pulse"></span>📍</span>',
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
  })
}

/**
 * react-leaflet's <MapContainer center=…> only sets the INITIAL camera
 * position at mount time — changing that prop later (e.g. after
 * "Re-center on me") does not pan the map. This imperatively re-centers
 * the live Leaflet instance whenever the target location actually changes.
 */
export function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lng], map.getZoom())
  }, [lat, lng, map])
  return null
}
