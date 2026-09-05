// Pure GPS math + localStorage persistence for the Waypoints & Breadcrumb
// Trail feature. Deliberately no Firestore/Cloud Function involvement —
// this is a device-only tool (see the page's own note to the user about
// that), so there's nothing here that costs anything to run.

export interface Waypoint {
  id: string
  label: string
  lat: number
  lng: number
  createdAt: number
}

export interface BreadcrumbPoint {
  lat: number
  lng: number
  timestamp: number
  /** The GPS fix's own reported accuracy (meters) when this point was
   * recorded, if known — used to refine a trail's starting point away from
   * a bad first fix (see handleStartRecording in Waypoints.tsx). Optional
   * because trails saved before this field existed won't have it. */
  accuracy?: number | null
}

const WAYPOINTS_KEY = 'survivalday:waypoints'
const TRAIL_KEY = 'survivalday:breadcrumbTrail'

function readJson<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined') return fallback
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    // Private browsing / storage blocked / corrupted value — fall back
    // rather than crash the page.
    return fallback
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore — worst case this session's changes just don't persist.
  }
}

export function loadWaypoints(): Waypoint[] {
  return readJson<Waypoint[]>(WAYPOINTS_KEY, [])
}

export function saveWaypoints(waypoints: Waypoint[]): void {
  writeJson(WAYPOINTS_KEY, waypoints)
}

export function loadBreadcrumbTrail(): BreadcrumbPoint[] {
  return readJson<BreadcrumbPoint[]>(TRAIL_KEY, [])
}

export function saveBreadcrumbTrail(trail: BreadcrumbPoint[]): void {
  writeJson(TRAIL_KEY, trail)
}

export function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

const EARTH_RADIUS_METERS = 6_371_000

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180
}

/** Great-circle distance between two lat/lng points, in meters. */
export function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.min(1, Math.sqrt(a)))
}

/** Initial compass bearing (0-360, 0 = north) from point 1 toward point 2. */
export function bearingDegrees(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const phi1 = toRadians(lat1)
  const phi2 = toRadians(lat2)
  const deltaLng = toRadians(lng2 - lng1)
  const y = Math.sin(deltaLng) * Math.cos(phi2)
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLng)
  const theta = Math.atan2(y, x)
  return ((theta * 180) / Math.PI + 360) % 360
}

const METERS_PER_MILE = 1609.344
const METERS_PER_FOOT = 0.3048
const FEET_PER_MILE = METERS_PER_MILE / METERS_PER_FOOT

/** Imperial, matching the rest of the app (mph, °F, inches): feet under a
 * tenth of a mile, miles beyond that. */
export function formatDistance(meters: number): string {
  const feet = meters / METERS_PER_FOOT
  if (feet < FEET_PER_MILE / 10) return `${Math.round(feet)} ft`
  return `${(meters / METERS_PER_MILE).toFixed(2)} mi`
}

/** Floor for how far you must move before a new breadcrumb point counts —
 * combined with breadcrumbSpacingThreshold below, this is what stops
 * standing still from reading as "you walked N feet" when the phone's own
 * GPS jitters from one fix to the next. */
export const MIN_BREADCRUMB_SPACING_METERS = 15

/**
 * How far you need to move from the last recorded point before a new one
 * counts, given the current fix's own reported accuracy. A GPS fix's
 * accuracy is the radius of uncertainty around it — two fixes closer
 * together than that can't be told apart from noise, so the threshold
 * rises to match whenever the phone reports worse accuracy than the floor
 * (common indoors, in trees, or between buildings).
 */
export function breadcrumbSpacingThreshold(accuracyMeters: number | null): number {
  return Math.max(MIN_BREADCRUMB_SPACING_METERS, accuracyMeters ?? 0)
}

/** Sum of consecutive-point distances along a trail, in meters. */
export function totalTrailDistance(points: BreadcrumbPoint[]): number {
  let total = 0
  for (let i = 1; i < points.length; i++) {
    total += haversineMeters(points[i - 1].lat, points[i - 1].lng, points[i].lat, points[i].lng)
  }
  return total
}

/**
 * Flat-earth approximation of a lat/lng point's position relative to an
 * origin, in meters (x = east, y = north). Only meant for plotting a short
 * breadcrumb trail on screen — accurate enough over a few miles, not meant
 * for anything requiring real geodesy.
 */
export function projectToLocalMeters(
  lat: number,
  lng: number,
  originLat: number,
  originLng: number,
): { x: number; y: number } {
  const metersPerDegLat = 110_540
  const metersPerDegLng = 111_320 * Math.cos(toRadians(originLat))
  return {
    x: (lng - originLng) * metersPerDegLng,
    y: (lat - originLat) * metersPerDegLat,
  }
}

/** Shortest distance from point `p` to the line segment a-b, in the same
 * flat local-meters space as projectToLocalMeters. Standard vector
 * projection, clamped to the segment (not the infinite line) so the
 * closest point can't fall past either endpoint. */
function pointToSegmentDistance(
  p: { x: number; y: number },
  a: { x: number; y: number },
  b: { x: number; y: number },
): number {
  const abx = b.x - a.x
  const aby = b.y - a.y
  const abLengthSq = abx * abx + aby * aby
  const t = abLengthSq === 0 ? 0 : Math.max(0, Math.min(1, ((p.x - a.x) * abx + (p.y - a.y) * aby) / abLengthSq))
  const closestX = a.x + t * abx
  const closestY = a.y + t * aby
  return Math.hypot(p.x - closestX, p.y - closestY)
}

/**
 * How far `point` is from the nearest spot on the recorded trail — i.e.
 * "how many feet off the path am I," as distinct from totalTrailDistance
 * (how far you've walked) or a straight line back to the start point
 * (which reads near-zero on a loop trail even if you'd wandered far from
 * the path mid-walk). Checks every segment of the trail and returns the
 * smallest distance to any of them, in meters.
 */
export function distanceToTrailMeters(point: { lat: number; lng: number }, trail: BreadcrumbPoint[]): number {
  if (trail.length === 0) return 0
  const origin = trail[0]
  const localPoint = projectToLocalMeters(point.lat, point.lng, origin.lat, origin.lng)
  const localTrail = trail.map((p) => projectToLocalMeters(p.lat, p.lng, origin.lat, origin.lng))

  if (localTrail.length === 1) return Math.hypot(localPoint.x - localTrail[0].x, localPoint.y - localTrail[0].y)

  let closest = Infinity
  for (let i = 1; i < localTrail.length; i++) {
    closest = Math.min(closest, pointToSegmentDistance(localPoint, localTrail[i - 1], localTrail[i]))
  }
  return closest
}
