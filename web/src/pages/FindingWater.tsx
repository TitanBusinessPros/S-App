import { Shell } from '../components/Shell'
import { GuideDisclaimer } from '../components/GuideDisclaimer'
import '../components/GuidePage.css'

export function FindingWaterContent() {
  return (
    <>
      <div className="guide-header">
        <h1>Finding Water</h1>
        <p>Where water sits underground, and how deep, varies enormously by local geology — there's no single reliable number. These are the indicators experienced trackers actually use to find it.</p>
      </div>

      <GuideDisclaimer>
        Untreated water can carry parasites and bacteria even if it looks clean. Filter and/or boil for at least
        1 minute (3 minutes above 6,500 ft) before drinking whenever you have the means to.
      </GuideDisclaimer>

      <div className="guide-sections">
        <section className="guide-section card">
          <h2>👀 Reliable Indicators, Not Guesses</h2>
          <ul>
            <li><strong>Green vegetation</strong> in an otherwise dry landscape — plants don't grow deep roots for no reason.</li>
            <li><strong>Insect swarms</strong> at dusk, and converging animal trails — animals travel toward water on a schedule, especially near dawn and dusk.</li>
            <li><strong>Low points and valleys</strong> — water follows gravity; a dry-looking valley floor is a better bet than a ridge.</li>
            <li><strong>Outside bends of dry riverbeds</strong> — water undercuts the outer bank last as a stream dries up, so it often lingers there longest, just under the surface.</li>
            <li><strong>Rock seeps</strong> — a damp streak on an exposed rock face, even a small one, usually means a spring nearby.</li>
          </ul>
        </section>

        <section className="guide-section card">
          <h2>⛏️ Where to Dig</h2>
          <p>
            If you've found one of the indicators above but no visible water, dig at the <strong>lowest point</strong>{' '}
            of that spot — the outside bend of a dry creek, or the base of a green patch. Depth to water is
            genuinely unpredictable without local data (it can be inches in a wet riverbed or many feet in dry
            terrain) — dig a small test hole first rather than committing to a large pit. If it's dry at 2–3 feet
            with no dampness at all in the soil, move to a different spot rather than digging deeper blind.
          </p>
        </section>

        <section className="guide-section card">
          <h2>☀️ Solar Still</h2>
          <p>Works even in genuinely dry terrain, using ground moisture rather than a visible water source:</p>
          <ol>
            <li>Dig a bowl-shaped pit about 3 feet across, 2 feet deep, in sun-exposed ground.</li>
            <li>Place a container in the center of the pit.</li>
            <li>Cover the pit with plastic sheeting, weighted at the edges with soil to seal it.</li>
            <li>Place a small stone in the center of the sheeting so it dips directly over the container.</li>
            <li>Condensation collects on the underside of the plastic and drips into the container. Yields are small — plan on this as a supplement, not a primary source.</li>
          </ol>
        </section>

        <section className="guide-section card">
          <h2>🌳 Transpiration Bag</h2>
          <p>
            Tie a clear plastic bag around a leafy, sun-exposed tree branch (avoid known-toxic species). The
            plant's own transpiration condenses inside the bag over a few hours. Low yield per bag, but several
            bags on different branches add up, and it costs almost nothing to set up while you do other tasks.
          </p>
        </section>

        <section className="guide-section card">
          <h2>🌅 Dew Collection</h2>
          <p>
            In the early morning, tie absorbent cloth around your ankles and walk through grass, or lay cloth
            over low vegetation overnight and wring it out at dawn — dew often provides more usable water than
            people expect, and it requires no digging or equipment.
          </p>
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
