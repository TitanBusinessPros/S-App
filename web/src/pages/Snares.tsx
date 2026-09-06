import { Shell } from '../components/Shell'
import { GuideDisclaimer } from '../components/GuideDisclaimer'
import { TRAP_CATEGORIES, type TrapCategory, type TrapDesign } from '../lib/trapDesignsData'
import '../components/GuidePage.css'
import './Snares.css'

function difficultyStars(level: number): string {
  return '★'.repeat(level) + '☆'.repeat(5 - level)
}

function TrapDesignCard({ design }: { design: TrapDesign }) {
  return (
    <details className="trap-design">
      <summary>
        <span>
          <span className="trap-design-num">{design.num}.</span> {design.name}
        </span>
        <span className="trap-design-meta mono">{design.type} · {difficultyStars(design.difficulty)}</span>
      </summary>
      {design.intro && <p className="trap-design-intro">{design.intro}</p>}
      <p><strong>Materials:</strong> {design.materials}</p>
      <span className="guide-subheading">Construction</span>
      <ol>
        {design.construction.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
      {design.notes.map((note) => (
        <p key={note.label} className="trap-design-note">
          <strong>{note.label}:</strong> {note.text}
        </p>
      ))}
    </details>
  )
}

function TrapCategorySection({ category }: { category: TrapCategory }) {
  return (
    <section id={`trap-${category.key}`} className="guide-section card">
      <h2>{category.emoji} {category.title}</h2>
      <div className="trap-design-list">
        {category.designs.map((design) => (
          <TrapDesignCard key={design.num} design={design} />
        ))}
      </div>
    </section>
  )
}

export function SnaresContent() {
  return (
    <>
      <div className="guide-header">
        <h1>Snares &amp; Traps</h1>
        <p>
          Standard loop-snare designs, plus 100 primitive trigger, live-capture, and aquatic trap designs framed
          as practice and demonstration models. These only make sense in a genuine survival situation — check
          local trapping law before practicing, and never deploy a lethal design unattended.
        </p>
      </div>

      <GuideDisclaimer>
        Trapping regulations vary by state and season, and most places require a license outside a genuine
        emergency. Practice knots and mechanisms without live sets unless you actually need food to survive.
      </GuideDisclaimer>

      <nav className="guide-nav" aria-label="Jump to a section">
        <a href="#snares-basics" className="guide-nav-link">🪤 Basics</a>
        <a href="#snares-loop-snares" className="guide-nav-link">🎯 Loop &amp; Spring Snares</a>
        {TRAP_CATEGORIES.map((category) => (
          <a key={category.key} href={`#trap-${category.key}`} className="guide-nav-link">
            {category.emoji} {category.title}
          </a>
        ))}
        <a href="#snares-placement" className="guide-nav-link">📍 Placement</a>
      </nav>

      <div className="guide-sections">
        <section id="snares-basics" className="guide-section card">
          <h2>🪤 Snare &amp; Trap Basics</h2>
          <ul>
            <li>Use wire if you have it — cordage works but animals can chew through it before the snare closes.</li>
            <li>Set snares on active game trails, especially narrow pinch points between obstacles.</li>
            <li>Multiple snares (a "trap line") beat one perfect snare — check them at least twice a day.</li>
          </ul>
        </section>

        <section id="snares-loop-snares" className="guide-section card">
          <h2>🎯 Loop &amp; Spring Snares</h2>
          <div className="guide-subgrid">
            <div className="guide-card">
              <h3>Squirrel Pole</h3>
              <p>
                Lean a long pole from the ground up against a tree squirrels are already using. Tie several small
                wire loop snares (about 2 inches wide) along the pole, snug against the wood. Squirrels run the
                pole as a highway and put their head through a loop.
              </p>
            </div>

            <div className="guide-card">
              <h3>Rabbit / Small-Game Run Snare</h3>
              <p>
                Find a run (a worn path through grass/brush about rabbit-height). Set a wire loop roughly 4 inches
                in diameter, bottom of the loop about 3–4 inches off the ground, anchored to a stake or nearby
                sapling. Narrow the trail slightly on either side with sticks so the animal has to pass through
                the loop.
              </p>
            </div>

            <div className="guide-card">
              <h3>Twitch-Up Spring Snare</h3>
              <p>
                Same loop placement as a run snare, but tie the anchor line to a bent-over sapling under tension
                instead of a fixed stake, held by a simple trigger (a notched stick catch). Once triggered, the
                sapling snaps upward — this lifts the catch off the ground, which both kills more quickly and
                keeps the catch away from other predators.
              </p>
            </div>
          </div>
        </section>

        <p className="trap-designs-intro">
          The 100 designs below are drawn from a much broader primitive-trapping reference. Almost all of them are
          explicitly framed as practice or demonstration models using a lightweight training weight or dummy
          target rather than a deployable lethal device — tap a design to expand its full materials and
          construction steps.
        </p>

        {TRAP_CATEGORIES.map((category) => (
          <TrapCategorySection key={category.key} category={category} />
        ))}

        <section id="snares-placement" className="guide-section card">
          <h2>📍 Placement Matters More Than the Snare</h2>
          <p>
            An expertly built snare in the wrong spot catches nothing. Look for fresh droppings, tracks, and
            worn-down vegetation before you set anything — that's what tells you an animal is actually using
            that path regularly.
          </p>
        </section>
      </div>
    </>
  )
}

export function Snares() {
  return (
    <Shell>
      <SnaresContent />
    </Shell>
  )
}
