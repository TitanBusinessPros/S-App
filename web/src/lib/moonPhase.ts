// Pure math, no API and no location needed -- the moon's phase is the same
// everywhere on Earth at a given moment, so this works fully offline and
// costs nothing to run, unlike every location-based feature in this app.
// Accuracy is roughly ±1 day (a simplified synodic-cycle approximation,
// not a full ephemeris) -- fine for "should I expect moonlight tonight",
// not a substitute for a real astronomical almanac.

const SYNODIC_MONTH_DAYS = 29.530588853
const MS_PER_DAY = 86_400_000
// A well-documented reference new moon: January 6, 2000, 18:14 UTC.
const REFERENCE_NEW_MOON_MS = Date.UTC(2000, 0, 6, 18, 14, 0)

export type MoonPhaseName =
  | 'New Moon'
  | 'Waxing Crescent'
  | 'First Quarter'
  | 'Waxing Gibbous'
  | 'Full Moon'
  | 'Waning Gibbous'
  | 'Last Quarter'
  | 'Waning Crescent'

export interface MoonPhaseInfo {
  /** 0 (new moon) to 1 (the next new moon) -- 0.5 is full moon. */
  phase: number
  name: MoonPhaseName
  /** 0-100, rounded. */
  illuminationPercent: number
  /** ms timestamp of the next new moon after `now`. */
  nextNewMoon: number
  /** ms timestamp of the next full moon after `now`. */
  nextFullMoon: number
}

const PHASE_ICONS: Record<MoonPhaseName, string> = {
  'New Moon': '🌑',
  'Waxing Crescent': '🌒',
  'First Quarter': '🌓',
  'Waxing Gibbous': '🌔',
  'Full Moon': '🌕',
  'Waning Gibbous': '🌖',
  'Last Quarter': '🌗',
  'Waning Crescent': '🌘',
}

export function moonPhaseIcon(name: MoonPhaseName): string {
  return PHASE_ICONS[name]
}

function phaseName(phase: number): MoonPhaseName {
  // Eight equal slices of the cycle, each named for its center point.
  if (phase < 0.0625 || phase >= 0.9375) return 'New Moon'
  if (phase < 0.1875) return 'Waxing Crescent'
  if (phase < 0.3125) return 'First Quarter'
  if (phase < 0.4375) return 'Waxing Gibbous'
  if (phase < 0.5625) return 'Full Moon'
  if (phase < 0.6875) return 'Waning Gibbous'
  if (phase < 0.8125) return 'Last Quarter'
  return 'Waning Crescent'
}

export function getMoonPhase(now: number = Date.now()): MoonPhaseInfo {
  const daysSinceReference = (now - REFERENCE_NEW_MOON_MS) / MS_PER_DAY
  const daysIntoCycle = daysSinceReference % SYNODIC_MONTH_DAYS
  const phase = (daysIntoCycle < 0 ? daysIntoCycle + SYNODIC_MONTH_DAYS : daysIntoCycle) / SYNODIC_MONTH_DAYS

  const illuminationPercent = Math.round(((1 - Math.cos(2 * Math.PI * phase)) / 2) * 100)
  const name = phaseName(phase)

  const cyclesSoFar = Math.floor(daysSinceReference / SYNODIC_MONTH_DAYS)
  const daysToNextNewMoon = (cyclesSoFar + 1) * SYNODIC_MONTH_DAYS - daysSinceReference
  const nextNewMoon = now + daysToNextNewMoon * MS_PER_DAY

  const currentCycleStart = now - phase * SYNODIC_MONTH_DAYS * MS_PER_DAY
  let nextFullMoon = currentCycleStart + 0.5 * SYNODIC_MONTH_DAYS * MS_PER_DAY
  if (nextFullMoon <= now) nextFullMoon += SYNODIC_MONTH_DAYS * MS_PER_DAY

  return { phase, name, illuminationPercent, nextNewMoon, nextFullMoon }
}
