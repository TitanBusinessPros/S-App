import { useEffect, useState } from 'react'
import { Shell } from '../components/Shell'
import { GuideDisclaimer } from '../components/GuideDisclaimer'
import { useAuth } from '../lib/AuthContext'
import { useGeolocation } from '../lib/useGeolocation'
import { fetchLocationName, fetchSpeciesNearby } from '../lib/functionsApi'
import { useSpeciesLookupCredits, DAILY_SPECIES_LOOKUP_LIMIT } from '../lib/speciesLookupCredits'
import {
  categoryIcon,
  categoryLabel,
  groupByCategory,
  MONTH_NAMES,
  type ConfirmedSpeciesEntry,
} from '../lib/species'
import { DEFAULT_RADIUS_MILES, MIN_RADIUS_MILES, MAX_RADIUS_MILES } from '../lib/water'
import '../components/GuidePage.css'
import '../components/PageHeader.css'
import './SpeciesNearby.css'

function formatDate(epochMs: number): string {
  return new Date(epochMs).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function SpeciesCard({ entry }: { entry: ConfirmedSpeciesEntry }) {
  const isDanger = entry.category === 'dangerous-animal' || entry.category === 'dangerous-plant'

  return (
    <div className={`card species-card ${isDanger ? 'species-danger' : ''}`}>
      <h3>{entry.commonName}</h3>
      <span className="species-scientific">{entry.scientificName}</span>
      <span className={`badge species-confidence ${entry.confirmed ? 'confirmed' : 'unconfirmed'}`}>
        {entry.confirmed ? '✅ Confirmed nearby' : '📍 Regionally documented — not confirmed nearby'}
      </span>
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
  const { user } = useAuth()
  const uid = user?.uid ?? null
  const { coords, loading: locating, error: locationError, locate } = useGeolocation()
  const { creditsRemaining, resetAt: creditsResetAt } = useSpeciesLookupCredits(uid)
  const [radiusMiles, setRadiusMiles] = useState(DEFAULT_RADIUS_MILES)
  const [species, setSpecies] = useState<ConfirmedSpeciesEntry[]>([])
  const [fetching, setFetching] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [locality, setLocality] = useState<string | null>(null)
  // Which radius/month the results currently on screen were actually looked
  // up for — null means "no lookup run yet this visit". Every lookup,
  // including the first, now requires pressing "Look Up Nearby" (see
  // handleLookUpNearby); nothing auto-fetches on mount, or when location/
  // radius changes, the way it used to.
  const [lastLookup, setLastLookup] = useState<{ radiusMiles: number; month: number } | null>(null)

  const month = new Date().getMonth() + 1

  useEffect(() => {
    locate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Species lookups are manual and credit-gated, mirroring the Water &
  // Terrain Map's "Scan for Water" button (see MapWater.tsx). Each press
  // costs 1 of DAILY_SPECIES_LOOKUP_LIMIT credits per rolling 24h window;
  // the server (functions/src/species.ts, functions/src/
  // speciesLookupCredits.ts) is the real enforcement point, this is just
  // the UI trigger.
  async function handleLookUpNearby() {
    if (!coords) return

    setFetching(true)
    setFetchError(null)

    try {
      const result = await fetchSpeciesNearby(coords.lat, coords.lng, radiusMiles, month)
      setSpecies(result.species)
      setLastLookup({ radiusMiles, month })
    } catch (err) {
      const code = (err as { code?: string } | undefined)?.code
      if (code === 'functions/resource-exhausted') {
        const resetAt = (err as { details?: { resetAt?: number } }).details?.resetAt
        setFetchError(
          resetAt
            ? `You're out of species lookups for today. More free up ${formatDate(resetAt)}.`
            : "You're out of species lookups for today. Try again later.",
        )
      } else {
        setFetchError('Could not load nearby species. Try again in a moment.')
      }
    } finally {
      setFetching(false)
    }
  }

  // Non-fatal, separate from the species fetch above — shown so you can
  // verify the app resolved your actual location, not tied to whether the
  // species lookup itself succeeds.
  useEffect(() => {
    if (!coords) return
    let cancelled = false
    setLocality(null)
    fetchLocationName(coords.lat, coords.lng)
      .then((result) => {
        if (!cancelled) setLocality(result.locality)
      })
      .catch(() => {
        /* keep the generic heading */
      })
    return () => {
      cancelled = true
    }
  }, [coords])

  const groups = groupByCategory(species)

  return (
    <Shell>
      <div className="species-header">
        <h1>{locality ? `Plants, Wildlife & Wood near ${locality}` : 'Plants, Wildlife & Wood Nearby'}</h1>
        <p>
          A growing, hand-verified reference — not an exhaustive field guide. Filtered to what's in season right
          now; each entry also shows whether it's been confirmed present nearby via real biodiversity
          observation data (GBIF), or is regional reference content not yet confirmed at your exact location.
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
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleLookUpNearby}
          disabled={!coords || fetching || creditsRemaining <= 0}
        >
          {fetching
            ? 'Looking up…'
            : creditsRemaining <= 0
              ? 'No lookups left today'
              : `🔍 Look Up Nearby (${creditsRemaining} left)`}
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

      {coords && !fetching && !fetchError && creditsRemaining <= 0 && lastLookup === null && (
        <p className="map-disclosure">
          ⏳ No species lookups left today.{creditsResetAt ? ` More free up ${formatDate(creditsResetAt)}.` : ''}
        </p>
      )}

      {coords && !fetching && !fetchError && lastLookup === null && creditsRemaining > 0 && (
        <div className="card species-empty">
          <p>
            Press "Look Up Nearby" to see what's around you — uses 1 of your {DAILY_SPECIES_LOOKUP_LIMIT} daily
            lookups.
          </p>
        </div>
      )}

      {coords && !fetching && lastLookup !== null && lastLookup.radiusMiles !== radiusMiles && (
        <p className="map-disclosure">↻ Radius changed — press "Look Up Nearby" again to update these results.</p>
      )}

      {coords && !fetching && !fetchError && lastLookup !== null && groups.length === 0 && (
        <div className="card species-empty">
          <p>Nothing in our starter dataset is in season this month yet.</p>
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
