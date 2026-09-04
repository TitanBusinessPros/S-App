import { describe, expect, it } from 'vitest'
import {
  FISH_SAFETY_GUIDE,
  FROG_SAFETY_GUIDE,
  INSECT_SAFETY_GUIDE,
  BEETLE_GUIDE,
  CATERPILLAR_GUIDE,
  ANT_GUIDE,
  BEE_WASP_GUIDE,
  OTHER_INSECTS_GUIDE,
  LIZARD_GUIDE,
  TURTLE_GUIDE,
  SNAKE_GUIDE,
  CRAWFISH_GUIDE,
  MUSSEL_GUIDE,
  PROTECTED_BIRDS_GUIDE,
  RECIPES,
  RECIPE_SAFETY_RULES,
  RECIPE_CATEGORIES,
  groupRecipesByAnimal,
  groupRecipesByLetter,
  getCategoryRecipes,
} from './recipesData'

const BIRDS = ['Turkey', 'Quail', 'Pheasant', 'Dove', 'Duck', 'Goose', 'Coot', 'Crane', 'Other Small Game Birds']
const FISH = [
  'Bass', 'Crappie', 'Catfish', 'Gar', 'Buffalo', 'Carp', 'Sucker', 'Freshwater Drum', 'Sunfish', 'Minnows',
  'Pike', 'Walleye', 'Perch', 'Trout', 'Salmon', 'Steelhead', 'Striped Bass', 'Redfish', 'Flounder',
  'Red Snapper', 'Sheepshead', 'Mullet', 'Bowfin', 'Eel', 'Paddlefish', 'Sturgeon',
]
const FROGS = ['Bullfrog', 'Leopard Frog', 'Pickerel Frog', 'Wood Frog', 'Green Frog', 'Tree Frog']
const CRAWFISH = [
  'Crawfish', 'White River Crawfish', 'Virile Crayfish', 'Signal Crayfish', 'Rusty Crayfish',
  'Ringed Crayfish', 'Big River-Type Crayfish', 'Small Native Crayfish',
]
const MUSSELS = ['Asian Clam', 'Freshwater Snails', 'Large Freshwater Snails']
const INSECTS = [
  'Field Crickets', 'House Crickets', 'Tree Crickets', 'Grasshoppers', 'Differential Grasshopper',
  'Two-Striped Grasshopper', 'Katydids', 'Mormon Cricket', 'Locusts',
]
const BEETLES = [
  'June Beetles', 'June Beetle Grubs', 'Weevils', 'Longhorn Beetle Larvae', 'Stag Beetles',
  'Darkling Beetle Larvae', 'Mealworms', 'Superworms',
]
// Beetle groups covered only in BEETLE_GUIDE's species-status list — no recipe, by design.
const BEETLE_GUIDE_ONLY = ['Japanese Beetles', 'Dung Beetles', 'Water Beetles', 'Predaceous Diving Beetles', 'Water Scavenger Beetles', 'Buprestid Beetle Larvae']
// New "animal" groups introduced by the moth/caterpillar/grub/fly/aquatic-larva batch, each with at least one recipe.
const CATERPILLAR_BATCH_ANIMALS = ['Caterpillars', 'Beetle Grubs', 'Black Soldier Fly Larvae', 'Caddisfly Larvae']
// Larva groups covered only in CATERPILLAR_GUIDE's species-status list — no recipe, by design.
const CATERPILLAR_GUIDE_ONLY = ['Fly Maggots', 'Mosquito Larvae', 'Mayfly Nymphs']
const ANTS = ['Honeypot Ants', 'Carpenter Ants', 'Field Ants', 'Harvester Ants', 'Leafcutter Ants', 'Ant Brood']
// Ant groups covered only in ANT_GUIDE's species-status list — no recipe, by design.
const ANT_GUIDE_ONLY = ['Fire Ants', 'Pavement Ants']
const BEES_AND_WASPS = ['Honey Bee', 'Bumblebee', 'Paper Wasps', 'Yellowjacket', 'Wasp Brood']
// Bee/wasp groups covered only in BEE_WASP_GUIDE's species-status list — no recipe, by design.
const BEE_WASP_GUIDE_ONLY = ['Solitary Bees', 'Solitary Wasps']
const OTHER_INSECTS = ['Cicadas', 'Dragonfly Nymphs', 'Damselfly Nymphs', 'Termites', 'Water Boatmen', 'Giant Water Bugs', 'Treehoppers & Leafhoppers', 'Insect Mix']
// Groups covered only in OTHER_INSECTS_GUIDE's species-status list — no recipe, by design.
const OTHER_INSECTS_GUIDE_ONLY = ['Aphids', 'Stink Bugs', 'Assassin Bugs']
// Mammals + food-type categories (Offal, Eggs) — no blanket grouping, so
// they stay in the plain A-Z index rather than a dedicated category.
const AZ_ONLY_ANIMALS = ['Deer', 'Elk', 'Pronghorn', 'Rabbit', 'Squirrel', 'Beaver', 'Raccoon', 'Opossum', 'Muskrat', 'Nutria', 'Armadillo', 'Offal', 'Eggs']

