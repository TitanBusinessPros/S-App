// Structured First Aid reference data — kept separate from FirstAid.tsx so
// the page component just maps over this rather than embedding ~100 rows of
// copy inline. General wilderness first-aid reference information, not a
// substitute for real training or professional medical care (see the
// GuideDisclaimer rendered on the page itself).

export interface FirstAidItem {
  num: number
  problem: string
  action: string
}

export interface FirstAidCategory {
  key: string
  title: string
  emoji: string
  items: FirstAidItem[]
}

/** Applies before treating any specific problem below — scene safety, ABCs,
 * calling for help, and the general judgment calls that matter regardless
 * of the injury or illness. */
export const UNIVERSAL_RESPONSE: string[] = [
  "Make the scene safe: fire, traffic, rockfall, water, lightning, wildlife, and unstable terrain can create a second victim.",
  "Check ABCs: airway, breathing, circulation; treat catastrophic bleeding immediately.",
  "Call for help early: use 911 where available; otherwise activate satellite SOS and give location, injury, number of people, weather, terrain, and your plan.",
  "Prevent heat loss or overheating: insulate the patient from ground, shelter from wind/rain/sun, and use dry layers.",
  "Do not leave a seriously ill or injured person alone unless leaving is the only way to get rescue and it is safe to do so.",
  "Document: time of incident, symptoms, treatments, medicines, allergies, temperature if available, and changes. This helps rescuers.",
  "Turn around early: remote injuries often become worse through continued travel. The National Park Service specifically advises treating, resting, hydrating, eating, and turning around when an injury prevents safe completion.",
]

