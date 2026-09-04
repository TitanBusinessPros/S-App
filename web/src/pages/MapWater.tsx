import { useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet'
import { Shell } from '../components/Shell'
import { useAuth } from '../lib/AuthContext'
import { useGeolocation } from '../lib/useGeolocation'
import { useOnlineStatus } from '../lib/useOnlineStatus'
import { fetchWaterFeatures } from '../lib/functionsApi'
import {
  DEFAULT_RADIUS_MILES,
  MIN_RADIUS_MILES,
  MAX_RADIUS_MILES,
  USGS_COVERAGE_NOTE,
  OFFLINE_SCOPE_NOTE,
  waterTypeIcon,
  waterTypeLabel,
  type WaterFeature,
  type GetWaterFeaturesResult,
} from '../lib/water'
import {
  computeCacheKey,
  findSavedAreaFor,
  isSavedAreaStale,
  removeSavedWaterArea,
  saveWaterAreaOffline,
  useSavedWaterAreas,
  type SavedWaterArea,
} from '../lib/savedWaterAreas'
import './MapWater.css'

const MILES_TO_METERS = 1609.344

type BasemapStyle = 'street' | 'topo'

// USGSTopo is USGS's official public-domain topographic basemap (contours,
// shaded relief, elevation-informed terrain) — same National Map family as
// the water data already used here. No API key, no billing: verified live
// (a direct tile fetch succeeded) before wiring this in.
const BASEMAPS: Record<BasemapStyle, { url: string; attribution: string; label: string }> = {
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    label: 'Street map',
  },
  topo: {
    // Esri tile-cache URL order is z/y/x (not the usual z/x/y).
    url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}',
    attribution: 'USGS National Map — USGSTopo (public domain)',
    label: 'Topographic map',
  },
}

function waterIcon(type: WaterFeature['waterType']) {
  return L.divIcon({
    html: `<span class="water-divicon">${waterTypeIcon(type)}</span>`,
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })
}

function meIcon() {
  return L.divIcon({
    html: '<span class="me-divicon" aria-label="Your location"><span class="me-divicon-pulse"></span>📍</span>',
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
  })
}

/**
 * react-leaflet's <MapContainer center=…> only sets the INITIAL camera
 * position at mount time — changing that prop later (e.g. after "Re-center
 * on me" or opening a saved area) does not pan the map. This imperatively
 * re-centers the live Leaflet instance whenever the target location
 * actually changes, so new markers end up on-screen instead of off in an
 * unmoved viewport.
 */
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lng], map.getZoom())
  }, [lat, lng, map])
  return null
}

