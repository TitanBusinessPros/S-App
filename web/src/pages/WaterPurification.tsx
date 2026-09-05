import { Shell } from '../components/Shell'
import { GuideDisclaimer } from '../components/GuideDisclaimer'
import '../components/GuidePage.css'

const BOTTLE_DIAGRAM = `[OPEN TOP]
  ↓
Coarse rocks/gravel (pre-strain big debris)
  ↓
Fine sand (mechanical filtration)
  ↓
Crushed hardwood charcoal (adsorption: taste/odor/organics)
  ↓
Fine sand (catch charcoal fines)
  ↓
Cloth/coffee filter at neck (final barrier)
  ↓
[CAP with small holes or no cap, dripping into clean container]`

export function WaterPurificationContent() {
  return (
    <>
      <div className="guide-header">
        <h1>💧 Water Purification &amp; Treatment</h1>
        <p>
          25 improvised filter builds from whatever you have on hand — plus the one step none of them replace:
          disinfecting what comes out the other end.
        </p>
      </div>

      <GuideDisclaimer>
        Every filter on this page removes sediment and improves taste and clarity — none of them reliably make
        water safe to drink on their own. Always disinfect (boil, bleach, chlorine dioxide, or SODIS) after
        filtering, every time, no exceptions.
      </GuideDisclaimer>

      <div className="guide-sections">
        <section className="guide-section card">
          <h2>🧪 Classic Bottle Filter — Layer Diagram</h2>
          <p>Use this layout for any build that says "bottle, cut bottom, layers top→bottom."</p>
          <pre className="mono guide-diagram">{BOTTLE_DIAGRAM}</pre>
          <p>
            <strong>Assembly, any bottle build:</strong> cut the bottom off, invert the bottle, place cloth in
            the neck, then add layers in the order above, tamp lightly, and drip into a clean pot/bottle.
          </p>
        </section>

        <section className="guide-section card">
          <h2>🍶 Bottle &amp; Container Builds</h2>
        </section>
        <div className="guide-subgrid">
          <div className="guide-card">
            <h3>1. Classic 2L Bottle Biofilter</h3>
            <p><strong>Need:</strong> 2L plastic bottle, knife/scissors, cloth/coffee filter, sand, hardwood charcoal, small gravel/rocks.</p>
            <p><strong>Make:</strong> Cut bottom off. Punch a few small holes in the cap (or leave it off and use a cloth plug). Put cloth in the neck. Add layers top→bottom: rocks → sand → charcoal → sand (optional thin cloth between sand and charcoal).</p>
            <p><strong>Use:</strong> Pour pre-strained water in the top; collect drips in a clean container; then disinfect.</p>
          </div>

          <div className="guide-card">
            <h3>2. Two-Bottle Gravity Filter</h3>
            <p><strong>Need:</strong> 2 plastic bottles (one cut), cloth, sand, charcoal, gravel.</p>
            <p><strong>Make:</strong> Cut bottom off bottle A. Fit cloth in its neck. Fill A: sand → charcoal → sand → gravel. Invert A into bottle B so drips fall into B.</p>
            <p><strong>Use:</strong> Pour water into A; collect in B; disinfect.</p>
          </div>

          <div className="guide-card">
            <h3>3. Bucket Gravity Filter</h3>
            <p><strong>Need:</strong> clean food-grade bucket with lid (or large jug), hose/spigot optional, cloth, sand, charcoal, gravel.</p>
            <p><strong>Make:</strong> If using a spigot, install it near the bottom. Inside, layer from bottom up: gravel → sand → charcoal → sand → cloth on top.</p>
            <p><strong>Use:</strong> Pour water onto the cloth layer; let it drip through; collect from the spigot or bottom; disinfect.</p>
          </div>

          <div className="guide-card">
            <h3>8. Coffee-Filter + Sand Mini-Filter</h3>
            <p><strong>Need:</strong> cut bottle, cone coffee filter, sand, crushed charcoal.</p>
            <p><strong>Make:</strong> Place a coffee filter in the neck. Add: thin sand → thin charcoal → sand.</p>
            <p><strong>Use:</strong> Drip into a clean container; disinfect.</p>
          </div>

          <div className="guide-card">
            <h3>9. Cotton-Ball Plug Filter</h3>
            <p><strong>Need:</strong> bottle, cotton balls, sand, charcoal, cloth.</p>
            <p><strong>Make:</strong> Pack cotton balls tightly in the neck. Add sand → charcoal → sand above.</p>
            <p><strong>Use:</strong> Pour water in the top; collect drips; disinfect.</p>
          </div>

          <div className="guide-card">
            <h3>17. Dual-Stage Bottle (Mechanical Then Adsorptive)</h3>
            <p><strong>Need:</strong> 2 bottles, cloth, gravel, sand, charcoal.</p>
            <p><strong>Make:</strong> Bottle A: gravel → sand (mechanical). Bottle B: charcoal → sand (adsorptive).</p>
            <p><strong>Use:</strong> Pour through A, then B; collect and disinfect.</p>
          </div>

          <div className="guide-card">
            <h3>18. Pot-and-Cloth Drip Filter</h3>
            <p><strong>Need:</strong> pot, clean cloth, sand, charcoal, cord.</p>
            <p><strong>Make:</strong> Secure cloth over the pot mouth with cord; add sand → charcoal → sand on top of the cloth.</p>
            <p><strong>Use:</strong> Pour water onto the layers; collect in the pot; disinfect.</p>
          </div>

          <div className="guide-card">
            <h3>20. Tin-Can Filter</h3>
            <p><strong>Need:</strong> clean tin can, nail/awl, cloth, sand, charcoal.</p>
            <p><strong>Make:</strong> Punch many small holes in the bottom. Line the inside bottom with cloth. Fill: sand → charcoal → sand.</p>
            <p><strong>Use:</strong> Suspend over a container; pour; disinfect the drips.</p>
          </div>

          <div className="guide-card">
            <h3>22. Paper-Towel Cone Filter (Short-Term Clarity)</h3>
            <p><strong>Need:</strong> cut bottle, paper towels, sand, charcoal.</p>
            <p><strong>Make:</strong> Form a thick cone of paper towels in the neck; add sand → charcoal → sand.</p>
            <p><strong>Use:</strong> Drip into a container; replace the paper when soggy; disinfect.</p>
          </div>
        </div>

        <section className="guide-section card">
          <h2>🌿 Natural Material Builds</h2>
        </section>
        <div className="guide-subgrid">
          <div className="guide-card">
            <h3>4. Bamboo Stem Filter</h3>
            <p><strong>Need:</strong> thick bamboo section (~12–18"), knife, cord, cloth, sand, charcoal, fine grass/moss.</p>
            <p><strong>Make:</strong> Cut a node to make a tube. Tie cloth over the bottom end. Fill: grass/moss → sand → charcoal → sand.</p>
            <p><strong>Use:</strong> Hang vertically over a pot; pour water in the top; collect drips; disinfect.</p>
          </div>

          <div className="guide-card">
            <h3>5. Hollow-Log Filter</h3>
            <p><strong>Need:</strong> straight hollow branch/log (~12"), cloth/cord, sand, charcoal, grass.</p>
            <p><strong>Make:</strong> Plug one end with cloth. Fill: grass → sand → charcoal → sand.</p>
            <p><strong>Use:</strong> Suspend over a container; pour slowly; disinfect the output.</p>
          </div>

          <div className="guide-card">
            <h3>6. Birch-Bark Cone Filter</h3>
            <p><strong>Need:</strong> pliable bark (birch best), cord, cloth, sand, charcoal.</p>
            <p><strong>Make:</strong> Form a cone from bark; stitch/tie the seam. Tie cloth at the tip. Fill: fine grass → sand → charcoal → sand.</p>
            <p><strong>Use:</strong> Hang and drip into a pot; disinfect.</p>
          </div>

          <div className="guide-card">
            <h3>10. Moss-and-Sand Forest Filter</h3>
            <p><strong>Need:</strong> bottle or bark cone, sphagnum/dry moss, sand, charcoal.</p>
            <p><strong>Make:</strong> Layer: moss (top) → sand → charcoal → sand.</p>
            <p><strong>Use:</strong> Drip into a pot; disinfect.</p>
          </div>

          <div className="guide-card">
            <h3>11. Grass-Layer Desert Filter</h3>
            <p><strong>Need:</strong> bottle/cone, dry fine grasses, sand, charcoal, cloth.</p>
            <p><strong>Make:</strong> Cloth at the neck; then grass → sand → charcoal → sand.</p>
            <p><strong>Use:</strong> Pour slowly; replace the grass when clogged; disinfect.</p>
          </div>

          <div className="guide-card">
            <h3>12. Pine-Needle Pre-Filter Mat</h3>
            <p><strong>Need:</strong> cone/bottle, clean pine needles, sand, charcoal.</p>
            <p><strong>Make:</strong> Pack a 1–2" mat of needles at the top; below: sand → charcoal → sand.</p>
            <p><strong>Use:</strong> Strain debris with the needles; drip into a container; disinfect.</p>
          </div>

          <div className="guide-card">
            <h3>19. Gourd/Coconut Shell Filter</h3>
            <p><strong>Need:</strong> hollowed gourd or coconut shell, cloth, sand, charcoal, grass.</p>
            <p><strong>Make:</strong> Plug the opening with cloth; fill: grass → sand → charcoal → sand.</p>
            <p><strong>Use:</strong> Hang and drip; disinfect.</p>
          </div>
        </div>

        <section className="guide-section card">
          <h2>🪨 Pre-Filters &amp; Coarse Sediment Filters</h2>
          <p>Use these first on very cloudy or muddy water, then run the output through a finer filter above.</p>
        </section>
        <div className="guide-subgrid">
          <div className="guide-card">
            <h3>7. T-Shirt/Bandana Pre-Filter</h3>
            <p><strong>Need:</strong> clean T-shirt/bandana, container.</p>
            <p><strong>Make:</strong> Stretch cloth over the container mouth; secure with cord/rubber band.</p>
            <p><strong>Use:</strong> Pour cloudy water through to remove grit; then run through a finer filter and disinfect.</p>
          </div>

          <div className="guide-card">
            <h3>16. Rock-and-Gravel Coarse Filter</h3>
            <p><strong>Need:</strong> container with holes or cut bottle, graduated rocks/gravel, cloth.</p>
            <p><strong>Make:</strong> Layer large rocks → smaller rocks → gravel → cloth at the outlet.</p>
            <p><strong>Use:</strong> Pour very silty water through this first; then run through a fine filter; disinfect.</p>
          </div>

          <div className="guide-card">
            <h3>21. Sock Filter (Quick Pre-Filter)</h3>
            <p><strong>Need:</strong> clean sock, container.</p>
            <p><strong>Make:</strong> Stretch the sock over the container; secure.</p>
            <p><strong>Use:</strong> Pour water through to remove debris; then fine-filter and disinfect.</p>
          </div>

          <div className="guide-card">
            <h3>25. Rapid Heavy-Sediment Filter (Multi-Pass)</h3>
            <p><strong>Need:</strong> cut bottle or bucket, rocks, gravel, coarse sand, cloth.</p>
            <p><strong>Make:</strong> Layer: large rocks → gravel → coarse sand → cloth at the outlet.</p>
            <p><strong>Use:</strong> Pour very muddy water through; repeat 2–3 times until much clearer; then run through a fine filter and disinfect.</p>
          </div>
        </div>

        <section className="guide-section card">
          <h2>⚫ Charcoal-Focused &amp; Special Builds</h2>
        </section>
        <div className="guide-subgrid">
          <div className="guide-card">
            <h3>13. Charcoal-Only Emergency Filter</h3>
            <p><strong>Need:</strong> cloth pouch or bottle neck, crushed hardwood charcoal.</p>
            <p><strong>Make:</strong> Fill a cloth pouch or bottle neck with charcoal; secure.</p>
            <p><strong>Use:</strong> Pour pre-strained water through; repeat 2–3 passes for better clarity; disinfect.</p>
          </div>

          <div className="guide-card">
            <h3>14. Sand-Only Slow Filter (SODIS Pre-Treatment)</h3>
            <p><strong>Need:</strong> bottle or small bucket, clean sand, cloth.</p>
            <p><strong>Make:</strong> Cloth at the outlet; fill with 6–12" of sand.</p>
            <p><strong>Use:</strong> Filter to reduce turbidity, then put the output in clear bottles for SODIS (6+ hours of sun).</p>
          </div>

          <div className="guide-card">
            <h3>15. Charcoal Pouch Drip</h3>
            <p><strong>Need:</strong> clean cloth, crushed charcoal, container.</p>
            <p><strong>Make:</strong> Tie charcoal inside cloth as a pouch.</p>
            <p><strong>Use:</strong> Hang the pouch over a container; pour water through; disinfect the output.</p>
          </div>

          <div className="guide-card">
            <h3>23. Trench Seep Filter (Camp)</h3>
            <p><strong>Need:</strong> shovel/knife, rocks, gravel, sand, charcoal, cloth.</p>
            <p><strong>Make:</strong> Near (not in) a stream, dig a shallow hole. Line the bottom/sides with cloth; fill: rocks → gravel → sand → charcoal → sand.</p>
            <p><strong>Use:</strong> Let water seep in from the side; bail clear water from the hole; disinfect.</p>
          </div>

          <div className="guide-card">
            <h3>24. Solar Pre-Treatment + Bottle Filter Combo</h3>
            <p><strong>Need:</strong> cloth, a bottle filter (#1 or #2), clear PET bottles.</p>
            <p><strong>Make/Use:</strong> Pre-filter through cloth → run through the bottle filter → fill clear bottles and leave in full sun 6+ hours (SODIS).</p>
          </div>
        </div>

        <section className="guide-section card">
          <h2>🧂 Preparing Filter Media (Quick)</h2>
          <ul>
            <li><strong>Sand:</strong> rinse if possible; aim for fine, uniform grains.</li>
            <li><strong>Charcoal:</strong> use hardwood coals from a clean fire; crush to pea-size or smaller; avoid soft/sooty bits.</li>
            <li><strong>Cloth:</strong> use the cleanest you have; wash/rinse before first use.</li>
          </ul>
        </section>

        <section className="guide-section card">
          <h2>☠️ Disinfect After Filtering — Always (Pick One)</h2>
          <ul>
            <li><strong>Boil:</strong> 1 minute (3 minutes above 6,500 ft).</li>
            <li><strong>Bleach:</strong> 8 drops of unscented 6–8.25% bleach per gallon of clear water; wait 30 minutes (double the wait if the water is cloudy).</li>
            <li><strong>Chlorine dioxide tablets:</strong> follow the label (often 30 min–4 hr).</li>
            <li><strong>SODIS:</strong> clear bottles in full sun for 6 hours; pre-filter to low turbidity first.</li>
          </ul>
        </section>
      </div>
    </>
  )
}

export function WaterPurification() {
  return (
    <Shell>
      <WaterPurificationContent />
    </Shell>
  )
}
