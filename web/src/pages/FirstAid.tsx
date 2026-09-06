import { Shell } from '../components/Shell'
import { GuideDisclaimer } from '../components/GuideDisclaimer'
import { FIRST_AID_CATEGORIES, UNIVERSAL_RESPONSE, type FirstAidCategory } from '../lib/firstAidData'
import '../components/GuidePage.css'
import './FirstAid.css'

function FirstAidTable({ category }: { category: FirstAidCategory }) {
  return (
    <section id={`first-aid-${category.key}`} className="guide-section card">
      <h2>{category.emoji} {category.title}</h2>
      <div className="first-aid-table-wrap">
        <table className="first-aid-table">
          <thead>
            <tr>
              <th scope="col">Problem</th>
              <th scope="col">Immediate first-aid measures</th>
            </tr>
          </thead>
          <tbody>
            {category.items.map((item) => (
              <tr key={item.num}>
                <td data-label="Problem" className="first-aid-problem">
                  <span className="first-aid-num">{item.num}.</span> {item.problem}
                </td>
                <td data-label="Immediate first-aid measures" className="first-aid-action">{item.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function FirstAidContent() {
  return (
    <>
      <div className="guide-header">
        <h1>First Aid</h1>
        <p>Core wilderness first aid steps. This is general reference information, not a substitute for real first aid training — take a certified Wilderness First Aid course if you spend serious time outdoors.</p>
      </div>

      <GuideDisclaimer>
        Call for professional medical help whenever possible. For anything life-threatening, these steps buy
        time — they don't replace emergency care.
      </GuideDisclaimer>

      <nav className="first-aid-nav" aria-label="Jump to a section">
        <a href="#first-aid-universal" className="first-aid-nav-link">🚨 Universal Response</a>
        {FIRST_AID_CATEGORIES.map((category) => (
          <a key={category.key} href={`#first-aid-${category.key}`} className="first-aid-nav-link">
            {category.emoji} {category.title}
          </a>
        ))}
      </nav>

      <div className="guide-sections">
        <section id="first-aid-universal" className="guide-section card">
          <h2>🚨 Universal Response</h2>
          <p>Before treating any specific problem below:</p>
          <ul>
            {UNIVERSAL_RESPONSE.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        </section>

        {FIRST_AID_CATEGORIES.map((category) => (
          <FirstAidTable key={category.key} category={category} />
        ))}

        <section className="guide-section card">
          <h2>🌿 Medicinal Plants — Not Yet Covered Here</h2>
          <p>
            We're deliberately not listing "plants that treat X" in this version. Misidentifying a plant is how
            people get seriously hurt, and a real medicinal-plant guide needs to be tied to verified, region-specific
            species data — that's planned as its own dedicated feature, not something to guess at here.
          </p>
        </section>
      </div>
    </>
  )
}

export function FirstAid() {
  return (
    <Shell>
      <FirstAidContent />
    </Shell>
  )
}