function formatDate(epochMs: number): string {
  return new Date(epochMs).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

type ResultMeta = Pick<
  GetWaterFeaturesResult,
  | 'count'
  | 'totalFound'
  | 'searchedRadiusMiles'
  | 'resultComplete'
  | 'source'
  | 'attribution'
  | 'sourceRefreshDate'
  | 'fetchedAt'
  | 'fromCache'
>

/** Which state banner the page is currently showing. */
type ViewState = 'live' | 'cache' | 'offline-saved' | 'offline-stale' | 'offline-empty' | null

export function MapWater() {
  const { user } = useAuth()
  const uid = user?.uid ?? null
  const online = useOnlineStatus()
  const { coords, loading: locating, error: locationError, locate } = useGeolocation()
  const { areas: savedAreas, loading: savedAreasLoading } = useSavedWaterAreas(uid)

  const [radiusMiles, setRadiusMiles] = useState(DEFAULT_RADIUS_MILES)
  const [features, setFeatures] = useState<WaterFeature[]>([])
  const [resultMeta, setResultMeta] = useState<ResultMeta | null>(null)
  const [viewState, setViewState] = useState<ViewState>(null)
  const [fetching, setFetching] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [refreshingAreaId, setRefreshingAreaId] = useState<string | null>(null)
  const [confirmingRemoveId, setConfirmingRemoveId] = useState<string | null>(null)
  const [confirmRemoveText, setConfirmRemoveText] = useState('')
  const [basemapStyle, setBasemapStyle] = useState<BasemapStyle>('street')

  // "Open" from the saved-areas list overrides the live GPS-driven view
  // with a specific saved area's stored data, regardless of current
  // location — this is the only way to view a saved area offline.
  const [viewingSavedArea, setViewingSavedArea] = useState<SavedWaterArea | null>(null)

  // Where the map camera is panned to. Separate from which water markers
  // are shown (viewingSavedArea) so "Re-center on me" can move the camera
  // to your live position WITHOUT clearing a saved area's water pins —
  // that's what lets the "You are here" marker and saved water show
  // together, so you can see your position relative to the saved water.
  const [cameraCenter, setCameraCenter] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    locate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Every successful locate() (the initial one, or "Re-center on me") pans
  // the camera to the fresh position. Opening a saved area (below) can
  // still separately pin the camera to that area's location.
  useEffect(() => {
    if (coords) setCameraCenter({ lat: coords.lat, lng: coords.lng })
  }, [coords])

  // Online fetch — never runs while offline or while viewing a pinned saved area.
  useEffect(() => {
    if (!coords || !online || viewingSavedArea) return

    let cancelled = false
    setFetching(true)
    setFetchError(null)

    fetchWaterFeatures(coords.lat, coords.lng, radiusMiles)
      .then((result) => {
        if (cancelled) return
        setFeatures(result.features)
        setResultMeta(result)
        setViewState(result.fromCache ? 'cache' : 'live')
        setSaveStatus('idle')
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
  }, [coords, radiusMiles, online, viewingSavedArea])

  // Offline rendering — shows a matching saved area for the current
  // location/radius, or the honest "nothing saved here" empty state.
  // Never attempts a network call.
  useEffect(() => {
    if (!coords || online || viewingSavedArea) return

    const match = findSavedAreaFor(savedAreas, coords.lat, coords.lng, radiusMiles)
    if (match) {
      setFeatures(match.features)
      setResultMeta({
        count: match.count,
        totalFound: match.totalFound,
        searchedRadiusMiles: match.searchedRadiusMiles,
        resultComplete: match.resultComplete,
        source: match.source,
        attribution: match.attribution,
        sourceRefreshDate: match.sourceRefreshDate,
        fetchedAt: match.fetchedAt,
        fromCache: true,
      })
      setViewState(isSavedAreaStale(match) ? 'offline-stale' : 'offline-saved')
    } else {
      setFeatures([])
      setResultMeta(null)
      setViewState('offline-empty')
    }
  }, [coords, radiusMiles, online, savedAreas, viewingSavedArea])

  // Viewing a pinned saved area overrides everything above.
  useEffect(() => {
    if (!viewingSavedArea) return
    setFeatures(viewingSavedArea.features)
    setResultMeta({
      count: viewingSavedArea.count,
      totalFound: viewingSavedArea.totalFound,
      searchedRadiusMiles: viewingSavedArea.searchedRadiusMiles,
      resultComplete: viewingSavedArea.resultComplete,
      source: viewingSavedArea.source,
      attribution: viewingSavedArea.attribution,
      sourceRefreshDate: viewingSavedArea.sourceRefreshDate,
      fetchedAt: viewingSavedArea.fetchedAt,
      fromCache: true,
    })
    setViewState(isSavedAreaStale(viewingSavedArea) ? 'offline-stale' : 'offline-saved')
  }, [viewingSavedArea])

  const mapCenter = cameraCenter ?? coords

  const currentCacheKey = coords ? computeCacheKey(coords.lat, coords.lng, radiusMiles) : null
  const alreadySavedCurrent = savedAreas.some((a) => a.cacheKey === currentCacheKey)

  async function handleSaveOffline() {
    if (!uid || !coords || !resultMeta) return
    setSaveStatus('saving')
    try {
      await saveWaterAreaOffline(uid, {
        lat: coords.lat,
        lng: coords.lng,
        radiusMiles,
        result: {
          features,
          radiusMiles,
          searchedRadiusMiles: resultMeta.searchedRadiusMiles,
          count: resultMeta.count,
          totalFound: resultMeta.totalFound,
          resultComplete: resultMeta.resultComplete,
          source: resultMeta.source,
          attribution: resultMeta.attribution,
          sourceRefreshDate: resultMeta.sourceRefreshDate,
          fetchedAt: resultMeta.fetchedAt,
          fromCache: resultMeta.fromCache,
        },
      })
      setSaveStatus('saved')
    } catch {
      setSaveStatus('idle')
    }
  }

  async function handleRefresh(area: SavedWaterArea) {
    if (!uid || !online) return
    setRefreshingAreaId(area.id)
    try {
      const result = await fetchWaterFeatures(area.lat, area.lng, area.radiusMiles)
      await saveWaterAreaOffline(uid, { lat: area.lat, lng: area.lng, radiusMiles: area.radiusMiles, result })
      if (viewingSavedArea?.id === area.id) {
        setViewingSavedArea({ ...area, ...result, id: area.id, cacheKey: area.cacheKey, lat: area.lat, lng: area.lng, savedAt: Date.now() })
      }
    } catch {
      // Leave the existing saved copy untouched on failure.
    } finally {
      setRefreshingAreaId(null)
    }
  }

  function beginRemoveConfirm(areaId: string) {
    setConfirmingRemoveId(areaId)
    setConfirmRemoveText('')
  }

  function cancelRemoveConfirm() {
    setConfirmingRemoveId(null)
    setConfirmRemoveText('')
  }

  async function handleRemove(area: SavedWaterArea) {
    if (!uid) return
    await removeSavedWaterArea(uid, area.id)
    if (viewingSavedArea?.id === area.id) setViewingSavedArea(null)
    if (confirmingRemoveId === area.id) {
      setConfirmingRemoveId(null)
      setConfirmRemoveText('')
    }
  }

  return (
    <Shell>
      <div className="map-header">
        <h1>Water & Terrain Map</h1>
        <p>Rivers, canals, lake-class waterbodies, springs, and drainageways near you.</p>
      </div>

      <p className="map-disclosure">{USGS_COVERAGE_NOTE}</p>
      {!online && <p className="map-disclosure map-disclosure-offline">📴 You're offline. {OFFLINE_SCOPE_NOTE}</p>}

      <div className="map-controls">
        <div className="radius-control">
          <label htmlFor="radius">Search radius</label>
          <input
            id="radius"
            type="range"
            min={MIN_RADIUS_MILES}
            max={MAX_RADIUS_MILES}
            value={radiusMiles}
            disabled={!!viewingSavedArea}
            onChange={(e) => setRadiusMiles(Number(e.target.value))}
          />
          <span className="radius-value mono">{radiusMiles} mi</span>
        </div>
        <button type="button" className="btn" onClick={locate} disabled={locating}>
          {locating ? 'Locating…' : coords ? 'Re-center on me' : 'Use my location'}
        </button>

        {online && !viewingSavedArea && !fetching && !fetchError && resultMeta && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSaveOffline}
            disabled={saveStatus === 'saving'}
          >
            {saveStatus === 'saving'
              ? 'Saving…'
              : saveStatus === 'saved'
                ? `✓ Saved — click to update again`
                : alreadySavedCurrent
                  ? `Update saved copy (${radiusMiles} mi, ${resultMeta.count} features)`
                  : `💾 Save this area for offline use (${radiusMiles} mi, ${resultMeta.count} features)`}
          </button>
        )}
      </div>
      {online && !viewingSavedArea && !fetching && !fetchError && resultMeta && (
        <p className="save-hint">
          Saving captures exactly what's shown now, at this radius. Widen or narrow the radius and save again to
          capture a different area size.
        </p>
      )}
      {viewingSavedArea && (
        <p className="map-disclosure">
          📍 Showing saved water data — "Re-center on me" moves the map to your live position without losing it.
        </p>
      )}

      {viewState && resultMeta && (
        <div className={`card status-banner status-${viewState}`}>
          {viewState === 'live' && <span>🟢 Live from USGS 3DHP</span>}
          {viewState === 'cache' && <span>🔵 From shared cache</span>}
          {viewState === 'offline-saved' && <span>📴 Offline saved data</span>}
          {viewState === 'offline-stale' && <span>📴 Offline saved data (may be out of date)</span>}
          <span className="status-banner-meta">
            {resultMeta.resultComplete
              ? `${resultMeta.count} feature${resultMeta.count === 1 ? '' : 's'} found`
              : `Showing the ${resultMeta.count} closest of ${resultMeta.totalFound}+ found within ${resultMeta.searchedRadiusMiles} mi`}
            {' · '}Updated {formatDate(resultMeta.fetchedAt)}
          </span>
          <span className="status-banner-attribution">{resultMeta.attribution}</span>
        </div>
      )}

      {viewState === 'offline-empty' && (
        <div className="card status-banner status-offline-empty">
          <span>📴 No offline data for this area</span>
          <span className="status-banner-meta">{OFFLINE_SCOPE_NOTE}</span>
        </div>
      )}

      <div className="map-layout">
        <div className="card map-card">
          {mapCenter ? (
            <MapContainer center={[mapCenter.lat, mapCenter.lng]} zoom={11} scrollWheelZoom>
              <RecenterMap lat={mapCenter.lat} lng={mapCenter.lng} />
              <TileLayer
                key={basemapStyle}
                attribution={BASEMAPS[basemapStyle].attribution}
                url={BASEMAPS[basemapStyle].url}
              />
              <button
                type="button"
                className="btn basemap-toggle"
                onClick={() => setBasemapStyle((s) => (s === 'street' ? 'topo' : 'street'))}
              >
                {basemapStyle === 'street' ? '⛰️ Topo view' : '🗺️ Street view'}
              </button>
              {!viewingSavedArea && (
                <Circle
                  center={[mapCenter.lat, mapCenter.lng]}
                  radius={radiusMiles * MILES_TO_METERS}
                  pathOptions={{ color: '#e8a33d', fillOpacity: 0.05, weight: 1.5 }}
                />
              )}
              {coords?.accuracy != null && (
                <Circle
                  center={[coords.lat, coords.lng]}
                  radius={coords.accuracy}
                  pathOptions={{ color: '#4f8adf', fillColor: '#4f8adf', fillOpacity: 0.15, weight: 1 }}
                />
              )}
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

          {viewingSavedArea && (
            <button
              type="button"
              className="btn"
              onClick={() => {
                setViewingSavedArea(null)
                if (coords) setCameraCenter({ lat: coords.lat, lng: coords.lng })
              }}
            >
              ← Back to my location
            </button>
          )}

          {!fetching && !fetchError && features.length === 0 && viewState !== 'offline-empty' && (
            <p className="feature-list-empty">No water sources found in this radius. Try widening it.</p>
          )}

          <ul className="feature-list">
            {features.map((f) => (
              <li key={f.id} className="feature-list-item">
                <span>{waterTypeIcon(f.waterType)}</span>
                <span className="feature-list-name">{f.name ?? `Unnamed ${waterTypeLabel(f.waterType).toLowerCase()}`}</span>
                <span className="feature-list-type">{waterTypeLabel(f.waterType)}</span>
                <span className="feature-list-distance mono">{f.distanceMiles.toFixed(1)} mi</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card offline-areas-card">
        <h2>Offline areas</h2>
        <p className="offline-areas-note">{OFFLINE_SCOPE_NOTE}</p>

        {savedAreasLoading && <p>Loading…</p>}
        {!savedAreasLoading && savedAreas.length === 0 && <p className="feature-list-empty">No areas saved yet.</p>}

        <ul className="offline-areas-list">
          {savedAreas.map((area) => {
            const stale = isSavedAreaStale(area)
            return (
              <li key={area.id} className="offline-areas-item">
                <div className="offline-areas-item-info">
                  <span className="offline-areas-item-label">{area.label}</span>
                  <span className="offline-areas-item-meta">
                    {area.resultComplete ? `${area.count} features` : `${area.count} closest of ${area.totalFound}+`}
                    {' · '}Saved {formatDate(area.savedAt)}
                    {stale && ' · may be out of date'}
                  </span>
                </div>
                <div className="offline-areas-item-actions">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => {
                      setViewingSavedArea(area)
                      setCameraCenter({ lat: area.lat, lng: area.lng })
                    }}
                  >
                    Open
                  </button>
                  <div className="offline-areas-item-actions-pair">
                    <button
                      type="button"
                      className="btn"
                      onClick={() => handleRefresh(area)}
                      disabled={!online || refreshingAreaId === area.id}
                    >
                      {refreshingAreaId === area.id ? 'Refreshing…' : 'Refresh'}
                    </button>
                    <button type="button" className="btn btn-danger" onClick={() => beginRemoveConfirm(area.id)}>
                      Remove
                    </button>
                  </div>
                </div>

                {confirmingRemoveId === area.id && (
                  <div className="offline-areas-confirm-remove">
                    <p>
                      Are you sure you want to delete this water area? Type <strong>1234</strong> to delete forever.
                    </p>
                    <div className="offline-areas-confirm-remove-row">
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        className="offline-areas-confirm-input"
                        placeholder="1234"
                        value={confirmRemoveText}
                        onChange={(e) => setConfirmRemoveText(e.target.value)}
                      />
                      <button type="button" className="btn" onClick={cancelRemoveConfirm}>
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        disabled={confirmRemoveText !== '1234'}
                        onClick={() => handleRemove(area)}
                      >
                        Delete forever
                      </button>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </Shell>
  )
}
