import { Shell } from '../components/Shell'
import { GuideDisclaimer } from '../components/GuideDisclaimer'
import '../components/GuidePage.css'

export function ShelterContent() {
  return (
    <>
      <div className="guide-header">
        <h1>Shelter Building</h1>
        <p>Which shelter to build depends more on your climate and materials than your exact GPS coordinates. Pick the one that matches your conditions below.</p>
      </div>

      <GuideDisclaimer>
        Site selection matters as much as the shelter itself — see the siting rules before you start building.
      </GuideDisclaimer>

      <div className="guide-sections">
        <section className="guide-section card">
          <h2>📍 Where to Build (any climate)</h2>
          <ul>
            <li><strong>Avoid</strong> dry creek beds and low ground — flash floods.</li>
            <li><strong>Avoid</strong> ridgelines and lone tall trees — wind and lightning exposure.</li>
            <li><strong>Avoid</strong> standing dead trees or large dead branches overhead ("widowmakers").</li>
            <li>Look for natural windbreaks — a rock face, thick brush, or a fallen log to build against.</li>
            <li>Build near (not on top of) your water and firewood sources to cut down on trips.</li>
          </ul>
        </section>

        <div className="guide-subgrid">
          <div className="guide-card">
            <h3>🌲 Temperate Forest — Debris Hut</h3>
            <p>
              Best when you have deadfall and dry leaf litter. Lean a ridgepole against a stump or forked stick,
              rib it with smaller branches on both sides, then pile debris (leaves, pine needles, brush) at least
              2 feet thick — thickness is what insulates, not the branches. Leave just enough of an entrance to
              crawl in, and block it behind you with a debris "door."
            </p>
          </div>

          <div className="guide-card">
            <h3>🏜️ Desert — Shade Shelter</h3>
            <p>
              Heat and sun exposure are the danger, not cold nights. Build low to the ground to avoid wind-driven
              heat, use a double layer of material (tarp, poncho, brush) with an air gap between layers to block
              radiant heat, and dig down slightly — the ground a foot below the surface is noticeably cooler.
              Shelter in the shade during the day; you can travel at night if needed.
            </p>
          </div>

          <div className="guide-card">
            <h3>❄️ Snow / Cold Climate — Quinzhee or Snow Trench</h3>
            <p>
              Pile snow into a mound, let it sinter (harden) for 1–2 hours, then hollow it out with an entrance
              lower than the sleeping platform — cold air sinks and drains out, keeping the sleeping area
              warmer. Never seal it airtight; always leave a ventilation hole to avoid carbon dioxide buildup,
              especially if you're using any kind of flame inside.
            </p>
          </div>

          <div className="guide-card">
            <h3>🌧️ Wet / Rainy — Lean-To</h3>
            <p>
              Fastest shelter to build with a tarp, poncho, or large bark sheets. Angle it against the prevailing
              wind and rain direction, keep the low edge close to the ground, and raise your sleeping area off
              wet ground with a bed of branches or leaves underneath you — ground contact is often what actually
              gets people wet and cold overnight.
            </p>
          </div>
        </div>

        <section className="guide-section card">
          <h2>🛌 Insulate Underneath, Not Just Around You</h2>
          <p>
            Ground contact pulls heat away from your body faster than cold air does. In any shelter, put down at
            least as much insulation underneath you as you have covering you — a pile of dry leaves, pine boughs,
            or bark works even without a sleeping pad.
          </p>
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