export const FIRST_AID_CATEGORIES: FirstAidCategory[] = [
  {
    key: "trauma",
    title: "Trauma, Wounds & Movement Injuries",
    emoji: "🩸",
    items: [
      { num: 1, problem: "Life-threatening arm/leg bleeding", action: "Apply firm direct pressure with gauze/cloth. If it will not stop, apply a commercial tourniquet 2–3 inches above the wound, not over a joint; tighten until bleeding stops, note the time, and evacuate urgently. Do not loosen it." },
      { num: 2, problem: "Severe bleeding at groin, armpit, neck, or torso", action: "Pack the wound tightly with hemostatic gauze if trained and equipped, then hold firm pressure; use more dressing rather than removing soaked material. Urgent evacuation." },
      { num: 3, problem: "Minor cut or scrape", action: "Wash hands; irrigate thoroughly with clean treated water, remove visible debris with clean tweezers if easy, apply a thin protective dressing, and monitor for infection." },
      { num: 4, problem: "Deep or gaping laceration", action: "Control bleeding, irrigate, cover with sterile dressing, keep it closed only with gentle support strips if clean and edges meet easily; seek same-day assessment because closure/tetanus may be needed." },
      { num: 5, problem: "Puncture wound", action: "Rinse generously, cover, avoid probing deeply, and get medical advice — especially for dirty, deep, foot, or animal-related punctures. Check tetanus status." },
      { num: 6, problem: "Embedded object", action: "Do not pull it out. Stabilize it with bulky dressings around it, control bleeding without pressing on the object, and evacuate." },
      { num: 7, problem: "Amputation", action: "Control stump bleeding; wrap the detached part in clean moist gauze, place in a sealed bag, then place that bag near — not directly on — ice. Urgent evacuation." },
      { num: 8, problem: "Open fracture", action: "Control bleeding, cover bone/wound with sterile moist dressing, do not push bone back in, splint in the position found, and evacuate urgently." },
      { num: 9, problem: "Suspected closed fracture", action: "Stop activity; check pulse, sensation, and movement below injury; pad and splint the joints above and below without forcing alignment; prevent shock and evacuate." },
      { num: 10, problem: "Sprain", action: "Rest, protect, use a supportive wrap without impairing circulation, elevate if comfortable, and use cold if available through a cloth. Do not hike on a painful unstable joint." },
      { num: 11, problem: "Strain or muscle tear", action: "Stop activity, protect the area, use gentle compression/elevation, and avoid aggressive stretching or massage in the first day." },
      { num: 12, problem: "Dislocation", action: "Do not attempt to reduce it unless you have specific training and circumstances make evacuation impossible. Splint in the found position, check circulation, and evacuate." },
      { num: 13, problem: "Crush injury", action: "Remove the hazard only if safe; control bleeding, protect from cold, monitor closely, and arrange urgent rescue — serious complications can occur even if the person initially seems okay." },
      { num: 14, problem: "Head bump with no red flags", action: "Stop activity, observe for 24–48 hours, avoid alcohol and risky activity, and arrange evaluation if symptoms persist or worsen." },
      { num: 15, problem: "Concussion", action: "Remove from activity immediately. Seek urgent assessment for worsening headache, repeated vomiting, confusion, seizure, unequal pupils, weakness, loss of consciousness, or fluid from ears/nose." },
      { num: 16, problem: "Suspected skull fracture", action: "Keep still, control bleeding with light dressing only, do not press on depressed bone or plug drainage, and activate emergency rescue." },
      { num: 17, problem: "Neck or spinal injury", action: "Assume spinal injury after significant fall, diving accident, high-energy impact, or weakness/numbness. Keep head and neck still, avoid moving them unless unsafe, and call rescue." },
      { num: 18, problem: "Rib injury", action: "Rest, support position of comfort, encourage gentle breaths and coughs if able; do not tightly bind the chest. Evacuate for trouble breathing, worsening pain, or significant trauma." },
      { num: 19, problem: "Chest wound", action: "Cover an open chest wound with a vented chest seal if trained/equipped; if unavailable, loosely cover with plastic taped on three sides. Treat as emergency and evacuate." },
      { num: 20, problem: "Suspected internal bleeding", action: "Think of it after major trauma with pale/clammy skin, weakness, confusion, belly pain/swelling, or fainting. Lay person down if tolerated, keep warm, give nothing by mouth if surgery may be needed, and call rescue." },
      { num: 21, problem: "Abdominal injury or evisceration", action: "Do not push organs back in. Cover with sterile moist dressing and loose plastic wrap, keep knees bent if comfortable, and evacuate urgently." },
      { num: 22, problem: "Pelvic fracture suspicion", action: "After major fall/crash with pelvic, groin, or hip pain: minimize movement, bind pelvis snugly at the level of the greater trochanters if trained, keep warm, and call rescue." },
      { num: 23, problem: "Eye debris", action: "Do not rub. Flush with clean water or saline; blink repeatedly. Cover and seek care if pain, vision change, or retained material remains." },
      { num: 24, problem: "Penetrating eye injury", action: "Do not remove object or apply pressure. Shield both eyes lightly — use a rigid cup over the injured eye — and evacuate urgently." },
      { num: 25, problem: "Chemical in eye", action: "Flush continuously with clean water for at least 15–20 minutes; remove contact lenses if easy after flushing begins; obtain urgent medical care." },
      { num: 26, problem: "Nosebleed", action: "Sit up, lean forward, pinch soft nostrils continuously for 10–15 minutes. Do not tilt head back. Seek help if severe, recurrent, after significant injury, or not stopping." },
      { num: 27, problem: "Tooth knocked out", action: "Handle only by crown, gently rinse if dirty, replace in socket if conscious and safe; otherwise store in milk or saliva, then seek dental care immediately." },
      { num: 28, problem: "Jaw injury", action: "Support jaw gently with a bandage if needed but do not obstruct breathing. No food/drink; evacuate for inability to close mouth, deformity, or breathing risk." },
      { num: 29, problem: "Blister, intact", action: "Protect hot spot early with tape/moleskin; leave roof intact, use a donut pad to offload pressure, keep dry, and modify footwear." },
      { num: 30, problem: "Torn or infected blister", action: "Clean with treated water, leave attached skin if possible, cover with nonstick dressing, reduce friction, and watch for spreading redness, pus, fever, or red streaks." },
      { num: 31, problem: "Foot trench/immersion foot", action: "Remove wet footwear, dry gradually, warm gently, elevate, use dry socks, and stop prolonged wet exposure. Evacuate for numbness, swelling, blisters, or skin breakdown." },
      { num: 32, problem: "Toenail injury/subungual blood", action: "Protect the toe, use roomy footwear, and do not drill a nail unless trained. Seek care for severe throbbing pain, deformity, open wound, or inability to bear weight." },
      { num: 33, problem: "Shoulder strap/pack nerve compression", action: "Stop, adjust or remove load, loosen straps, rest, and assess persistent numbness/weakness; do not continue under a load if neurologic symptoms persist." },
      { num: 34, problem: "Overuse knee pain", action: "Reduce mileage/load, use trekking poles, rest, light compression, and avoid steep descents. Seek evaluation for locking, instability, large swelling, or inability to bear weight." },
      { num: 35, problem: "Achilles or tendon rupture", action: "Sudden pop plus loss of push-off strength is urgent. Immobilize, avoid walking, and evacuate." },
      { num: 36, problem: "Acute back pain", action: "Stop lifting and travel; seek a comfortable position, use gentle movement only, and evacuate urgently for leg weakness, saddle numbness, bladder/bowel changes, fever, or trauma." },
    ],
  },
  {
    key: "environment",
    title: "Heat, Cold, Altitude, Weather, Water & Fire",
    emoji: "⛰️",
    items: [
      { num: 37, problem: "Dehydration", action: "Stop in shade, rest, sip safe water, eat normal food/salty snack if appropriate, and reassess. Evacuate for confusion, fainting, inability to drink, persistent vomiting, or very little urine." },
      { num: 38, problem: "Heat cramps", action: "Stop activity, cool down, drink fluids and eat normal salty food if tolerated; gently stretch only after pain eases. Do not force large volumes of plain water." },
      { num: 39, problem: "Heat exhaustion", action: "Move to shade, remove excess clothing, cool with wet clothing/fanning, give oral fluids if fully alert, and stop exertion for the day. Escalate if mental status changes or cooling fails." },
      { num: 40, problem: "Heat stroke", action: "Emergency: confusion, collapse, seizure, or hot skin during heat exposure. Activate rescue and cool immediately and aggressively — cold-water immersion is best when feasible; otherwise continuous dousing, ice/wet towels at neck/armpits/groin, and fanning. Do not delay cooling for transport." },
      { num: 41, problem: "Sunburn", action: "Get out of sun, cool with water/compresses, hydrate, cover skin, and do not pop blisters. Evacuate for extensive blistering, facial/genital burns, fever, confusion, or dehydration." },
      { num: 42, problem: "Photokeratitis (“snow blindness”)", action: "Get out of UV exposure, use dark eye protection, rest eyes, avoid rubbing and contacts, and seek care for severe pain or vision loss." },
      { num: 43, problem: "Mild hypothermia", action: "Get out of wind/wet clothes, insulate from ground, add dry layers, shelter, warm the torso, and give warm sugary drinks/food only if alert and able to swallow." },
      { num: 44, problem: "Moderate/severe hypothermia", action: "Altered thinking, poor coordination, drowsiness, or unconsciousness requires rescue. Handle gently, prevent further heat loss, insulate fully, avoid rubbing limbs or rapid limb warming, and monitor breathing." },
      { num: 45, problem: "Frostnip", action: "Get into shelter and warm skin gently with body heat; do not rub. Prevent refreezing." },
      { num: 46, problem: "Frostbite", action: "Protect from trauma; remove wet/constricting items. Rapidly rewarm in warm water only if it will not refreeze, then loosely dress and evacuate. Do not rub, pop blisters, or walk on frozen feet if avoidable." },
      { num: 47, problem: "Cold-water immersion", action: "Get person out safely, remove wet layers, insulate and warm core, monitor breathing and mental status, and seek evaluation — afterdrop and hypothermia may develop later." },
      { num: 48, problem: "Drowning/near-drowning", action: "Ensure rescuer safety; get person out, call rescue, begin CPR if not breathing normally, and keep them warm. Anyone with breathing symptoms after submersion needs urgent evaluation." },
      { num: 49, problem: "Lightning strike", action: "Call rescue. It is safe to touch the person once strike has passed; start CPR/AED if needed, treat burns/trauma, and monitor for delayed neurologic or heart symptoms." },
      { num: 50, problem: "Severe thunderstorm exposure", action: "Stop travel; get off summits/ridges/open fields, avoid isolated trees and water, spread group members apart, and shelter in a substantial building or hard-topped vehicle — not a tent." },
      { num: 51, problem: "Flash-flood entrapment", action: "Do not enter moving water or attempt vehicle crossings. Move to higher ground immediately, call rescue, treat cold exposure and trauma after escape." },
      { num: 52, problem: "Windstorm/falling-tree injury", action: "Move only when safe from “widowmakers” and unstable trees; treat trauma/bleeding, shelter from exposure, and call rescue for significant injury." },
      { num: 53, problem: "Wildfire smoke irritation", action: "Leave smoke zone if possible, rest, hydrate, cover nose/mouth with a well-fitting particulate respirator if available, and seek care for wheeze, chest pain, confusion, or severe breathlessness." },
      { num: 54, problem: "Thermal burn", action: "Cool with cool running water for 20 minutes when possible; remove rings/watches and nonadherent clothing, cover loosely with clean nonstick dressing. No ice, butter, or popping blisters." },
      { num: 55, problem: "Major burn", action: "Activate rescue for large, deep, circumferential, electrical, chemical, facial, hand, foot, genital, or airway burns. Cover loosely, prevent hypothermia, and do not apply ointments." },
      { num: 56, problem: "Campfire or stove clothing fire", action: "Stop, drop, roll; extinguish flames, cool burn, remove smoldering items if not stuck, and assess for inhalation injury." },
      { num: 57, problem: "Smoke inhalation", action: "Move to fresh air immediately. Call emergency services for hoarseness, facial burns, soot around mouth/nose, persistent cough, confusion, or breathing difficulty — airway swelling can worsen later." },
      { num: 58, problem: "Carbon monoxide poisoning", action: "Suspect headache, nausea, dizziness, confusion, or collapse near a stove, heater, vehicle, or enclosed shelter. Move to fresh air without becoming a victim, call rescue, and do not re-enter until safe." },
      { num: 59, problem: "Acute mountain sickness", action: "Headache plus nausea, fatigue, dizziness, or poor sleep after ascent: stop ascending, rest, hydrate normally, and descend if symptoms worsen or do not improve." },
      { num: 60, problem: "High-altitude cerebral edema", action: "Ataxia, confusion, severe lethargy, or altered behavior at altitude: descend immediately with help, give oxygen if available, protect from cold, and call rescue." },
      { num: 61, problem: "High-altitude pulmonary edema", action: "Breathlessness at rest, cough, weakness, crackles, or blue lips: descend immediately, keep warm, give oxygen if available, and activate rescue." },
      { num: 62, problem: "Waterborne diarrhea", action: "Stop using the suspected water/food, treat water reliably, prioritize oral rehydration, and seek care for blood in stool, high fever, severe pain, dehydration, or symptoms lasting several days. Field water treatment may use boiling, filtration, UV, or chemical disinfection depending on conditions and device limits." },
      { num: 63, problem: "Vomiting illness", action: "Rest, take frequent small sips of oral rehydration solution or safe fluids, avoid exertion, and evacuate for inability to retain fluids, blood, severe pain, confusion, or dehydration." },
      { num: 64, problem: "Food poisoning", action: "Hydrate, rest, preserve a food sample/package if an outbreak is possible, and seek care for neurologic symptoms, bloody diarrhea, fever, dehydration, or severe/prolonged illness." },
      { num: 65, problem: "Soap or food-related allergic stomach upset", action: "Stop the suspected exposure, hydrate cautiously, monitor for hives, swelling, wheeze, or faintness — which suggests anaphylaxis rather than simple stomach upset." },
      { num: 66, problem: "Water treatment failure", action: "Stop drinking untreated/uncertain water. Switch to a known safe source or use your method exactly as its maker directs; filters, UV, chemicals, and boiling have different limitations." },
    ],
  },
  {
    key: "bites",
    title: "Bites, Stings, Plants & Infections",
    emoji: "🐍",
    items: [
      { num: 67, problem: "Anaphylaxis", action: "Hives plus breathing trouble, throat/tongue swelling, faintness, or repeated vomiting after exposure: use prescribed epinephrine auto-injector immediately, call 911/SOS, lay flat with legs raised if tolerated, and give a second device if symptoms persist and one is prescribed." },
      { num: 68, problem: "Mild allergic reaction", action: "Remove exposure, cool skin, consider a personal antihistamine only if safe for that person, and monitor closely. Escalate immediately if airway, breathing, circulation, or severe GI symptoms begin." },
      { num: 69, problem: "Bee/wasp/hornet sting", action: "Move away; scrape off a honeybee stinger if present, wash, apply cold pack, and monitor for anaphylaxis. Multiple stings or mouth/throat stings need urgent care." },
      { num: 70, problem: "Tick attached", action: "Use fine tweezers close to skin and pull steadily upward; clean area and hands, note date/location, and watch for fever, rash, fatigue, or joint symptoms. Do not burn, smother, or twist the tick." },
      { num: 71, problem: "Tick-borne illness symptoms", action: "Fever, expanding rash, severe headache, or flu-like illness after a tick bite needs prompt medical evaluation; do not wait for a classic rash." },
      { num: 72, problem: "Mosquito bites", action: "Clean, avoid scratching, use cold compress/anti-itch measures, and watch for fever or systemic illness depending on region/travel history." },
      { num: 73, problem: "Spider bite, uncertain species", action: "Wash, apply cool compress, elevate if possible, and seek care for severe pain, spreading redness, muscle cramps, vomiting, fever, or breathing symptoms. Capture photo only if safe." },
      { num: 74, problem: "Suspected venomous snakebite", action: "Move away; keep person still, remove rings/tight clothing, immobilize limb in neutral position, call 911/SOS, and evacuate urgently. No cutting, sucking, ice, tourniquet, electric shock, or snake capture." },
      { num: 75, problem: "Scorpion sting", action: "Wash, cool compress, keep still, and seek urgent care for breathing trouble, muscle twitching, abnormal eye movements, severe pain, or a sting in a child." },
      { num: 76, problem: "Jellyfish or marine sting", action: "Get out of water, avoid rubbing, carefully remove tentacles with a tool/glove, rinse according to local lifeguard guidance, control pain with hot-water immersion if advised, and seek care for systemic symptoms." },
      { num: 77, problem: "Sea-urchin spine", action: "Remove superficial spines only if easy with clean tweezers; do not dig deeply. Soak in hot — not scalding — water for pain and seek care for deep/joint/foot spines or infection signs." },
      { num: 78, problem: "Fishhook injury", action: "Cut line and stabilize; do not force removal if near eye, face, joint, tendon, or deeply embedded. Cover and seek care; simple barbed-hook removal is best done by trained people." },
      { num: 79, problem: "Animal bite", action: "Wash vigorously with soap and running water for 15 minutes, control bleeding, cover, and seek prompt medical evaluation for infection, tetanus, and rabies assessment." },
      { num: 80, problem: "Bat contact", action: "Any bite, scratch, or possible saliva contact with a bat — even if marks are hard to see — needs immediate public-health/medical advice for rabies prevention." },
      { num: 81, problem: "Bear or large-mammal attack injury", action: "Once safe, control major bleeding, treat shock, cover wounds, and activate emergency rescue. Do not approach wildlife; keep food secured and campsite clean to reduce encounters." },
      { num: 82, problem: "Poison ivy/oak/sumac", action: "Wash skin and gear promptly with soap and cool water, avoid scratching, use cool compresses, and seek care for face/genital involvement, widespread blistering, infection, or breathing symptoms." },
      { num: 83, problem: "Stinging nettle", action: "Rinse gently, avoid rubbing, remove visible hairs with tape if possible, apply cool compress, and monitor for severe allergic symptoms." },
      { num: 84, problem: "Toxic plant ingestion", action: "Remove plant material from mouth, rinse mouth, do not induce vomiting, save a photo/sample if safe, and call Poison Control at 1-800-222-1222 in the U.S. or 911 for severe symptoms." },
      { num: 85, problem: "Mushroom ingestion", action: "Treat as potentially serious: save specimens/photos, call Poison Control immediately, do not wait for symptoms, and seek emergency care for vomiting, diarrhea, confusion, jaundice, or lethargy." },
      { num: 86, problem: "Skin infection/cellulitis", action: "Clean and cover skin breaks; mark the outer edge of redness and seek prompt care for spreading redness, warmth, swelling, pus, fever, red streaks, or increasing pain." },
      { num: 87, problem: "Abscess/boil", action: "Keep clean and covered; use warm compresses, but do not cut or squeeze it. Seek care for fever, spreading redness, severe pain, or facial involvement." },
      { num: 88, problem: "Tetanus-prone wound", action: "Clean thoroughly and seek medical advice promptly if the wound is dirty/deep and your tetanus vaccination is not current or you do not know your status." },
      { num: 89, problem: "Rabies-risk exposure", action: "Immediately wash the wound thoroughly with soap and water for 15 minutes, then contact public health/medical care urgently; do not wait for symptoms." },
      { num: 90, problem: "Leptospirosis-risk water exposure", action: "Cover cuts before freshwater exposure, rinse after exposure, and seek medical evaluation for fever, severe headache, muscle pain, red eyes, or jaundice after contaminated-water contact." },
    ],
  },
  {
    key: "emergencies",
    title: "Medical Emergencies & Evacuation Decisions",
    emoji: "🚑",
    items: [
      { num: 91, problem: "Severe asthma attack", action: "Help use the person's prescribed rescue inhaler/spacer, move away from smoke/allergen/exertion, sit upright, and call rescue for severe breathlessness, blue lips, exhaustion, or poor response." },
      { num: 92, problem: "Chest pain/possible heart attack", action: "Stop activity, call 911/SOS, keep the person resting in a comfortable position, assist with their prescribed medication if applicable, and use aspirin only if emergency dispatch/clinician advises and there is no allergy or bleeding risk." },
      { num: 93, problem: "Cardiac arrest", action: "Call 911/SOS, start CPR immediately, use an AED as soon as available, and continue until signs of life or rescuers take over." },
      { num: 94, problem: "Stroke signs", action: "Face droop, arm weakness, speech difficulty, sudden severe imbalance or vision change: note last-known-well time, call rescue, keep them safe, and give no food/drink." },
      { num: 95, problem: "Seizure", action: "Protect from injury, cushion head, time it, turn onto side after shaking stops, do not restrain or put anything in the mouth, and call rescue for a first seizure, >5 minutes, repeats, injury, pregnancy, or breathing issue." },
      { num: 96, problem: "Fainting", action: "Lay flat and raise legs if no trauma/breathing issue, loosen tight clothing, cool or warm as needed, and assess for chest pain, bleeding, pregnancy, persistent confusion, or repeat episodes." },
      { num: 97, problem: "Diabetic low blood sugar", action: "If awake and able to swallow, give 15–20 g fast sugar — glucose gel/tablets, juice, regular soda — then recheck/reassess after 15 minutes and follow with food. If unconscious or unable to swallow, do not give anything orally; use prescribed glucagon if available and call rescue." },
      { num: 98, problem: "Diabetic high blood sugar/ketone concern", action: "If the person has diabetes plus excessive thirst/urination, vomiting, abdominal pain, deep breathing, or confusion, follow their medical plan, hydrate only if alert, check glucose/ketones if available, and seek urgent care." },
      { num: 99, problem: "Poisoning or medication overdose", action: "Remove from source safely, do not induce vomiting or give “neutralizers,” save container/name/dose/time, and call Poison Control at 1-800-222-1222 or 911 for collapse, seizure, breathing trouble, or unknown ingestion." },
      { num: 100, problem: "Panic, acute distress, or evacuation dilemma", action: "Move to safety, speak calmly, slow breathing, reduce cold/heat/noise, do not dismiss physical symptoms, and choose rescue/evacuation if there is danger, impaired decision-making, suicidal thoughts, or uncertainty about a serious medical condition." },
    ],
  },
]

export const FIRST_AID_ITEM_COUNT = FIRST_AID_CATEGORIES.reduce((total, category) => total + category.items.length, 0)
