import { useEffect, useState } from 'react'
import { Shell } from '../components/Shell'
import { useGeolocation } from '../lib/useGeolocation'
import { fetchWeather, formatDayLabel, weatherCodeInfo, type DailyForecast } from '../lib/weather'
import './Weather.css'

export function Weather() {
  const { coords, loading: locating, error: locationError, locate } = useGeolocation()
  const [forecast, setForecast] = useState<DailyForecast[] | null>(null)
  const [fetching, setFetching] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    locate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!coords) return
    let cancelled = false
    setFetching(true)
    setFetchError(null)

    fetchWeather(coords.lat, coords.lng)
      .then((result) => {
        if (!cancelled) setForecast(result)
      })
      .catch(() => {
        if (!cancelled) setFetchError('Could not load the forecast. Try again in a moment.')
      })
      .finally(() => {
        if (!cancelled) setFetching(false)
      })

    return () => {
      cancelled = true
    }
  }, [coords])

  return (
    <Shell>
      <div className="weather-header">
        <h1>7-Day Weather</h1>
        <p>Forecast for your current location — useful for planning shelter, water, and travel.</p>
      </div>

      {!coords && (
        <div className="card weather-state">
          {locationError ? <p className="login-error">{locationError}</p> : <p>Locating you…</p>}
          <button type="button" className="btn btn-primary" onClick={locate}>
            {locating ? 'Locating…' : 'Try again'}
          </button>
        </div>
      )}

      {coords && fetching && (
        <div className="card weather-state">
          <p>Loading forecast…</p>
        </div>
      )}

      {coords && fetchError && (
        <div className="card weather-state">
          <p className="login-error">{fetchError}</p>
          <button type="button" className="btn btn-primary" onClick={locate}>
            Retry
          </button>
        </div>
      )}

      {coords && !fetching && !fetchError && forecast && (
        <div className="weather-grid">
          {forecast.map((day, i) => {
            const info = weatherCodeInfo(day.weatherCode)
            return (
              <div key={day.date} className="card weather-day">
                <span className="weather-day-label">{formatDayLabel(day.date, i)}</span>
                <span className="weather-day-icon">{info.icon}</span>
                <span className="weather-day-condition">{info.label}</span>
                <span className="weather-day-temps mono">
                  {Math.round(day.tempMaxF)}° <span className="lo">{Math.round(day.tempMinF)}°</span>
                </span>
                {day.precipitationIn > 0 && (
                  <span className="weather-day-detail">💧 {day.precipitationIn.toFixed(2)}"</span>
                )}
                <span className="weather-day-detail">💨 {Math.round(day.windMaxMph)} mph</span>
              </div>
            )
          })}
        </div>
      )}
    </Shell>
  )
}
