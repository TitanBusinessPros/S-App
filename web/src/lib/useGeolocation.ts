import { useCallback, useState } from 'react'

export interface Coords {
  lat: number
  lng: number
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
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLoading(false)
      },
      () => {
        setError('Location permission was denied.')
        setLoading(false)
      },
    )
  }, [])

  return { coords, loading, error, locate }
}
