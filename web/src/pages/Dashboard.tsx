import { Link } from 'react-router-dom'
import { Shell } from '../components/Shell'
import { useAuth } from '../lib/AuthContext'
import './Dashboard.css'

interface Feature {
  icon: string
  title: string
  description: string
  to?: string
}

const FEATURES: Feature[] = [
  { icon: '🧭', title: 'Compass', description: 'Magnetic heading + find true north using the stars.', to: '/app/compass' },
  { icon: '🗺️', title: 'Water & Terrain Map', description: 'Ponds, creeks, rivers, and lakes within an adjustable radius.', to: '/app/map' },
  { icon: '⛅', title: '7-Day Weather', description: 'Forecast for your exact radius.', to: '/app/weather' },
  { icon: '🌿', title: 'Plants, Wildlife & Wood', description: 'Edible & dangerous species, and wood for fire — confirmed nearby, in season.', to: '/app/species' },
  { icon: '🩹', title: 'First Aid', description: 'Core wilderness first aid steps.', to: '/app/first-aid' },
  { icon: '⛺', title: 'Shelter Building', description: 'Shelter designs suited to your climate and materials.', to: '/app/shelter' },
  { icon: '💧', title: 'Finding Water', description: 'How to spot, dig for, and collect water in the field.', to: '/app/water-sourcing' },
  { icon: '🪤', title: 'Snares & Traps', description: 'How to build snares to catch small game.', to: '/app/snares' },
  { icon: '🍳', title: 'Wild Game Recipes', description: 'Field-to-table recipes, indexed A-Z by animal.', to: '/app/recipes' },
]

export function Dashboard() {
  const { user } = useAuth()
  const firstName = user?.displayName?.split(' ')[0] ?? 'there'

  return (
    <Shell>
      <div className="dash-header">
        <h1>Welcome back, {firstName}.</h1>
        <p>Pick a tool below. More features are rolling out as we build them.</p>
      </div>

      <div className="feature-grid">
        {FEATURES.map((feature) => {
          const content = (
            <>
              <span className="feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <span className={`badge feature-status`}>
                {feature.to ? 'Available' : 'Coming soon'}
              </span>
            </>
          )

          return feature.to ? (
            <Link key={feature.title} to={feature.to} className="card feature-card">
              {content}
            </Link>
          ) : (
            <div key={feature.title} className="card feature-card feature-card-disabled">
              {content}
            </div>
          )
        })}
      </div>
    </Shell>
  )
}
