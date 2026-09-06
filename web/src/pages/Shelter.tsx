import { Shell } from '../components/Shell'
import { GuideDisclaimer } from '../components/GuideDisclaimer'
import {
  SHELTER_DESIGNS,
  SHELTERS_NOT_RECOMMENDED,
  UNIVERSAL_SHELTER_RULES,
  type ShelterDesign,
} from '../lib/shelterData'
import '../components/GuidePage.css'
import './Shelter.css'

function ShelterDesignCard({ design }: { design: ShelterDesign }) {
  return (
    <div className="guide-card shelter-design-card">
      <h3>{design.emoji} {design.num}. {design.name}</h3>
      <p><strong>Best for:</strong> {design.bestFor}</p>
      <p><strong>Needs:</strong> {design.needs}</p>
      <span className="shelter-subheading">Build</span>
      <ol>
        {design.buildSteps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
      <p className="shelter-key-detail">💡 <strong>Key detail:</strong> {design.keyDetail}</p>
    </div>
  )
}

export function ShelterContent() {
  return (
    <>
      <div className="guide-header">
        <h1>Shelter Building</h1>
        <p>
          Which shelter to build depends more on your climate, weather, and materials on hand than your exact GPS
          coordinates. Start with the universal rules below, then pick the design that matches your conditions.
        </p>
      </div>

      <GuideDisclaimer>
        Site selection matters as much as the shelter itself — see the Universal Shelter Rules before you start
        building.
      </GuideDisclaimer>

      <nav className="shelter-nav" aria-label="Jump to a section">
        <a href="#shelter-universal-rules" className="shelter-nav-link">🧭 Universal Rules</a>
        <a href="#shelter-designs" className="shelter-nav-link">⛺ 15 Shelters</a>
        <a href="#shelter-not-recommended" className="shelter-nav-link">🚫 Not Recommended</a>
      </nav>

      <div className="guide-sections">
        <section id="shelter-universal-rules" className="guide-section card">
          <h2>🧭 Universal Shelter Rules</h2>
          <p>Before building any shelter, use this checklist:</p>
          {UNIVERSAL_SHELTER_RULES.map((rule) => (
            <div key={rule.title} className="shelter-rule">
              <span className="shelter-subheading">{rule.title}</span>
              <ul>
                {rule.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section id="shelter-designs" className="guide-section card">
          <h2>⛺ 15 Shelters Worth Knowing</h2>
          <p>Pick the design that matches your climate, weather, and the materials you actually have on hand.</p>
          <div className="shelter-design-list">
            {SHELTER_DESIGNS.map((design) => (
              <ShelterDesignCard key={design.num} design={design} />
            ))}
          </div>
        </section>

        <section id="shelter-not-recommended" className="guide-section card">
          <h2>🚫 Things I Would Not Recommend</h2>
          <ul>
            {SHELTERS_NOT_RECOMMENDED.map((warning, i) => (
              <li key={i}>{warning}</li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}

export function Shelter() {
  return (
    <Shell>
      <ShelterContent />
    </Shell>
  )
}
