import { useEffect } from 'react'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Shell } from '../components/Shell'
import { GuideDisclaimer } from '../components/GuideDisclaimer'
import { useGeolocation } from '../lib/useGeolocation'
import { TOPO_BASEMAP, meIcon, RecenterMap } from '../lib/leafletTopo'
import {
  CONTOUR_BASICS,
  TERRAIN_SHAPES,
  SLOPE_AND_STEEPNESS,
  PRACTICAL_USES,
  COMMON_MISTAKES,
  type TopoGuideSection,
} from '../lib/topoGuideData'
import '../components/GuidePage.css'
import './TopographyMap.css'

// Continental US -- shown before a location is available, same fallback
// spirit as MapWater/Map3D use.
const FALLBACK_CENTER: [number, number] = [39.5, -98.35]

function GuideRuleSection({ id, heading, sections }: { id: string; heading: string; sections: TopoGuideSection[] }) {
  return (
    <section id={id} className="guide-section card">
      <h2>{heading}</h2>
      {sections.map((section) => (
        <div key={section.title} className="topo-guide-rule">
          <span className="topo-guide-subheading">{section.title}</span>
          <ul>
            {section.bullets.map((bullet, i) => (
              <li key={i}>{bullet}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}

export function TopographyMap() {
  const { coords, loading: locating, error: locationError, locate } = useGeolocation()

  useEffect(() => {
    locate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const center = coords ? ([coords.lat, coords.lng] as [number, number]) : FALLBACK_CENTER

  return (
    <Shell>
      <div className="guide-header">
        <h1>Topography Map</h1>
        <p>
          The same public-domain USGS topographic basemap used on the Water & Terrain Map, centered on your
          location — plus a full guide to actually reading what the contour lines are showing you.
        </p>
      </div>

      <GuideDisclaimer>
        This map shows terrain contours for general orientation — it is not a substitute for a real topographic
        map, compass, and training when route-finding matters.
      </GuideDisclaimer>

      <nav className="guide-nav" aria-label="Jump to a section">
        <a href="#topo-basics" className="guide-nav-link">📏 Basics</a>
        <a href="#topo-shapes" className="guide-nav-link">⛰️ Terrain Shapes</a>
        <a href="#topo-slope" className="guide-nav-link">📐 Slope</a>
        <a href="#topo-uses" className="guide-nav-link">🥾 Practical Uses</a>
        <a href="#topo-mistakes" className="guide-nav-link">⚠️ Common Mistakes</a>
      </nav>

      <div className="card topo-map-card">
        <MapContainer center={center} zoom={13} scrollWheelZoom>
          <RecenterMap lat={center[0]} lng={center[1]} />
          <TileLayer attribution={TOPO_BASEMAP.attribution} url={TOPO_BASEMAP.url} />
          {coords && (
            <Marker position={[coords.lat, coords.lng]} icon={meIcon()} zIndexOffset={1000}>
              <Popup>
                <strong>You are here</strong>
                {coords.accuracy != null && (
                  <>
                    <br />
                    Accurate to within {Math.round(coords.accuracy)} m
                  </>
                )}
              </Popup>
            </Marker>
          )}
        </MapContainer>
        <button type="button" className="btn topo-map-recenter" onClick={locate} disabled={locating}>
          {locating ? 'Locating…' : 'Re-center on me'}
        </button>
        {locationError && <p className="login-error topo-map-location-error">{locationError}</p>}
      </div>

      <div className="guide-sections">
        <GuideRuleSection id="topo-basics" heading="📏 Contour Line Basics" sections={CONTOUR_BASICS} />
        <GuideRuleSection id="topo-shapes" heading="⛰️ Reading Terrain Shapes" sections={TERRAIN_SHAPES} />
        <GuideRuleSection id="topo-slope" heading="📐 Slope & Steepness" sections={SLOPE_AND_STEEPNESS} />
        <GuideRuleSection id="topo-uses" heading="🥾 Practical Uses" sections={PRACTICAL_USES} />
        <GuideRuleSection id="topo-mistakes" heading="⚠️ Common Mistakes" sections={COMMON_MISTAKES} />
      </div>
    </Shell>
  )
}
