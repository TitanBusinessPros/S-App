import { Shell } from '../components/Shell'
import { GuideDisclaimer } from '../components/GuideDisclaimer'
import '../components/GuidePage.css'

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

      <div className="guide-sections">
        <section className="guide-section card">
          <h2>🩸 Severe Bleeding</h2>
          <ol>
            <li>Apply firm, direct pressure to the wound with the cleanest cloth available.</li>
            <li>Keep pressure on continuously — don't peek or lift the dressing to check.</li>
            <li>
              If bleeding from a limb won't stop and is life-threatening, apply a <strong>tourniquet</strong> 2–3
              inches above the wound (never on a joint), tighten until bleeding stops, and note the time you
              applied it. Leave it in place until you reach professional care.
            </li>
            <li>Elevate the wound above heart level if possible, in addition to pressure.</li>
          </ol>
        </section>

        <section className="guide-section card">
          <h2>🔥 Burns</h2>
          <ol>
            <li>Cool the burn with clean, cool (not ice-cold) water for 10–20 minutes.</li>
            <li>Remove tight clothing/jewelry near the burn before swelling starts.</li>
            <li>Cover loosely with a clean, non-stick dressing. Don't apply butter, oil, or ice.</li>
            <li>Don't pop blisters — they protect against infection.</li>
            <li>Treat burns larger than the person's palm, or on the face/hands/joints, as serious.</li>
          </ol>
        </section>

        <section className="guide-section card">
          <h2>🦴 Fractures &amp; Sprains</h2>
          <ol>
            <li>Immobilize the area in the position you find it — don't try to straighten a deformed limb.</li>
            <li>Splint using rigid material (sticks, trekking poles) padded and secured above and below the injury.</li>
            <li>Check that fingers/toes past the splint stay warm and colored — a too-tight splint cuts circulation.</li>
            <li>For sprains: Rest, Ice/cool water, Compression, Elevation (RICE).</li>
          </ol>
        </section>

        <section className="guide-section card">
          <h2>🥶 Hypothermia</h2>
          <p>Watch for uncontrollable shivering, confusion, slurred speech, and fumbling hands.</p>
          <ol>
            <li>Get the person out of wind and wet clothing; insulate them from the ground.</li>
            <li>Add dry insulation layers and cover the head.</li>
            <li>Share body heat if a shelter/fire isn't immediately available.</li>
            <li>Give warm (not hot), sugary fluids only if they're alert enough to swallow safely. Never give alcohol.</li>
            <li>Handle them gently — rough movement can trigger dangerous heart rhythms in severe cases.</li>
          </ol>
        </section>

        <section className="guide-section card">
          <h2>🥵 Heat Exhaustion &amp; Heat Stroke</h2>
          <p>
            Heat exhaustion: heavy sweating, weakness, nausea, cool clammy skin. Heat stroke (life-threatening):
            hot/dry or flushed skin, confusion, seizures, loss of consciousness — this needs emergency care immediately.
          </p>
          <ol>
            <li>Move to shade, remove excess clothing, and cool the body with water and fanning.</li>
            <li>Cool the neck, armpits, and groin first — that's where large blood vessels sit close to the skin.</li>
            <li>Sip water or an electrolyte drink if alert; don't force fluids on someone who's confused.</li>
            <li>If confusion, seizure, or unconsciousness develops, treat as heat stroke — cool aggressively and get emergency help.</li>
          </ol>
        </section>

        <section className="guide-section card">
          <h2>🐍 Snake Bite</h2>
          <ol>
            <li>Move away from the snake, keep the person calm and still — movement speeds venom spread.</li>
            <li>Keep the bitten limb below heart level and remove rings/watches near the bite before swelling.</li>
            <li>Loosely immobilize the limb like a fracture.</li>
            <li>
              <strong>Do not</strong> cut the wound, try to suck out venom, apply ice, or use a tourniquet on a
              snake bite — all of these are outdated and cause more harm.
            </li>
            <li>Get to emergency care as fast as possible; antivenom is time-sensitive.</li>
          </ol>
        </section>

        <section className="guide-section card">
          <h2>🐝 Stings &amp; Allergic Reactions</h2>
          <ol>
            <li>Scrape a stinger out sideways (credit card edge) rather than pinching — pinching squeezes more venom in.</li>
            <li>Watch for signs of a severe allergic reaction: swelling of the face/throat, difficulty breathing, hives spreading beyond the sting.</li>
            <li>If someone carries an epinephrine auto-injector for known allergies, help them use it immediately and seek emergency care — severe reactions can worsen fast.</li>
          </ol>
        </section>

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
