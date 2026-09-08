// Solunar activity calculator -- based on John Alden Knight's solunar
// theory (published 1926, long public domain): wildlife/fish activity is
// theorized to peak around four daily lunar events -- the moon transiting
// directly overhead and directly underfoot (major periods, ~2h each) and
// moonrise/moonset (minor periods, ~1h each).
//
// The theory itself is a century-old public idea, not anyone's property.
// The moon-position math below is this app's own implementation of the
// standard, publicly-documented low-precision orbital-mechanics method
// taught in amateur astronomy (the same style of formulas behind most
// "compute the moon's position" tutorials and public-domain reference
// pages) -- not adapted from any specific commercial solunar app or
// calculator. It deliberately skips the ~20 minor lunar perturbation
// terms a full-precision ephemeris would include, trading some accuracy
// for a small, verifiable implementation: expect event times to land
// within roughly 30-60 minutes of a precision almanac, not to the minute.

const DEG = Math.PI / 180
const RAD = 180 / Math.PI

function sinD(deg: number) {
  return Math.sin(deg * DEG)
}
function cosD(deg: number) {
  return Math.cos(deg * DEG)
}
function atan2D(y: number, x: number) {
  return Math.atan2(y, x) * RAD
}
function asinD(x: number) {
  return Math.asin(x) * RAD
}

function norm360(deg: number): number {
  const d = deg % 360
  return d < 0 ? d + 360 : d
}

/** Signed hour angle in (-180, 180]. */
function normHourAngle(deg: number): number {
  return ((((deg + 180) % 360) + 360) % 360) - 180
}

/** Days since 2000 Jan 0.0 UT (JD 2451543.5) -- the epoch these orbital elements are anchored to. */
function daysSinceEpoch(date: Date): number {
  return date.getTime() / 86_400_000 - 10_956
}

function eccentricAnomaly(mDeg: number, e: number): number {
  const mRad = mDeg * DEG
  let E = mDeg + RAD * e * Math.sin(mRad) * (1 + e * Math.cos(mRad))
  for (let iter = 0; iter < 4; iter++) {
    const eRad = E * DEG
    const delta = (mDeg - (E - RAD * e * Math.sin(eRad))) / (1 - e * Math.cos(eRad))
    E += delta
  }
  return E
}

export interface EquatorialPosition {
  /** Right ascension, degrees, 0-360. */
  ra: number
  /** Declination, degrees, -90 to 90. */
  dec: number
}

/** The moon's geocentric equatorial position at a given instant. */
export function moonPosition(date: Date): EquatorialPosition {
  const d = daysSinceEpoch(date)

  const N = norm360(125.1228 - 0.0529538083 * d)
  const i = 5.1454
  const w = norm360(318.0634 + 0.1643573223 * d)
  const a = 60.2666
  const e = 0.0549
  const M = norm360(115.3654 + 13.0649929509 * d)

  const E = eccentricAnomaly(M, e)
  const xv = a * (cosD(E) - e)
  const yv = a * (Math.sqrt(1 - e * e) * sinD(E))
  const v = atan2D(yv, xv)
  const r = Math.sqrt(xv * xv + yv * yv)

  const vw = v + w
  const xh = r * (cosD(N) * cosD(vw) - sinD(N) * sinD(vw) * cosD(i))
  const yh = r * (sinD(N) * cosD(vw) + cosD(N) * sinD(vw) * cosD(i))
  const zh = r * (sinD(vw) * sinD(i))

  const lon = atan2D(yh, xh)
  const lat = atan2D(zh, Math.sqrt(xh * xh + yh * yh))

  const ecl = 23.4393 - 3.563e-7 * d
  const xe = r * cosD(lon) * cosD(lat)
  const ye = r * (sinD(lon) * cosD(lat) * cosD(ecl) - sinD(lat) * sinD(ecl))
  const ze = r * (sinD(lon) * cosD(lat) * sinD(ecl) + sinD(lat) * cosD(ecl))

  return {
    ra: norm360(atan2D(ye, xe)),
    dec: atan2D(ze, Math.sqrt(xe * xe + ye * ye)),
  }
}

/** Local sidereal time in degrees for a given instant and east-positive longitude. */
export function localSiderealTime(date: Date, lngDeg: number): number {
  const d = daysSinceEpoch(date)
  const wSun = 282.9404 + 4.70935e-5 * d
  const mSun = norm360(356.047 + 0.9856002585 * d)
  const sunMeanLongitude = norm360(wSun + mSun)
  const gmst0 = norm360(sunMeanLongitude + 180)
  const utHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600
  const gmst = norm360(gmst0 + utHours * 15)
  return norm360(gmst + lngDeg)
}

/** The moon's hour angle (degrees, -180 to 180; 0 = due south / upper transit). */
export function moonHourAngle(date: Date, lngDeg: number): number {
  const { ra } = moonPosition(date)
  return normHourAngle(localSiderealTime(date, lngDeg) - ra)
}

