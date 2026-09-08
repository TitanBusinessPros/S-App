import { Link } from 'react-router-dom'
import { Shell } from '../components/Shell'
import { useEntitlement } from '../lib/entitlement'
import './Dashboard.css'

interface Feature {
  icon: string
  title: string
  description: string
  to?: string
}

const FEATURES: Feature[] = [
  { icon: '🧭', title: 'Compass', description: 'Magnetic heading + find true north using the stars.', to: '/app/compass' },
  { icon: '📍', title: 'Waypoints & Trail', description: 'Drop a pin at camp, then find your way back.', to: '/app/waypoints' },
  { icon: '🗺️', title: 'Water & Terrain Map', description: 'Ponds, creeks, rivers, and lakes within an adjustable radius.', to: '/app/map' },
  { icon: '🏔️', title: '3D Maps', description: 'A tilted, rotatable 3D view of your area.', to: '/app/map3d' },
  { icon: '🌿', title: 'Plants, Wildlife & Wood', description: 'Edible & dangerous species, and wood for fire — confirmed nearby, in season.', to: '/app/species' },
  { icon: '🩹', title: 'First Aid', description: 'Core wilderness first aid steps.', to: '/app/first-aid' },
  { icon: '⛺', title: 'Shelter Building', description: 'Shelter designs suited to your climate and materials.', to: '/app/shelter' },
  { icon: '🔥', title: 'Fire Starting', description: 'Friction fire, fire-by-lens, tinder by environment, and fire woods.', to: '/app/fire-starting' },
  { icon: '💧', title: 'Finding Water', description: 'How to spot, dig for, and collect water in the field.', to: '/app/water-sourcing' },
  { icon: '🧪', title: 'Water Purification', description: '25 improvised filter builds, plus how to disinfect what comes out.', to: '/app/water-purification' },
  { icon: '🪤', title: 'Snares & Traps', description: 'How to build snares to catch small game.', to: '/app/snares' },
  { icon: '🍳', title: 'Wild Game Recipes', description: 'Field-to-table recipes, indexed A-Z by animal.', to: '/app/recipes' },
]

// These two stay free forever, even after the 3-day trial ends -- every
// other feature above locks behind a subscription once trial access runs
// out (see lib/entitlement.ts and components/PaidFeatureRoute.tsx, which
// enforces the same list at the route level so a locked page isn't
// reachable by direct URL either).
const ALWAYS_FREE_ROUTES = new Set(['/app/compass', '/app/first-aid'])

export function Dashboard() {
  const { loading, hasAccess } = useEntitlement()

  return (
    <Shell>
      <div className="dash-header">
        <img src="/icon-192.png" alt="Survival Day" className="dash-icon" />
        <h1>Welcome back</h1>
        <p>Pick a tool below. More features are rolling out as we build them.</p>
      </div>

      <div className="feature-grid">
        {FEATURES.map((feature) => {
          const content = (
            <>
              <span className="feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
            </>
          )

          if (!feature.to) {
            return (
              <div
                key={feature.title}
                className="card feature-card feature-card-disabled"
                title={feature.description}
              >
                {content}
              </div>
            )
          }

          // Never shows as locked while entitlement is still loading -- that
          // would flash "locked" at trial/paid users for a moment on every
          // page load, since useEntitlement resolves async from Firestore.
          const locked = !loading && !hasAccess && !ALWAYS_FREE_ROUTES.has(feature.to)

          return (
            <Link
              key={feature.title}
              to={locked ? '/app/upgrade' : feature.to}
              className={`card feature-card${locked ? ' feature-card-locked' : ''}`}
              title={locked ? `${feature.description} — subscribe to unlock` : feature.description}
            >
              {locked && <span className="badge feature-card-lock-badge">🔒</span>}
              {content}
            </Link>
          )
        })}
      </div>
    </Shell>
  )
}
