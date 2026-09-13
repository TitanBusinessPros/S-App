import { useCallback, useState } from 'react'

export interface Coords {
  lat: number
  lng: number
  /** Meters, per the browser's Geolocation API — null if unavailable. */
  accuracy: number | null
}

export function useGeolocation() {
  const [coords, setCoords] = useState<Coords | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const locate = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError('Location is not available on this device.')
      return
    }
    setLoading(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy ?? null,
        })
        setLoading(false)
      },
      (err) => {
        // GeolocationPositionError.TIMEOUT (3) is impossible to hit without
        // an explicit `timeout` below -- the browser default is "wait
        // forever", which used to leave this stuck on a loading state with
        // no way out (a missed/ignored permission prompt, no GPS fix, a
        // stalled network location lookup). A first visit to a brand-new
        // origin is exactly when a permission prompt is most likely to be
        // missed, since none of this device's per-origin grants carry over.
        setError(
          err.code === err.PERMISSION_DENIED
            ? 'Location permission was denied.'
            : err.code === err.TIMEOUT
              ? 'Timed out getting your location. Check that location access is allowed for this site, then try again.'
              : 'Could not get your location. Try again.',
        )
        setLoading(false)
      },
      { timeout: 15_000 },
    )
  }, [])

  return { coords, loading, error, locate }
}