/** The moon's altitude above the horizon, in degrees, for an observer at latDeg/lngDeg. */
export function moonAltitude(date: Date, latDeg: number, lngDeg: number): number {
  const { dec } = moonPosition(date)
  const H = moonHourAngle(date, lngDeg)
  return asinD(sinD(latDeg) * sinD(dec) + cosD(latDeg) * cosD(dec) * cosD(H))
}

export type SolunarEventType = 'moonrise' | 'moonset' | 'overhead' | 'underfoot'

export interface SolunarEvent {
  type: SolunarEventType
  /** ms epoch timestamp. */
  time: number
}

const SAMPLE_MS = 5 * 60_000
const WINDOW_BEFORE_MS = 1 * 3_600_000
const WINDOW_AFTER_MS = 25 * 3_600_000

/**
 * Finds every moonrise/moonset/overhead-transit/underfoot-transit that
 * falls within the calendar day (local time, per the Date object's own
 * timezone) containing `date`. Some days genuinely have none of a given
 * event (the moon's ~24h50m cycle drifts relative to the 24h calendar day)
 * -- that's correct astronomical behavior, not a bug, so callers should
 * expect anywhere from 0 to 2 of each event type.
 */
export function findSolunarEvents(date: Date, latDeg: number, lngDeg: number): SolunarEvent[] {
  const dayStart = new Date(date)
  dayStart.setHours(0, 0, 0, 0)
  const dayStartMs = dayStart.getTime()
  const startMs = dayStartMs - WINDOW_BEFORE_MS
  const endMs = dayStartMs + WINDOW_AFTER_MS

  const samples: { t: number; alt: number; H: number }[] = []
  for (let t = startMs; t <= endMs; t += SAMPLE_MS) {
    const sampleDate = new Date(t)
    samples.push({
      t,
      alt: moonAltitude(sampleDate, latDeg, lngDeg),
      H: moonHourAngle(sampleDate, lngDeg),
    })
  }

  const events: SolunarEvent[] = []

  for (let i = 1; i < samples.length; i++) {
    const prev = samples[i - 1]
    const curr = samples[i]

    if (prev.alt <= 0 && curr.alt > 0) {
      const frac = -prev.alt / (curr.alt - prev.alt)
      events.push({ type: 'moonrise', time: prev.t + frac * (curr.t - prev.t) })
    }
    if (prev.alt > 0 && curr.alt <= 0) {
      const frac = prev.alt / (prev.alt - curr.alt)
      events.push({ type: 'moonset', time: prev.t + frac * (curr.t - prev.t) })
    }
    if (prev.H <= 0 && curr.H > 0) {
      const frac = -prev.H / (curr.H - prev.H)
      events.push({ type: 'overhead', time: prev.t + frac * (curr.t - prev.t) })
    }
    // Lower transit: H wraps from just under +180 to just over -180.
    if (prev.H > 90 && curr.H < -90) {
      const distPrevTo180 = 180 - prev.H
      const distCurrFromNeg180 = curr.H - -180
      const total = distPrevTo180 + distCurrFromNeg180
      const frac = total === 0 ? 0 : distPrevTo180 / total
      events.push({ type: 'underfoot', time: prev.t + frac * (curr.t - prev.t) })
    }
  }

  return events
    .filter((e) => e.time >= dayStartMs && e.time < dayStartMs + 24 * 3_600_000)
    .sort((a, b) => a.time - b.time)
}

export type SolunarPeriodKind = 'major' | 'minor'

export interface SolunarPeriod {
  kind: SolunarPeriodKind
  label: string
  start: number
  end: number
}

const MAJOR_HALF_WIDTH_MS = 60 * 60_000
const MINOR_HALF_WIDTH_MS = 30 * 60_000

const EVENT_LABELS: Record<SolunarEventType, string> = {
  overhead: 'Moon overhead',
  underfoot: 'Moon underfoot',
  moonrise: 'Moonrise',
  moonset: 'Moonset',
}

/** Major (moon overhead/underfoot, ~2h) and minor (moonrise/moonset, ~1h) activity windows for the day. */
export function getSolunarPeriods(date: Date, latDeg: number, lngDeg: number): SolunarPeriod[] {
  return findSolunarEvents(date, latDeg, lngDeg)
    .map((e) => {
      const isMajor = e.type === 'overhead' || e.type === 'underfoot'
      const halfWidth = isMajor ? MAJOR_HALF_WIDTH_MS : MINOR_HALF_WIDTH_MS
      return {
        kind: isMajor ? ('major' as const) : ('minor' as const),
        label: EVENT_LABELS[e.type],
        start: e.time - halfWidth,
        end: e.time + halfWidth,
      }
    })
    .sort((a, b) => a.start - b.start)
}
