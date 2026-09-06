import { useEffect, useRef, useState } from 'react'
import { Shell } from '../components/Shell'
import { useGeolocation, type Coords } from '../lib/useGeolocation'
import { headingToCardinal } from '../lib/compass'
import {
  bearingDegrees,
  breadcrumbSpacingThreshold,
  distanceToTrailMeters,
  formatDistance,
  haversineMeters,
  loadBreadcrumbTrail,
  loadWaypoints,
  makeId,
  projectToLocalMeters,
  saveBreadcrumbTrail,
  saveWaypoints,
  totalTrailDistance,
  type BreadcrumbPoint,
  type Waypoint,
} from '../lib/waypoints'
import './Waypoints.css'

function formatTime(epochMs: number): string {
  return new Date(epochMs).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

interface PlotBounds {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

/** Expands `bounds` just enough to contain every point in `all`, adding
 * headroom (25% of the resulting span, floor 10m) so a bit more movement
 * in the same direction doesn't immediately force another expansion. */
function growBounds(bounds: PlotBounds | null, all: Array<{ x: number; y: number }>): PlotBounds {
  const rawMinX = Math.min(...all.map((p) => p.x))
  const rawMaxX = Math.max(...all.map((p) => p.x))
  const rawMinY = Math.min(...all.map((p) => p.y))
  const rawMaxY = Math.max(...all.map((p) => p.y))
  const marginX = Math.max((rawMaxX - rawMinX) * 0.25, 10)
  const marginY = Math.max((rawMaxY - rawMinY) * 0.25, 10)
  return {
    minX: Math.min(rawMinX - marginX, bounds?.minX ?? Infinity),
    maxX: Math.max(rawMaxX + marginX, bounds?.maxX ?? -Infinity),
    minY: Math.min(rawMinY - marginY, bounds?.minY ?? Infinity),
    maxY: Math.max(rawMaxY + marginY, bounds?.maxY ?? -Infinity),
  }
}

function TrailPlot({ trail, current }: { trail: BreadcrumbPoint[]; current: Coords }) {
  const origin = trail[0]
  const points = trail.map((p) => projectToLocalMeters(p.lat, p.lng, origin.lat, origin.lng))
  const currentPoint = projectToLocalMeters(current.lat, current.lng, origin.lat, origin.lng)
  const all = [...points, currentPoint]

  // The visible frame only ever grows (never shrinks or re-centers) to fit
  // a point that's fallen outside it — it doesn't refit tightly to your
  // exact live position on every GPS tick. Refitting on every tick was the
  // bug: while actively recording and walking somewhere new, your position
  // is almost always right at the edge of the ever-expanding trail, so a
  // tight refit keeps you in roughly the same *relative* spot in the frame
  // every render — the marker looked frozen even though its real
  // coordinate was updating correctly. Once recording stops (or whenever
  // you're moving back within already-covered ground), the frame is
  // already big enough and stays put, so movement reads clearly.
  const [bounds, setBounds] = useState<PlotBounds>(() => growBounds(null, all))
  const needsGrow =
    currentPoint.x < bounds.minX ||
    currentPoint.x > bounds.maxX ||
    currentPoint.y < bounds.minY ||
    currentPoint.y > bounds.maxY ||
    points.some((p) => p.x < bounds.minX || p.x > bounds.maxX || p.y < bounds.minY || p.y > bounds.maxY)
  useEffect(() => {
    if (needsGrow) setBounds((prev) => growBounds(prev, all))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsGrow, currentPoint.x, currentPoint.y, points.length])

  const size = 220
  const padding = 24
  const span = Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY, 1)
  const scale = (size - padding * 2) / span
  const cx = (bounds.minX + bounds.maxX) / 2
  const cy = (bounds.minY + bounds.maxY) / 2

  // SVG y grows downward; north (+y in our projection) should read as "up".
  function toSvg(p: { x: number; y: number }) {
    return { x: size / 2 + (p.x - cx) * scale, y: size / 2 + (cy - p.y) * scale }
  }

  const svgPoints = points.map(toSvg)
  const svgCurrent = toSvg(currentPoint)
  const polyline = svgPoints.map((p) => `${p.x},${p.y}`).join(' ')

  return (
    <svg className="trail-plot" viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Breadcrumb trail map">
      <rect x="0" y="0" width={size} height={size} rx="8" fill="var(--bg-elevated)" stroke="var(--border)" />
      {svgPoints.length > 1 && <polyline points={polyline} fill="none" stroke="var(--accent-2)" strokeWidth="2" />}
      <circle cx={svgPoints[0].x} cy={svgPoints[0].y} r="5" fill="var(--accent-bright)" />
      <text x={svgPoints[0].x + 8} y={svgPoints[0].y + 4} fontSize="10" fill="var(--text-dim)">Start</text>
      <circle cx={svgCurrent.x} cy={svgCurrent.y} r="5" fill="var(--accent)" />
      <text x={svgCurrent.x + 8} y={svgCurrent.y + 4} fontSize="10" fill="var(--text-dim)">You</text>
    </svg>
  )
}

export function WaypointsContent() {
  const { coords, loading: locating, error: locationError, locate } = useGeolocation()
  const [waypoints, setWaypoints] = useState<Waypoint[]>([])
  const [trail, setTrail] = useState<BreadcrumbPoint[]>([])
  const [label, setLabel] = useState('')
  const [recording, setRecording] = useState(false)
  const [trackError, setTrackError] = useState<string | null>(null)
  const [liveAccuracy, setLiveAccuracy] = useState<number | null>(null)
  const [livePosition, setLivePosition] = useState<Coords | null>(null)
  const watchIdRef = useRef<number | null>(null)
  const trailRef = useRef<BreadcrumbPoint[]>([])

  useEffect(() => {
    locate()
    setWaypoints(loadWaypoints())
    const savedTrail = loadBreadcrumbTrail()
    setTrail(savedTrail)
    trailRef.current = savedTrail
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Stop watching GPS if the user navigates away mid-recording.
  useEffect(() => {
    return () => {
      if (watchIdRef.current != null) navigator.geolocation.clearWatch(watchIdRef.current)
    }
  }, [])

  // Keep the "You" marker and "Back to start" readout live for as long as
  // there's a trail to retrace — not just while actively recording. While
  // recording, handleStartRecording's own watch already keeps livePosition
  // current, so this effect stays out of the way (the `recording` guard)
  // until you stop; the moment you do, it takes over so walking back still
  // moves the live marker instead of it freezing at whatever "coords" last
  // happened to be (the exact bug this fixes — see the root README /
  // git history around "breadcrumb" for the report that led here).
  useEffect(() => {
    if (recording || trail.length === 0) return
    if (!('geolocation' in navigator)) return
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setLivePosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy ?? null,
        })
      },
      () => {
        // Best-effort secondary watch — the main "coords" flow (via
        // useGeolocation) already surfaces permission/availability errors,
        // so this one fails silently rather than showing a second error.
      },
      { enableHighAccuracy: true },
    )
    return () => navigator.geolocation.clearWatch(id)
  }, [recording, trail.length])

  function handleDropWaypoint() {
    if (!coords) return
    const next: Waypoint = {
      id: makeId(),
      label: label.trim() || `Waypoint ${waypoints.length + 1}`,
      lat: coords.lat,
      lng: coords.lng,
      createdAt: Date.now(),
    }
    const updated = [...waypoints, next]
    setWaypoints(updated)
    saveWaypoints(updated)
    setLabel('')
  }

  function handleDeleteWaypoint(id: string) {
    const updated = waypoints.filter((w) => w.id !== id)
    setWaypoints(updated)
    saveWaypoints(updated)
  }

  function handleStartRecording() {
    if (!('geolocation' in navigator)) {
      setTrackError('Location is not available on this device.')
      return
    }
    setTrackError(null)
    setRecording(true)
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const accuracy = pos.coords.accuracy ?? null
        setLiveAccuracy(accuracy)
        setLivePosition({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy })

        const point: BreadcrumbPoint = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timestamp: Date.now(),
          accuracy,
        }
        const current = trailRef.current
        const first = current[0]

        // A phone's very first GPS fix after acquiring signal is typically
        // its worst — often 50-100+ meters off — before the receiver
        // settles. Locking that in permanently as the trail's Start point
        // makes the whole recorded line look wrong from the first segment
        // on. So while the trail is still just that first point, a later
        // fix REPLACES it instead of becoming point 2, but only when it's
        // both more accurate AND close enough to plausibly be the same
        // spot refining itself (within the old fix's own error margin) —
        // otherwise it's real movement, and falls through to the normal
        // spacing check below.
        if (
          current.length === 1 &&
          accuracy != null &&
          first.accuracy != null &&
          accuracy < first.accuracy &&
          haversineMeters(first.lat, first.lng, point.lat, point.lng) <= first.accuracy
        ) {
          trailRef.current = [point]
          setTrail([point])
          saveBreadcrumbTrail([point])
          return
        }

        const last = current[current.length - 1]
        // A GPS fix is only trustworthy to within its own reported
        // accuracy — comparing against a fixed distance regardless of
        // that (the original bug here) reads ordinary GPS jitter while
        // standing still as if you'd actually walked.
        const threshold = breadcrumbSpacingThreshold(accuracy)
        if (last && haversineMeters(last.lat, last.lng, point.lat, point.lng) < threshold) {
          return
        }
        const updated = [...current, point]
        trailRef.current = updated
        setTrail(updated)
        saveBreadcrumbTrail(updated)
      },
      () => setTrackError('Location permission was denied.'),
      { enableHighAccuracy: true },
    )
  }

  function handleStopRecording() {
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    setRecording(false)
    setLiveAccuracy(null)
  }

  function handleClearTrail() {
    handleStopRecording()
    trailRef.current = []
    setTrail([])
    saveBreadcrumbTrail([])
  }

  const trailStart = trail[0] ?? null
  const trailDistanceMeters = totalTrailDistance(trail)

  const sortedWaypoints = coords
    ? [...waypoints].sort(
        (a, b) =>
          haversineMeters(coords.lat, coords.lng, a.lat, a.lng) -
          haversineMeters(coords.lat, coords.lng, b.lat, b.lng),
      )
    : waypoints

  return (
    <>
      <div className="waypoints-header">
        <h1>📍 GPS Waypoints &amp; Trail</h1>
        <p>Drop a pin at camp or the trailhead, then find your way back — even with no signal, once saved.</p>
      </div>

      <div className="card waypoints-note">
        Waypoints and your trail are saved only on this device, not synced to your account. Breadcrumb
        recording only runs while this page stays open with your screen on — phones pause GPS tracking for
        background browser tabs, so this isn't a substitute for a dedicated GPS device on a long trip.
      </div>

      {!coords && (
        <div className="card waypoints-state">
          {locationError ? <p className="login-error">{locationError}</p> : <p>Locating you…</p>}
          <button type="button" className="btn btn-primary" onClick={locate}>
            {locating ? 'Locating…' : 'Try again'}
          </button>
        </div>
      )}

      {coords && (
        <>
          <div className="card waypoints-drop">
            <h2>Drop a Waypoint</h2>
            <p className="waypoints-coords mono">
              {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
              {coords.accuracy != null && ` · accurate to ${Math.round(coords.accuracy)} m`}
            </p>
            <div className="waypoints-drop-row">
              <input
                type="text"
                className="waypoints-input"
                placeholder="Camp, Trailhead, Vehicle…"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
              <button type="button" className="btn btn-primary" onClick={handleDropWaypoint}>
                Save Waypoint Here
              </button>
            </div>
            <button type="button" className="btn waypoints-relocate" onClick={locate} disabled={locating}>
              {locating ? 'Locating…' : '🔄 Refresh my location'}
            </button>
          </div>

          <div className="card waypoints-list-card">
            <h2>Saved Waypoints ({waypoints.length})</h2>
            {waypoints.length === 0 && <p className="waypoints-empty">No waypoints saved yet.</p>}
            <ul className="waypoints-list">
              {sortedWaypoints.map((w) => {
                const distance = haversineMeters(coords.lat, coords.lng, w.lat, w.lng)
                const bearing = bearingDegrees(coords.lat, coords.lng, w.lat, w.lng)
                return (
                  <li key={w.id} className="waypoints-list-item">
                    <div className="waypoints-list-info">
                      <span className="waypoints-list-label">{w.label}</span>
                      <span className="waypoints-list-meta">Saved {formatTime(w.createdAt)}</span>
                    </div>
                    <div className="waypoints-list-nav mono">
                      <span className="waypoints-list-distance">{formatDistance(distance)}</span>
                      <span className="waypoints-list-bearing">
                        {Math.round(bearing)}° {headingToCardinal(bearing)}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn waypoints-delete"
                      onClick={() => handleDeleteWaypoint(w.id)}
                      aria-label={`Delete ${w.label}`}
                    >
                      🗑️
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="card waypoints-trail-card">
            <h2>Breadcrumb Trail</h2>
            <p>
              Records your path as you walk so you can retrace it. A new point only counts once you've moved
              further than your phone's own GPS accuracy at that moment (at least ~50 ft) — so standing still
              won't add fake distance, even when GPS is noisy indoors or under tree cover. The trail's starting
              point also refines itself for the first few seconds if a more accurate fix comes in, since a
              phone's very first GPS reading is often its worst. The "You" marker below tracks your live position
              the whole time — including after you stop recording — so you can watch it move as you walk back
              toward Start, and "Off trail" shows how far you are from the closest point on the path you've
              already recorded (not just from the start).
            </p>

            <div className="waypoints-trail-controls">
              <button
                type="button"
                className={`btn ${recording ? 'btn-primary' : ''}`}
                onClick={recording ? handleStopRecording : handleStartRecording}
              >
                {recording ? '⏹️ Stop Recording' : '▶️ Start Recording'}
              </button>
              {trail.length > 0 && (
                <button type="button" className="btn" onClick={handleClearTrail}>
                  Clear Trail
                </button>
              )}
            </div>
            {recording && liveAccuracy != null && (
              <p className="waypoints-trail-accuracy mono">
                Current GPS accuracy: ±{formatDistance(liveAccuracy)} — points must beat that to count.
              </p>
            )}
            {trackError && <p className="login-error">{trackError}</p>}

            {trail.length > 0 && trailStart && (() => {
              // The trail map and "back to start" readout need your *live*
              // position, not the one-time fix "coords" holds — livePosition
              // is only null before the very first GPS fix of this visit
              // has arrived, so "coords" (already non-null in this branch)
              // is a safe fallback for that brief window.
              const liveCoords = livePosition ?? coords
              return (
                <>
                  <p className="waypoints-trail-stats mono">
                    {trail.length} point{trail.length === 1 ? '' : 's'} · {formatDistance(trailDistanceMeters)} walked
                  </p>

                  <p className="waypoints-trail-off mono">
                    📏 Off trail: {formatDistance(distanceToTrailMeters(liveCoords, trail))}
                  </p>

                  <p className="waypoints-trail-back mono">
                    ⬅ Back to start: {formatDistance(haversineMeters(liveCoords.lat, liveCoords.lng, trailStart.lat, trailStart.lng))}
                    {' · '}
                    {Math.round(bearingDegrees(liveCoords.lat, liveCoords.lng, trailStart.lat, trailStart.lng))}°{' '}
                    {headingToCardinal(bearingDegrees(liveCoords.lat, liveCoords.lng, trailStart.lat, trailStart.lng))}
                  </p>

                  <TrailPlot trail={trail} current={liveCoords} />
                </>
              )
            })()}
          </div>
        </>
      )}
    </>
  )
}

export function Waypoints() {
  return (
    <Shell>
      <WaypointsContent />
    </Shell>
  )
}
