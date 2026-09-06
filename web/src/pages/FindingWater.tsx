import { Shell } from '../components/Shell'
import { GuideDisclaimer } from '../components/GuideDisclaimer'
import {
  BOILING_GUIDANCE,
  FIRST_PRIORITIES,
  SEEP_HOLE_INTRO,
  SEEP_HOLE_STEPS,
  SURVIVAL_DECISION_RULE,
  WATER_METHOD_CATEGORIES,
  WATER_METHODS_TO_AVOID,
  WATER_TREATMENT_METHODS,
  type WaterMethodCategory,
} from '../lib/findingWaterData'
import '../components/GuidePage.css'

function WaterMethodTable({ category }: { category: WaterMethodCategory }) {
  return (
    <section id={`water-${category.key}`} className="guide-section card">
      <h2>{category.emoji} {category.title}</h2>
      <div className="guide-table-wrap">
        <table className="guide-table">
          <thead>
            <tr>
              <th scope="col">Method</th>
              <th scope="col">How to use it</th>
            </tr>
          </thead>
          <tbody>
            {category.items.map((item) => (
              <tr key={item.num}>
                <td>
                  <span className="guide-table-num">{item.num}.</span> {item.name}
                </td>
                <td data-label="How to use it">{item.text}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function FindingWaterContent() {
  return (
    <>
      <div className="guide-header">
        <h1>Finding Water</h1>
        <p>
          50 practical ways to obtain water in the field, roughly ordered from most practical and least damaging
          to last-ditch — plus how to treat what you find, since obtaining water is never the same as it being
          safe to drink.
        </p>
      </div>

      <GuideDisclaimer>
        Untreated water can carry parasites, bacteria, viruses, and even chemical contamination invisible to the
        eye. Boil for at least 1 minute (3 minutes above 6,500 ft) when you can; if you can't boil, filter first
        and then disinfect — chemical treatment alone doesn't reliably kill Cryptosporidium.
      </GuideDisclaimer>

      <nav className="guide-nav" aria-label="Jump to a section">
        <a href="#water-first-priorities" className="guide-nav-link">🆘 First Priorities</a>
        {WATER_METHOD_CATEGORIES.map((category) => (
          <a key={category.key} href={`#water-${category.key}`} className="guide-nav-link">
            {category.emoji} {category.title}
          </a>
        ))}
        <a href="#water-seep-hole" className="guide-nav-link">🕳️ Dig a Seep Hole</a>
        <a href="#water-avoid" className="guide-nav-link">🚫 Methods to Avoid</a>
        <a href="#water-treat" className="guide-nav-link">🧪 Treat What You Find</a>
        <a href="#water-decision-rule" className="guide-nav-link">🧭 Decision Rule</a>
      </nav>

      <div className="guide-sections">
        <section id="water-first-priorities" className="guide-section card">
          <h2>🆘 First Priorities</h2>
          <ul>
            {FIRST_PRIORITIES.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        </section>

        {WATER_METHOD_CATEGORIES.map((category) => (
          <WaterMethodTable key={category.key} category={category} />
        ))}

        <section id="water-seep-hole" className="guide-section card">
          <h2>🕳️ How to Dig a Seep Hole</h2>
          <p>{SEEP_HOLE_INTRO}</p>
          <ol>
            {SEEP_HOLE_STEPS.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>

        <section id="water-avoid" className="guide-section card">
          <h2>🚫 Methods to Avoid</h2>
          <p>Do not rely on these myths or high-risk techniques:</p>
          <div className="guide-table-wrap">
            <table className="guide-table">
              <thead>
                <tr>
                  <th scope="col">Method</th>
                  <th scope="col">Why not</th>
                </tr>
              </thead>
              <tbody>
                {WATER_METHODS_TO_AVOID.map((item) => (
                  <tr key={item.name}>
                    <td>{item.name}</td>
                    <td data-label="Why not">{item.text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="water-treat" className="guide-section card">
          <h2>🧪 Treat What You Find</h2>
          <div className="guide-table-wrap">
            <table className="guide-table">
              <thead>
                <tr>
                  <th scope="col">Method</th>
                  <th scope="col">What it does well</th>
                  <th scope="col">Critical limits</th>
                </tr>
              </thead>
              <tbody>
                {WATER_TREATMENT_METHODS.map((row) => (
                  <tr key={row.method}>
                    <td>{row.method}</td>
                    <td data-label="What it does well">{row.whatItDoesWell}</td>
                    <td data-label="Critical limits">{row.criticalLimits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="guide-table-footnote">{BOILING_GUIDANCE}</p>
        </section>

        <section id="water-decision-rule" className="guide-section card">
          <h2>🧭 Survival Decision Rule</h2>
          <ul>
            {SURVIVAL_DECISION_RULE.map((rule, i) => (
              <li key={i}>{rule}</li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}

export function FindingWater() {
  return (
    <Shell>
      <FindingWaterContent />
    </Shell>
  )
}
