import { useEffect, useState } from 'react'
import { Shell } from '../components/Shell'
import { GuideDisclaimer } from '../components/GuideDisclaimer'
import { useGeolocation } from '../lib/useGeolocation'
import { fetchSpeciesNearby } from '../lib/functionsApi'
import {
  categoryIcon,
  categoryLabel,
  groupByCategory,
  MONTH_NAMES,
  type SpeciesEntry,
} from '../lib/species'
import { DEFAULT_RADIUS_MILES, MIN_RADIUS_MILES, MAX_RADIUS_MILES } from '../lib/water'
import '../components/GuidePage.css'
import './SpeciesNearby.css'

function SpeciesCard({ entry }: { entry: SpeciesEntry }) {
  const isDanger = entry.category === 'dangerous-animal' || entry.category === 'dangerous-plant'

  return (
    <div className={`card species-card ${isDanger ? 'species-danger' : ''}`}>
      <h3>{entry.commonName}</h3>
      <span className="species-scientific">{entry.scientificName}</span>
      <p className="species-summary">{entry.summary}</p>

      {entry.edibleParts && (
        <>
          <span className="species-detail-label">Edible parts</span>
          <span className="species-detail-text">{entry.edibleParts.join(', ')}</span>
        </>
      )}
      {entry.cookingNotes && (
        <>
          <span className="species-detail-label">Preparation</span>
          <span className="species-detail-text">{entry.cookingNotes}</span>
        </>
      )}
      {entry.dangerNotes && (
        <>
          <span className="species-detail-label">Danger</span>
          <span className="species-detail-text">{entry.dangerNotes}</span>
        </>
      )}
      {entry.safetyNotes && (
        <>
          <span className="species-detail-label">What to do</span>
          <span className="species-detail-text">{entry.safetyNotes}</span>
        </>
      )}
      {entry.woodUse && (
        <>
          <span className="species-detail-label">Wood use</span>
          <div className="species-wood-tags">
            <span className="badge">{entry.woodUse.firewood ? '🔥 Firewood OK' : '🚫 Not firewood'}</span>
            <span className="badge">{entry.woodUse.smoking ? '💨 Good for smoking' : '🚫 Not for smoking'}</span>
          </div>
          {entry.woodUse.burnWarning && (
            <span className="species-detail-text" style={{ color: 'var(--danger)' }}>
              ⚠️ {entry.woodUse.burnWarning}
            </span>
          )}
        </>
      )}
    </div>
  )
}

export function SpeciesNearby() {
  const { coords, loading: locating, error: locationError, locate } = useGeolocation()
  const [radiusMiles, setRadiusMiles] = useState(DEFAULT_RADIUS_MILES)
  const [species, setSpecies] = useState<SpeciesEntry[]>([])
  const [fetching, setFetching] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const month = new Date().getMonth() + 1

  useEffect(() => {
    locate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!coords) return
    let cancelled = false
    setFetching(true)
    setFetchError(null)

    fetchSpeciesNearby(coords.lat, coords.lng, radiusMiles, month)
      .then((result) => {
        if (!cancelled) setSpecies(result.species)
      })
      .catch(() => {
        if (!cancelled) setFetchError('Could not load nearby species. Try again in a moment.')
      })
      .finally(() => {
        if (!cancelled) setFetching(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords, radiusMiles, month])

  const groups = groupByCategory(species)

  return (
    <Shell>
      <div className="species-header">
        <h1>Plants, Wildlife &amp; Wood Nearby</h1>
        <p>
          A growing, hand-verified reference — not an exhaustive field guide. Each entry is confirmed present
          near you via real biodiversity observation data (GBIF), and filtered to what's actually in season
          right now.
        </p>
      </div>

      <GuideDisclaimer>
        Always positively identify a plant, fungus, or animal yourself before eating or handling it — this list
        is a starting reference, not a substitute for a field guide or local expertise.
      </GuideDisclaimer>

      <div className="species-controls">
        <div className="radius-control">
          <label htmlFor="species-radius">Search radius</label>
          <input
            id="species-radius"
            type="range"
            min={MIN_RADIUS_MILES}
            max={MAX_RADIUS_MILES}
            value={radiusMiles}
            onChange={(e) => setRadiusMiles(Number(e.target.value))}
          />
          <span className="radius-value mono">{radiusMiles} mi</span>
        </div>
        <button type="button" className="btn" onClick={locate} disabled={locating}>
          {locating ? 'Locating…' : coords ? 'Re-check my location' : 'Use my location'}
        </button>
        <span className="species-month-badge">Showing what's active in {MONTH_NAMES[month - 1]}</span>
      </div>

      {!coords && (
        <div className="card species-empty">
          {locationError ? <p className="login-error">{locationError}</p> : <p>Locating you…</p>}
        </div>
      )}

      {coords && fetching && (
        <div className="card species-empty">
          <p>Checking real observation data nearby…</p>
        </div>
      )}

      {coords && fetchError && (
        <div className="card species-empty">
          <p className="login-error">{fetchError}</p>
        </div>
      )}

      {coords && !fetching && !fetchError && groups.length === 0 && (
        <div className="card species-empty">
          <p>Nothing in our starter dataset was confirmed nearby for this month and radius yet. Try widening the radius.</p>
        </div>
      )}

      {groups.map((group) => (
        <div key={group.category} className="species-group">
          <h2 className="species-group-title">
            {categoryIcon(group.category)} {categoryLabel(group.category)}
          </h2>
          <div className="species-grid">
            {group.items.map((entry) => (
              <SpeciesCard key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      ))}
    </Shell>
  )
}
