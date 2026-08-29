/**
 * Pure, unit-testable compass math. No device APIs here — those live in the
 * Compass component so this stays trivially testable.
 */

const DIRECTIONS = [
  'N', 'NNE', 'NE', 'ENE',
  'E', 'ESE', 'SE', 'SSE',
  'S', 'SSW', 'SW', 'WSW',
  'W', 'WNW', 'NW', 'NNW',
] as const

export type CompassDirection = (typeof DIRECTIONS)[number]

/** Normalizes any heading (including negatives or >360) into [0, 360). */
export function normalizeHeading(heading: number): number {
  return ((heading % 360) + 360) % 360
}

/** Converts a compass heading in degrees to a 16-point cardinal direction. */
export function headingToCardinal(heading: number): CompassDirection {
  const normalized = normalizeHeading(heading)
  const index = Math.round(normalized / 22.5) % 16
  return DIRECTIONS[index]
}

/**
 * Polaris's altitude above the horizon (in degrees) is, for practical
 * wilderness-navigation purposes, equal to the observer's latitude — a real
 * celestial-navigation fact (accurate to within ~1° since Polaris sits
 * about 0.7° off the true celestial pole). Only valid in the Northern
 * Hemisphere; Polaris isn't visible south of the equator.
 */
export function polarisAltitudeFromLatitude(latitudeDeg: number): number | null {
  if (latitudeDeg < 0) return null
  return Math.min(latitudeDeg, 90)
}
