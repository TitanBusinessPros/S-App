import { useEffect, useState } from 'react'
import { Shell } from '../components/Shell'
import { getMoonPhase, moonPhaseIcon } from '../lib/moonPhase'
import '../components/PageHeader.css'
import './MoonPhase.css'

function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export function MoonPhase() {
  // Recomputed on a slow interval rather than once at mount -- this page
  // could plausibly stay open across a midnight rollover, and the phase
  // does (very slightly) drift within a single day too.
  const [info, setInfo] = useState(() => getMoonPhase())

  useEffect(() => {
    const id = setInterval(() => setInfo(getMoonPhase()), 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <Shell>
      <div className="map-header">
        <h1>Moon Phase</h1>
        <p>Tonight's moonlight, and when to expect the next full and new moons.</p>
      </div>

      <p className="map-disclosure">
        Calculated from a standard lunar-cycle formula, accurate to within about a day — not a substitute for a
        real astronomical almanac. Works fully offline; the moon's phase is the same everywhere on Earth at any
        given moment, so no location is needed.
      </p>

      <div className="card moon-phase-card">
        <span className="moon-phase-icon" aria-hidden="true">
          {moonPhaseIcon(info.name)}
        </span>
        <h2>{info.name}</h2>
        <p className="moon-phase-illumination">{info.illuminationPercent}% illuminated</p>

        <div className="moon-phase-dates">
          <div>
            <span className="moon-phase-dates-label">Next full moon</span>
            <span>{formatDate(info.nextFullMoon)}</span>
          </div>
          <div>
            <span className="moon-phase-dates-label">Next new moon</span>
            <span>{formatDate(info.nextNewMoon)}</span>
          </div>
        </div>
      </div>

      <div className="card moon-phase-why">
        <h2>Why it matters</h2>
        <ul>
          <li>A full moon gives enough natural light to travel or work outside well after dark.</li>
          <li>A new moon means the darkest possible nights — plan night movement and lighting accordingly.</li>
          <li>Moonlight also affects nocturnal wildlife activity and how easily you'll be seen at night.</li>
        </ul>
      </div>
    </Shell>
  )
}