describe('RECIPES', () => {
  it('is non-empty and every entry has exactly one of indexLetter or category, correctly shaped', () => {
    expect(RECIPES.length).toBeGreaterThan(0)

    for (const recipe of RECIPES) {
      expect(recipe.id.length).toBeGreaterThan(0)
      expect(recipe.animal.length).toBeGreaterThan(0)
      expect(recipe.emoji.length).toBeGreaterThan(0)
      expect(recipe.title.length).toBeGreaterThan(0)
      expect(Array.isArray(recipe.instructions)).toBe(true)
      expect(recipe.instructions.length).toBeGreaterThan(0)
      if (recipe.ingredients) {
        expect(recipe.ingredients.length).toBeGreaterThan(0)
      }

      const hasIndexLetter = !!recipe.indexLetter
      const hasCategory = !!recipe.category
      expect(hasIndexLetter !== hasCategory, `${recipe.id} must set exactly one of indexLetter/category`).toBe(true)
      if (recipe.indexLetter) {
        expect(recipe.indexLetter).toMatch(/^[A-Z]$/)
      }
      if (recipe.category) {
        expect(RECIPE_CATEGORIES.map((c) => c.key)).toContain(recipe.category)
      }
    }
  })

  it('has unique ids', () => {
    const ids = RECIPES.map((r) => r.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('gives every recipe with an unusual-risk animal a caution note', () => {
    const cautionExpected = ['Raccoon', 'Opossum', 'Armadillo']
    for (const animal of cautionExpected) {
      const recipe = RECIPES.find((r) => r.animal === animal)
      expect(recipe?.caution?.length).toBeGreaterThan(0)
    }
  })

  it('flags the legal risk on eggs and unidentified small birds', () => {
    const eggs = RECIPES.find((r) => r.id === 'eggs-wild-bird-scrambled')
    expect(eggs?.caution).toMatch(/protected/i)

    const smallBirds = RECIPES.find((r) => r.id === 'other-small-game-birds-butter-roasted')
    expect(smallBirds?.caution?.length).toBeGreaterThan(0)
  })

  it('flags the toxic-roe risk on gar, paddlefish, and the general fish roe recipe', () => {
    const gar = RECIPES.find((r) => r.id === 'fish-gar-fried-nuggets')
    expect(gar?.caution).toMatch(/toxin/i)

    const paddlefish = RECIPES.find((r) => r.id === 'fish-paddlefish-smoked')
    expect(paddlefish?.caution?.length).toBeGreaterThan(0)

    const roe = RECIPES.find((r) => r.id === 'fish-roe-trout-salmon')
    expect(roe?.caution).toMatch(/gar roe is toxic/i)
  })

  it('has every named bird recipe in the Birds category', () => {
    for (const animal of BIRDS) {
      const recipe = RECIPES.find((r) => r.animal === animal)
      expect(recipe, `expected a recipe for ${animal}`).toBeDefined()
      expect(recipe?.category).toBe('Birds')
      expect(recipe?.indexLetter).toBeUndefined()
    }
  })

  it('has every named fish recipe in the Fish category', () => {
    for (const animal of FISH) {
      const recipe = RECIPES.find((r) => r.animal === animal)
      expect(recipe, `expected a recipe for ${animal}`).toBeDefined()
      expect(recipe?.category).toBe('Fish')
    }
  })

  it('has every named frog recipe in the Frogs category', () => {
    for (const animal of FROGS) {
      const recipe = RECIPES.find((r) => r.animal === animal)
      expect(recipe, `expected a recipe for ${animal}`).toBeDefined()
      expect(recipe?.category).toBe('Frogs')
    }
  })

  it('gives Pickerel Frog, Wood Frog, and Tree Frog identification/legal cautions', () => {
    const cautionExpected = ['Pickerel Frog', 'Wood Frog', 'Tree Frog']
    for (const animal of cautionExpected) {
      const recipe = RECIPES.find((r) => r.animal === animal)
      expect(recipe?.caution?.length, `expected a caution on ${animal}`).toBeGreaterThan(0)
    }
  })

  it('puts the lizard recipe in Lizards, turtle recipes in Turtles, and snake recipes in Snakes', () => {
    const skink = RECIPES.find((r) => r.animal === 'Skink')
    expect(skink?.category).toBe('Lizards')
    expect(skink?.caution?.length).toBeGreaterThan(0)

    for (const animal of ['Snapping Turtle', 'Softshell Turtle']) {
      const recipe = RECIPES.find((r) => r.animal === animal)
      expect(recipe, `expected a recipe for ${animal}`).toBeDefined()
      expect(recipe?.category).toBe('Turtles')
    }

    for (const animal of ['Nonvenomous Snake', 'Rattlesnake']) {
      const recipe = RECIPES.find((r) => r.animal === animal)
      expect(recipe, `expected a recipe for ${animal}`).toBeDefined()
      expect(recipe?.category).toBe('Snakes')
    }
  })

  it('gives the venomous rattlesnake recipe an explicit handling caution', () => {
    const fried = RECIPES.find((r) => r.id === 'snake-rattlesnake-fried')
    expect(fried?.caution).toMatch(/venomous/i)
  })

  it('has every named crawfish/crayfish recipe in the Crawfish category', () => {
    for (const animal of CRAWFISH) {
      const recipe = RECIPES.find((r) => r.animal === animal)
      expect(recipe, `expected a recipe for ${animal}`).toBeDefined()
      expect(recipe?.category).toBe('Crawfish')
    }
  })

  it('gives two Crawfish recipes and flags the invasive rusty crayfish transport warning', () => {
    const crawfish = RECIPES.filter((r) => r.animal === 'Crawfish')
    expect(crawfish.length).toBe(2)

    const rusty = RECIPES.find((r) => r.animal === 'Rusty Crayfish')
    expect(rusty?.caution).toMatch(/never transport or release/i)
  })

  it('has every named mollusk recipe in the Mussels category', () => {
    for (const animal of MUSSELS) {
      const recipe = RECIPES.find((r) => r.animal === animal)
      expect(recipe, `expected a recipe for ${animal}`).toBeDefined()
      expect(recipe?.category).toBe('Mussels')
    }
  })

  it('flags raw-consumption risk on the Asian clam and freshwater snail recipes', () => {
    const clam = RECIPES.find((r) => r.id === 'mussel-asian-clam-garlic-butter')
    expect(clam?.caution?.length).toBeGreaterThan(0)

    const snails = RECIPES.find((r) => r.id === 'mussel-freshwater-snails-garlic-herb')
    expect(snails?.caution).toMatch(/raw/i)
  })

  it('has every named insect recipe in the Insects category', () => {
    for (const animal of INSECTS) {
      const recipe = RECIPES.find((r) => r.animal === animal)
      expect(recipe, `expected a recipe for ${animal}`).toBeDefined()
      expect(recipe?.category).toBe('Insects')
    }
  })

  it('does not give lubber grasshoppers a recipe — they are a leave-alone example, not food', () => {
    const lubber = RECIPES.find((r) => r.animal.toLowerCase().includes('lubber'))
    expect(lubber).toBeUndefined()
  })

  it('gives tree crickets and katydids a practical-value/identification caution', () => {
    const treeCrickets = RECIPES.find((r) => r.animal === 'Tree Crickets')
    expect(treeCrickets?.caution?.length).toBeGreaterThan(0)

    const katydids = RECIPES.find((r) => r.animal === 'Katydids')
    expect(katydids?.caution?.length).toBeGreaterThan(0)
  })

  it('has every named beetle recipe in the Insects category', () => {
    for (const animal of BEETLES) {
      const recipe = RECIPES.find((r) => r.animal === animal)
      expect(recipe, `expected a recipe for ${animal}`).toBeDefined()
      expect(recipe?.category).toBe('Insects')
    }
  })

  it('gives June Beetle Grubs, Longhorn Beetle Larvae, Stag Beetles, and Darkling Beetle Larvae an identification/handling caution', () => {
    for (const animal of ['June Beetle Grubs', 'Longhorn Beetle Larvae', 'Stag Beetles', 'Darkling Beetle Larvae']) {
      const recipe = RECIPES.find((r) => r.animal === animal)
      expect(recipe?.caution?.length, `expected a caution on ${animal}`).toBeGreaterThan(0)
    }
  })

  it('does not give a recipe to the guide-only beetle groups (Japanese/dung/water beetles, buprestids)', () => {
    for (const animal of BEETLE_GUIDE_ONLY) {
      const recipe = RECIPES.find((r) => r.animal === animal)
      expect(recipe, `expected no recipe for ${animal}`).toBeUndefined()
    }
  })

  it('has every new caterpillar/grub/fly/aquatic-larva animal in the Insects category, with multiple recipes each', () => {
    for (const animal of CATERPILLAR_BATCH_ANIMALS) {
      const recipes = RECIPES.filter((r) => r.animal === animal)
      expect(recipes.length, `expected at least one recipe for ${animal}`).toBeGreaterThan(0)
      for (const recipe of recipes) {
        expect(recipe.category).toBe('Insects')
      }
    }
    // Mealworms and Superworms each pick up more recipes from this batch, on top of their existing one.
    expect(RECIPES.filter((r) => r.animal === 'Mealworms').length).toBe(5)
    expect(RECIPES.filter((r) => r.animal === 'Superworms').length).toBe(3)
  })

  it('flags every unidentified-caterpillar recipe with a confirmed-species-only caution', () => {
    const cautionExpected = [
      'insect-caterpillar-cornmeal-fried', 'insect-caterpillar-roasted-moth-larva', 'insect-caterpillar-garlic-herb',
      'insect-caterpillar-tacos', 'insect-caterpillar-fried-rice', 'insect-caterpillar-noodle-bowl', 'insect-caterpillar-coconut-curry',
    ]
    for (const id of cautionExpected) {
      const recipe = RECIPES.find((r) => r.id === id)
      expect(recipe?.caution?.length, `expected a caution on ${id}`).toBeGreaterThan(0)
    }
  })

  it('flags black soldier fly larvae with a wild-collection caution, and gives no recipe to the guide-only larva groups', () => {
    const bsfl = RECIPES.find((r) => r.id === 'insect-black-soldier-fly-larva-crispy')
    expect(bsfl?.caution).toMatch(/garbage, manure, compost, or carcasses/)

    for (const animal of CATERPILLAR_GUIDE_ONLY) {
      const recipe = RECIPES.find((r) => r.animal === animal)
      expect(recipe, `expected no recipe for ${animal}`).toBeUndefined()
    }
  })

  it('has every named ant/ant-brood recipe in the Insects category, with no recipe for fire/pavement ants', () => {
    for (const animal of ANTS) {
      const recipe = RECIPES.find((r) => r.animal === animal)
      expect(recipe, `expected a recipe for ${animal}`).toBeDefined()
      expect(recipe?.category).toBe('Insects')
    }
    for (const animal of ANT_GUIDE_ONLY) {
      const recipe = RECIPES.find((r) => r.animal === animal)
      expect(recipe, `expected no recipe for ${animal}`).toBeUndefined()
    }
  })

  it('flags harvester ants and field ants with an identification caution', () => {
    const harvester = RECIPES.find((r) => r.id === 'insect-harvester-ant-protein-snack')
    expect(harvester?.caution).toMatch(/fire ants/i)

    const field = RECIPES.find((r) => r.id === 'insect-field-ant-toasted')
    expect(field?.caution?.length).toBeGreaterThan(0)
  })

  it('has every named bee/wasp recipe in the Insects category, with no recipe for solitary bees/wasps', () => {
    for (const animal of BEES_AND_WASPS) {
      const recipe = RECIPES.find((r) => r.animal === animal)
      expect(recipe, `expected a recipe for ${animal}`).toBeDefined()
      expect(recipe?.category).toBe('Insects')
    }
    for (const animal of BEE_WASP_GUIDE_ONLY) {
      const recipe = RECIPES.find((r) => r.animal === animal)
      expect(recipe, `expected no recipe for ${animal}`).toBeUndefined()
    }
  })

  it('gives Honey Bee 7 recipes and flags the pollinator/wild-colony cautions on adult-bee and brood recipes', () => {
    expect(RECIPES.filter((r) => r.animal === 'Honey Bee').length).toBe(7)

    const roastedAdult = RECIPES.find((r) => r.id === 'insect-honey-bee-roasted-adult')
    expect(roastedAdult?.caution).toMatch(/pollinator/i)

    const bumblebee = RECIPES.find((r) => r.id === 'insect-bumblebee-brood-pan-fried')
    expect(bumblebee?.caution?.length).toBeGreaterThan(0)
  })

  it('has every "other insect" recipe in the Insects category, with no recipe for aphids/stink bugs/assassin bugs', () => {
    for (const animal of OTHER_INSECTS) {
      const recipe = RECIPES.find((r) => r.animal === animal)
      expect(recipe, `expected a recipe for ${animal}`).toBeDefined()
      expect(recipe?.category).toBe('Insects')
    }
    for (const animal of OTHER_INSECTS_GUIDE_ONLY) {
      const recipe = RECIPES.find((r) => r.animal === animal)
      expect(recipe, `expected no recipe for ${animal}`).toBeUndefined()
    }
  })

  it('gives Cicadas 6 recipes and flags the not-locusts note, cicada-flour caution, and dangerous-bite caution', () => {
    expect(RECIPES.filter((r) => r.animal === 'Cicadas').length).toBe(6)

    const roasted = RECIPES.find((r) => r.id === 'insect-cicada-classic-roasted')
    expect(roasted?.intro).toMatch(/not locusts/i)

    const flour = RECIPES.find((r) => r.id === 'insect-cicada-flour-protein-powder')
    expect(flour?.caution?.length).toBeGreaterThan(0)

    const giantWaterBug = RECIPES.find((r) => r.id === 'insect-giant-water-bug-roasted')
    expect(giantWaterBug?.caution).toMatch(/painful bite/i)
  })

  it('flags the termite structural-treatment caution and the dragonfly-nymph water-quality caution', () => {
    const termiteFriedRice = RECIPES.find((r) => r.id === 'insect-termite-fried-rice')
    expect(termiteFriedRice?.caution).toMatch(/treated lumber|structures/i)

    const dragonfly = RECIPES.find((r) => r.id === 'insect-dragonfly-nymph-crispy')
    expect(dragonfly?.caution).toMatch(/water quality/i)
  })

  it('keeps every mammal/offal/eggs entry in the plain A-Z index, not a dedicated category', () => {
    for (const animal of AZ_ONLY_ANIMALS) {
      const recipe = RECIPES.find((r) => r.animal === animal)
      expect(recipe, `expected a recipe for ${animal}`).toBeDefined()
      expect(recipe?.category).toBeUndefined()
      expect(recipe?.indexLetter?.length).toBeGreaterThan(0)
    }
  })
})

describe('FISH_SAFETY_GUIDE', () => {
  it('has a non-empty core rule and contamination note', () => {
    expect(FISH_SAFETY_GUIDE.beforeYouEatIt.length).toBeGreaterThan(0)
    expect(FISH_SAFETY_GUIDE.contaminationNote.length).toBeGreaterThan(0)
  })
})

describe('FROG_SAFETY_GUIDE', () => {
  it('has a non-empty do-not-eat checklist and toads/eggs warnings', () => {
    expect(FROG_SAFETY_GUIDE.doNotEat.length).toBeGreaterThan(0)
    expect(FROG_SAFETY_GUIDE.toadsWarning).toMatch(/NOT RECOMMENDED AS FOOD/)
    expect(FROG_SAFETY_GUIDE.eggsWarning.length).toBeGreaterThan(0)
  })

  it('requires all three conditions before harvesting a small frog', () => {
    expect(FROG_SAFETY_GUIDE.smallFrogConditions.length).toBe(3)
    expect(FROG_SAFETY_GUIDE.smallFrogOtherwise.length).toBeGreaterThan(0)
  })

  it('gives the classic frog-leg cooking formula', () => {
    expect(FROG_SAFETY_GUIDE.basicFormula).toMatch(/Clean.*skin.*fry/)
    expect(FROG_SAFETY_GUIDE.classicCombinations.length).toBeGreaterThan(0)
  })
})

describe('INSECT_SAFETY_GUIDE', () => {
  it('has non-empty good/caution/leave-alone candidate lists', () => {
    expect(INSECT_SAFETY_GUIDE.goodCandidates.length).toBeGreaterThan(0)
    expect(INSECT_SAFETY_GUIDE.useCaution.length).toBeGreaterThan(0)
    expect(INSECT_SAFETY_GUIDE.leaveAlone.length).toBeGreaterThan(0)
  })

  it('flags lubber grasshoppers as leave-alone and gives an explicit do-not-eat warning', () => {
    expect(INSECT_SAFETY_GUIDE.leaveAlone.some((item) => /lubber/i.test(item))).toBe(true)
    expect(INSECT_SAFETY_GUIDE.lubberWarning).toMatch(/DO NOT EAT LUBBER GRASSHOPPERS/)
  })

  it('gives the pesticide warning, locations to avoid, and the prep formula', () => {
    expect(INSECT_SAFETY_GUIDE.pesticideWarning.length).toBeGreaterThan(0)
    expect(INSECT_SAFETY_GUIDE.pesticideAvoidLocations.length).toBeGreaterThan(0)
    expect(INSECT_SAFETY_GUIDE.prepFormula).toMatch(/Identify.*blanch.*season/)
  })
})

describe('LIZARD_GUIDE, TURTLE_GUIDE, SNAKE_GUIDE', () => {
  it('each has a title and at least one status entry', () => {
    for (const guide of [LIZARD_GUIDE, TURTLE_GUIDE, SNAKE_GUIDE]) {
      expect(guide.title.length).toBeGreaterThan(0)
      expect(guide.statusEntries.length).toBeGreaterThan(0)
    }
  })

  it('flags every venomous snake entry clearly, in its status badge or note', () => {
    const venomous = ['Copperhead', 'Cottonmouth', 'Coral snakes', 'Other rattlesnakes', 'Massasauga', 'Pygmy rattlesnakes']
    for (const name of venomous) {
      const entry = SNAKE_GUIDE.statusEntries.find((e) => e.name === name)
      expect(entry, `expected a SNAKE_GUIDE entry for ${name}`).toBeDefined()
      const combined = `${entry?.status} ${entry?.note ?? ''}`
      expect(combined, `expected "venomous" somewhere for ${name}`).toMatch(/venomous/i)
    }
  })

  it('flags box turtles as do-not-harvest and includes the turtle food-safety note', () => {
    const boxTurtles = TURTLE_GUIDE.statusEntries.find((e) => e.name === 'Box turtles')
    expect(boxTurtles?.status).toMatch(/DO NOT HARVEST/)

    const foodSafety = TURTLE_GUIDE.extraNotes?.find((n) => n.heading.includes('Food-safety'))
    expect(foodSafety?.text).toMatch(/Salmonella/)
  })
})

describe('CRAWFISH_GUIDE, MUSSEL_GUIDE', () => {
  it('each has a title and at least one status entry', () => {
    for (const guide of [CRAWFISH_GUIDE, MUSSEL_GUIDE]) {
      expect(guide.title.length).toBeGreaterThan(0)
      expect(guide.statusEntries.length).toBeGreaterThan(0)
    }
  })

  it('flags burrowing crayfish as species-specific and warns against generic mussel harvest', () => {
    const digger = CRAWFISH_GUIDE.statusEntries.find((e) => e.name.includes('Burrowing'))
    expect(digger?.status).toMatch(/VERIFY LEGALITY/)

    expect(MUSSEL_GUIDE.intro).toMatch(/LEAVE IT ALONE/)
  })

  it('flags protected/do-not-eat mollusk groups and the no-raw-mollusk rule', () => {
    const pearlMussels = MUSSEL_GUIDE.statusEntries.find((e) => e.name === 'Freshwater Pearl Mussels')
    expect(pearlMussels?.status).toMatch(/Protected/)

    const appleSnails = MUSSEL_GUIDE.statusEntries.find((e) => e.name === 'Mystery/Apple Snails')
    expect(appleSnails?.status).toMatch(/DO NOT EAT/)

    const rawRule = MUSSEL_GUIDE.extraNotes?.find((n) => n.heading.includes('Raw'))
    expect(rawRule?.text).toMatch(/NO RAW WILD FRESHWATER MOLLUSKS/)
  })
})

describe('BEETLE_GUIDE', () => {
  it('has a title and at least one status entry', () => {
    expect(BEETLE_GUIDE.title.length).toBeGreaterThan(0)
    expect(BEETLE_GUIDE.statusEntries.length).toBeGreaterThan(0)
  })

  it('covers every guide-only beetle group with a status entry', () => {
    for (const name of BEETLE_GUIDE_ONLY) {
      const entry = BEETLE_GUIDE.statusEntries.find((e) => e.name === name)
      expect(entry, `expected a BEETLE_GUIDE entry for ${name}`).toBeDefined()
    }
  })

  it('includes the "Do Not Eat" sidebar with its six warnings and the identification-matters note', () => {
    const doNotEat = BEETLE_GUIDE.statusEntries.find((e) => e.name === 'Do Not Eat')
    expect(doNotEat?.examples?.length).toBe(6)

    const idNote = BEETLE_GUIDE.extraNotes?.find((n) => n.heading.includes('Identification'))
    expect(idNote?.text).toMatch(/color alone/)
  })
})

describe('CATERPILLAR_GUIDE', () => {
  it('has a title, a non-empty intro, and at least one status entry', () => {
    expect(CATERPILLAR_GUIDE.title.length).toBeGreaterThan(0)
    expect(CATERPILLAR_GUIDE.intro?.length).toBeGreaterThan(0)
    expect(CATERPILLAR_GUIDE.statusEntries.length).toBeGreaterThan(0)
  })

  it('gives the never-eat-an-unidentified-caterpillar rule and the no-cooking-does-not-detoxify warning', () => {
    expect(CATERPILLAR_GUIDE.intro).toMatch(/Never eat an unidentified caterpillar/)
    expect(CATERPILLAR_GUIDE.intro).toMatch(/Do not assume cooking makes a toxic caterpillar safe/)
  })

  it('flags the six dangerous/venomous caterpillars and covers every guide-only larva group', () => {
    const dangerous = CATERPILLAR_GUIDE.statusEntries.find((e) => e.name === 'Caterpillars You Should NOT Eat')
    expect(dangerous?.examples?.length).toBe(6)
    expect(dangerous?.examples?.some((e) => /Puss caterpillars/.test(e))).toBe(true)

    for (const name of CATERPILLAR_GUIDE_ONLY) {
      const entry = CATERPILLAR_GUIDE.statusEntries.find((e) => e.name === name)
      expect(entry, `expected a CATERPILLAR_GUIDE entry for ${name}`).toBeDefined()
    }
  })

  it('tells readers to leave wild butterfly caterpillars alone', () => {
    const butterflyLarvae = CATERPILLAR_GUIDE.statusEntries.find((e) => e.name === 'Butterfly Larvae')
    expect(butterflyLarvae?.status).toMatch(/leave wild butterfly caterpillars alone/i)
  })
})

describe('ANT_GUIDE', () => {
  it('has a title and covers fire ants, pavement ants, and the "Ants I Would NOT Eat" sidebar', () => {
    expect(ANT_GUIDE.title.length).toBeGreaterThan(0)

    for (const name of ANT_GUIDE_ONLY) {
      const entry = ANT_GUIDE.statusEntries.find((e) => e.name === name)
      expect(entry, `expected an ANT_GUIDE entry for ${name}`).toBeDefined()
    }

    const doNotEat = ANT_GUIDE.statusEntries.find((e) => e.name === 'Ants I Would NOT Eat')
    expect(doNotEat?.examples?.length).toBe(6)
  })

  it('flags fire ants as not recommended and pavement ants as contamination-prone', () => {
    const fireAnts = ANT_GUIDE.statusEntries.find((e) => e.name === 'Fire Ants')
    expect(fireAnts?.status).toMatch(/NOT RECOMMENDED/)

    const pavementAnts = ANT_GUIDE.statusEntries.find((e) => e.name === 'Pavement Ants')
    expect(pavementAnts?.note).toMatch(/contaminants/)
  })
})

describe('BEE_WASP_GUIDE', () => {
  it('has a title, a non-empty intro with the unidentified-bee-or-wasp rule, and status entries', () => {
    expect(BEE_WASP_GUIDE.title.length).toBeGreaterThan(0)
    expect(BEE_WASP_GUIDE.intro).toMatch(/Never eat an unidentified bee or wasp/)
    expect(BEE_WASP_GUIDE.statusEntries.length).toBeGreaterThan(0)
  })

  it('covers solitary bees/wasps and the "Don\'t Experiment" sidebar', () => {
    for (const name of BEE_WASP_GUIDE_ONLY) {
      const entry = BEE_WASP_GUIDE.statusEntries.find((e) => e.name === name)
      expect(entry, `expected a BEE_WASP_GUIDE entry for ${name}`).toBeDefined()
    }

    const dontExperiment = BEE_WASP_GUIDE.statusEntries.find((e) => e.name.includes("Don't Experiment"))
    expect(dontExperiment?.examples?.length).toBe(6)
    expect(dontExperiment?.examples?.some((e) => /Hornets/.test(e))).toBe(true)
  })
})

describe('OTHER_INSECTS_GUIDE', () => {
  it('has a title, a non-empty intro with the identify-before-eating rule, and status entries', () => {
    expect(OTHER_INSECTS_GUIDE.title.length).toBeGreaterThan(0)
    expect(OTHER_INSECTS_GUIDE.intro).toMatch(/Identify the insect before eating it/)
    expect(OTHER_INSECTS_GUIDE.statusEntries.length).toBeGreaterThan(0)
  })

  it('covers aphids, stink bugs, and assassin bugs, plus the "Do Not Eat" list', () => {
    for (const name of OTHER_INSECTS_GUIDE_ONLY) {
      const entry = OTHER_INSECTS_GUIDE.statusEntries.find((e) => e.name === name)
      expect(entry, `expected an OTHER_INSECTS_GUIDE entry for ${name}`).toBeDefined()
    }

    const doNotEat = OTHER_INSECTS_GUIDE.statusEntries.find((e) => e.name.includes('Do Not Eat'))
    expect(doNotEat?.examples?.length).toBe(6)
  })

  it('flags assassin bugs as leave-alone and stink bugs as never-eat-unidentified', () => {
    const assassinBugs = OTHER_INSECTS_GUIDE.statusEntries.find((e) => e.name === 'Assassin Bugs')
    expect(assassinBugs?.status).toMatch(/Leave alone/i)

    const stinkBugs = OTHER_INSECTS_GUIDE.statusEntries.find((e) => e.name === 'Stink Bugs')
    expect(stinkBugs?.status).toMatch(/never eat an unidentified stink bug/i)
  })
})

describe('RECIPE_SAFETY_RULES', () => {
  it('is a non-empty list of non-empty strings', () => {
    expect(RECIPE_SAFETY_RULES.length).toBeGreaterThan(0)
    for (const rule of RECIPE_SAFETY_RULES) {
      expect(rule.length).toBeGreaterThan(0)
    }
  })
})

describe('PROTECTED_BIRDS_GUIDE', () => {
  it('has a non-empty never-harvest list, special cases, and a safest-rule summary', () => {
    expect(PROTECTED_BIRDS_GUIDE.neverHarvest.length).toBeGreaterThan(0)
    expect(PROTECTED_BIRDS_GUIDE.specialCases.length).toBeGreaterThan(0)
    expect(PROTECTED_BIRDS_GUIDE.safestRule.length).toBeGreaterThan(0)
  })

  it('calls out sandhill crane and ducks/geese as special (regulated, not simply forbidden) cases', () => {
    const titles = PROTECTED_BIRDS_GUIDE.specialCases.map((c) => c.title)
    expect(titles).toContain('Sandhill crane')
    expect(titles.some((t) => /duck/i.test(t))).toBe(true)
  })
})

describe('RECIPE_CATEGORIES', () => {
  it('lists all nine dedicated categories with non-empty titles and emoji', () => {
    expect(RECIPE_CATEGORIES.length).toBe(9)
    for (const category of RECIPE_CATEGORIES) {
      expect(category.title.length).toBeGreaterThan(0)
      expect(category.emoji.length).toBeGreaterThan(0)
    }
  })
})

describe('getCategoryRecipes', () => {
  it('returns only recipes for the requested category, matching the total recipe count for Insects', () => {
    const insects = getCategoryRecipes(RECIPES, 'Insects')
    const expectedCount = RECIPES.filter((r) => r.category === 'Insects').length
    expect(insects.length).toBe(expectedCount)
    expect(insects.length).toBeGreaterThan(INSECTS.length + BEETLES.length)
  })

  it('never returns an A-Z-only animal for any category', () => {
    for (const category of RECIPE_CATEGORIES) {
      const recipes = getCategoryRecipes(RECIPES, category.key)
      for (const animal of AZ_ONLY_ANIMALS) {
        expect(recipes.some((r) => r.animal === animal)).toBe(false)
      }
    }
  })

  it('covers every category-flagged recipe exactly once across all categories', () => {
    const totalCategorized = RECIPE_CATEGORIES.reduce((sum, c) => sum + getCategoryRecipes(RECIPES, c.key).length, 0)
    const expected = RECIPES.filter((r) => r.category).length
    expect(totalCategorized).toBe(expected)
  })
})

describe('groupRecipesByLetter', () => {
  it('only includes plain-A-Z recipes (mammals, Offal, Eggs) — every dedicated-category recipe is excluded', () => {
    const grouped = groupRecipesByLetter(RECIPES)
    // All Offal entries (mammal + bird organ recipes) file under O together.
    expect(grouped.O?.filter((r) => r.animal === 'Offal').length).toBe(7)
    // Deer (a mammal) still files under its own name's letter, D.
    expect(grouped.D?.some((r) => r.animal === 'Deer')).toBe(true)
    // Birds, fish, frogs, lizards, turtles, snakes, crawfish, and mussels belong to their
    // dedicated category sections now, not the A-Z letter groups.
    for (const animal of [...BIRDS, ...FISH, ...FROGS, 'Skink', 'Snapping Turtle', 'Rattlesnake', ...CRAWFISH, ...MUSSELS, ...INSECTS, ...BEETLES, ...CATERPILLAR_BATCH_ANIMALS, ...ANTS, ...BEES_AND_WASPS, ...OTHER_INSECTS]) {
      const inAnyLetterGroup = Object.values(grouped).some((letterRecipes) => letterRecipes.some((r) => r.animal === animal))
      expect(inAnyLetterGroup, `expected ${animal} to be excluded from the A-Z index`).toBe(false)
    }
  })
})

describe('groupRecipesByAnimal', () => {
  it('keeps recipes for the same animal together, in original order', () => {
    const offal = RECIPES.filter((r) => r.animal === 'Offal')
    const grouped = groupRecipesByAnimal(offal)
    expect(grouped).toHaveLength(1)
    expect(grouped[0].animal).toBe('Offal')
    expect(grouped[0].recipes.map((r) => r.id)).toEqual(offal.map((r) => r.id))
  })
})
