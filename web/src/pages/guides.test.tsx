import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FirstAidContent } from './FirstAid'
import { ShelterContent } from './Shelter'
import { FindingWaterContent } from './FindingWater'
import { SnaresContent } from './Snares'
import { RecipesContent } from './Recipes'

describe('FirstAidContent', () => {
  it('renders the universal response and every problem category', () => {
    render(<FirstAidContent />)
    expect(screen.getByText('First Aid')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Universal Response/ })).toBeInTheDocument()
    expect(screen.getByText(/Make the scene safe/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Trauma, Wounds & Movement Injuries/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Heat, Cold, Altitude, Weather, Water & Fire/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Bites, Stings, Plants & Infections/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Medical Emergencies & Evacuation Decisions/ })).toBeInTheDocument()
  })

  it('renders a specific problem/action row with its full first-aid measures', () => {
    render(<FirstAidContent />)
    expect(screen.getByText(/Suspected venomous snakebite/)).toBeInTheDocument()
    expect(screen.getByText(/No cutting, sucking, ice, tourniquet, electric shock, or snake capture\./)).toBeInTheDocument()
  })

  it('links the quick-nav to every section, including the universal response', () => {
    render(<FirstAidContent />)
    expect(screen.getByRole('link', { name: /Universal Response/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Bites, Stings, Plants & Infections/ })).toBeInTheDocument()
  })

  it('deliberately does not claim to identify medicinal plants', () => {
    render(<FirstAidContent />)
    expect(screen.getByRole('heading', { name: /Not Yet Covered Here/ })).toBeInTheDocument()
    expect(screen.getByText(/Misidentifying a plant/)).toBeInTheDocument()
  })
})

describe('ShelterContent', () => {
  it('renders the universal rules and all 15 shelter designs', () => {
    render(<ShelterContent />)
    expect(screen.getByRole('heading', { name: /Universal Shelter Rules/ })).toBeInTheDocument()
    expect(screen.getByText(/Pick a safe site/)).toBeInTheDocument()
    expect(screen.getByText(/Debris Hut/)).toBeInTheDocument()
    expect(screen.getByText(/Hot-Weather Shade Fly/)).toBeInTheDocument()
    expect(screen.getByText(/Quinzee Snow Shelter/)).toBeInTheDocument()
    expect(screen.getByText(/Lean-To Tarp/)).toBeInTheDocument()
  })

  it('renders a full build for one specific design, including its key detail', () => {
    render(<ShelterContent />)
    expect(screen.getByText(/Run a ridgeline between two trees at knee-to-waist height/)).toBeInTheDocument()
    expect(screen.getByText(/Lower equals warmer and more wind-resistant/)).toBeInTheDocument()
  })

  it('renders the "things I would not recommend" warnings', () => {
    render(<ShelterContent />)
    expect(screen.getByRole('heading', { name: /Not Recommend/ })).toBeInTheDocument()
    expect(screen.getByText(/A fire inside or immediately beside a tent/)).toBeInTheDocument()
  })
})

describe('FindingWaterContent', () => {
  it('renders the core techniques without asserting a fabricated dig depth', () => {
    render(<FindingWaterContent />)
    expect(screen.getByText(/Solar Still/)).toBeInTheDocument()
    expect(screen.getByText(/Transpiration Bag/)).toBeInTheDocument()
    expect(screen.getByText(/genuinely unpredictable without local data/)).toBeInTheDocument()
  })
})

describe('SnaresContent', () => {
  it('renders the core snare designs and a legal disclaimer', () => {
    render(<SnaresContent />)
    expect(screen.getByText(/Squirrel Pole/)).toBeInTheDocument()
    expect(screen.getByText(/Figure-4 Deadfall/)).toBeInTheDocument()
    expect(screen.getByText(/Trapping regulations vary/)).toBeInTheDocument()
  })
})

describe('RecipesContent', () => {
  it('renders the category quick-nav and the A-Z index, with mammals in the A-Z section', () => {
    render(<RecipesContent />)
    expect(screen.getByRole('heading', { name: /A–Z Index/ })).toBeInTheDocument()
    expect(screen.getByText(/Country Venison Roast/)).toBeInTheDocument()
    // The nav links out to every dedicated category, including the new ones.
    expect(screen.getByRole('link', { name: /Birds/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Insects/ })).toBeInTheDocument()
  })

  it('groups all offal recipes under O in the A-Z index, not scattered across their own letters', () => {
    render(<RecipesContent />)
    const oHeading = screen.getByRole('heading', { name: 'O' })
    expect(oHeading).toBeInTheDocument()
    expect(screen.getByText(/Pan-Fried Liver & Onions/)).toBeInTheDocument()
    expect(screen.getByText(/Braised Game Tongue/)).toBeInTheDocument()
  })

  it('shows the wild-game safety rules and per-animal cautions', () => {
    render(<RecipesContent />)
    expect(screen.getByText(/A few important wild-game rules/)).toBeInTheDocument()
    expect(screen.getByText(/Mycobacterium leprae/)).toBeInTheDocument()
  })

  it('renders the Birds category as one self-contained section with its recipes and protected-birds guide', () => {
    render(<RecipesContent />)
    expect(screen.getByRole('heading', { name: /^🐦 Birds$/ })).toBeInTheDocument()
    expect(screen.getByText(/Herb-Roasted Wild Turkey/)).toBeInTheDocument()
    expect(screen.getByText(/Bacon-Wrapped Roasted Quail/)).toBeInTheDocument()
    expect(screen.getByText(/Roasted Sandhill Crane Breast/)).toBeInTheDocument()
    expect(screen.getByText(/Southern Fried Dove/)).toBeInTheDocument()
    expect(screen.getByText(/Slow-Roasted Wild Goose/)).toBeInTheDocument()
    expect(screen.getByText(/Protected Birds — Important Identification Guide/)).toBeInTheDocument()
    expect(screen.getByText(/Bald and golden eagles/)).toBeInTheDocument()
    expect(screen.getByText(/Sandhill crane:/)).toBeInTheDocument()
    expect(screen.getByText(/If you cannot positively identify the bird/)).toBeInTheDocument()
  })

  it('renders the Fish category as one section with its recipes and the Before You Eat It safety card', () => {
    render(<RecipesContent />)
    expect(screen.getByRole('heading', { name: /^🐟 Fish$/ })).toBeInTheDocument()
    expect(screen.getByText(/Southern Fried Bass/)).toBeInTheDocument()
    expect(screen.getByText(/Grilled Sturgeon/)).toBeInTheDocument()
    expect(screen.getByText(/Before You Eat It/)).toBeInTheDocument()
    expect(screen.getByText(/IDENTIFY IT\. CHECK THE REGULATIONS\./)).toBeInTheDocument()
    expect(screen.getByText(/mercury, PCBs, PFAS/)).toBeInTheDocument()
    expect(screen.getByText(/Never eat gar eggs\/roe/)).toBeInTheDocument()
    expect(screen.getByText(/gar roe is toxic/)).toBeInTheDocument()
  })

  it('renders the Frogs category as one section with its recipes and identification guide', () => {
    render(<RecipesContent />)
    expect(screen.getByRole('heading', { name: /^🐸 Frogs$/ })).toBeInTheDocument()
    expect(screen.getByText(/Classic Fried Frog Legs/)).toBeInTheDocument()
    expect(screen.getByText(/Cajun Frog Legs/)).toBeInTheDocument()
    expect(screen.getByText(/Frog Identification — Very Important/)).toBeInTheDocument()
    expect(screen.getByText(/NOT RECOMMENDED AS FOOD/)).toBeInTheDocument()
    expect(screen.getByText(/Otherwise, leave it alone/)).toBeInTheDocument()
    expect(screen.getByText(/carry pathogens such as Salmonella/)).toBeInTheDocument()
  })

  it('renders the Lizards category as one section with its recipe and the lizard-status guide', () => {
    render(<RecipesContent />)
    expect(screen.getByRole('heading', { name: /^🦎 Lizards$/ })).toBeInTheDocument()
    expect(screen.getByText(/Simple Roasted Skink/)).toBeInTheDocument()
    expect(screen.getByText(/What About Lizard Meat Generally/)).toBeInTheDocument()
    expect(screen.getByText(/Horned lizards/)).toBeInTheDocument()
  })

  it('renders the Turtles category as one section, including box-turtle and Salmonella warnings', () => {
    render(<RecipesContent />)
    expect(screen.getByRole('heading', { name: /^🐢 Turtles$/ })).toBeInTheDocument()
    expect(screen.getByText(/Classic Turtle Soup/)).toBeInTheDocument()
    expect(screen.getByText(/Pan-Fried Softshell/)).toBeInTheDocument()
    expect(screen.getByText(/Other Turtles — Species-by-Species Status/)).toBeInTheDocument()
    expect(screen.getByText(/DO NOT HARVEST FOR FOOD/)).toBeInTheDocument()
    expect(screen.getByText(/Reptiles can carry Salmonella/)).toBeInTheDocument()
  })

  it('renders the Snakes category as one section, including venomous-species warnings', () => {
    render(<RecipesContent />)
    expect(screen.getByRole('heading', { name: /^🐍 Snakes$/ })).toBeInTheDocument()
    expect(screen.getAllByText(/Fried Snake/).length).toBeGreaterThan(0)
    expect(screen.getByText(/Fried Rattlesnake/)).toBeInTheDocument()
    expect(screen.getByText(/venomous and potentially dangerous to handle/)).toBeInTheDocument()
    expect(screen.getByText(/Other Snakes — Species-by-Species Status/)).toBeInTheDocument()
    expect(screen.getByText(/NEVER HARVEST FOR FOOD/)).toBeInTheDocument()
  })

  it('renders the Crawfish category as one section with the crawfish notes guide', () => {
    render(<RecipesContent />)
    expect(screen.getByRole('heading', { name: /^🦞 Crawfish & Crayfish$/ })).toBeInTheDocument()
    expect(screen.getByText(/Cajun Crawfish Boil/)).toBeInTheDocument()
    expect(screen.getByText(/Crayfish Bisque/)).toBeInTheDocument()
    expect(screen.getByText(/Burrowing Crayfish & General Crawfish Notes/)).toBeInTheDocument()
    expect(screen.getByText(/VERIFY LEGALITY FIRST/)).toBeInTheDocument()
    expect(screen.getByText(/What About the "Mustard"/)).toBeInTheDocument()
  })

  it('renders the Mussels category as one section, including the no-raw-mollusk rule', () => {
    render(<RecipesContent />)
    expect(screen.getByRole('heading', { name: /^🦪 Mussels, Clams & Snails$/ })).toBeInTheDocument()
    expect(screen.getByText(/Garlic-Butter Asian Clams/)).toBeInTheDocument()
    expect(screen.getByText(/Butter-Fried Freshwater Snails/)).toBeInTheDocument()
    expect(screen.getByText(/Freshwater Mussels & Snails — Species-by-Species Status/)).toBeInTheDocument()
    expect(screen.getByText(/LEAVE IT ALONE/)).toBeInTheDocument()
    expect(screen.getByText(/DO NOT EAT AN UNIDENTIFIED APPLE SNAIL/)).toBeInTheDocument()
    expect(screen.getByText(/NO RAW WILD FRESHWATER MOLLUSKS/)).toBeInTheDocument()
  })

  it('renders the Insects category as one section with its recipes and the smaller-species/pesticide guide', () => {
    render(<RecipesContent />)
    expect(screen.getByRole('heading', { name: /^🦗 Insects$/ })).toBeInTheDocument()
    expect(screen.getByText(/Pan-Fried Crispy Crickets/)).toBeInTheDocument()
    expect(screen.getByText(/Roasted Mormon Crickets/)).toBeInTheDocument()
    expect(screen.getByText(/Roasted Locust-Style Grasshoppers/)).toBeInTheDocument()
    expect(screen.getByText(/What About Smaller Species\?/)).toBeInTheDocument()
    expect(screen.getByText(/DO NOT EAT LUBBER GRASSHOPPERS/)).toBeInTheDocument()
    expect(screen.getByText(/Pesticides Are the Biggest Wild-Insect Issue/)).toBeInTheDocument()
    expect(screen.getByText(/Identify → verify legality/)).toBeInTheDocument()
  })

  it('renders the beetle recipes and the beetle species-status guide within the Insects section', () => {
    render(<RecipesContent />)
    expect(screen.getByText(/Roasted June Beetles/)).toBeInTheDocument()
    expect(screen.getByText(/Garlic-Paprika Mealworms/)).toBeInTheDocument()
    expect(screen.getByText(/Roasted Superworms/)).toBeInTheDocument()
    expect(screen.getByText(/Beetles — Species-by-Species Status/)).toBeInTheDocument()
    expect(screen.getByText(/Beetles I Would NOT Put in the Food Section/)).toBeInTheDocument()
    expect(screen.getByText(/Never identify an edible beetle by color alone/)).toBeInTheDocument()
  })

  it('renders the moth/caterpillar/grub/fly/aquatic-larva recipes and the caterpillar safety guide within the Insects section', () => {
    render(<RecipesContent />)
    expect(screen.getByText(/Chili-Lime Mealworms/)).toBeInTheDocument()
    expect(screen.getByText(/Superworm Tacos/)).toBeInTheDocument()
    expect(screen.getByText(/Cornmeal-Fried Large Caterpillars/)).toBeInTheDocument()
    expect(screen.getByText(/Grub Fritters/)).toBeInTheDocument()
    expect(screen.getByText(/Crispy Black Soldier Fly Larvae/)).toBeInTheDocument()
    expect(screen.getByText(/Simple Caddisfly-Larva Fry/)).toBeInTheDocument()
    expect(screen.getByText(/Caterpillars, Grubs & Larvae — Safety & Species Status/)).toBeInTheDocument()
    expect(screen.getByText(/Never eat an unidentified caterpillar/)).toBeInTheDocument()
    expect(screen.getByText(/Puss caterpillars/)).toBeInTheDocument()
    expect(screen.getByText(/DO NOT COLLECT RANDOM WILD MAGGOTS FOR FOOD/)).toBeInTheDocument()
  })

  it('renders the ant recipes and the ant species-status guide within the Insects section', () => {
    render(<RecipesContent />)
    expect(screen.getByText(/Simple Honeypot Ant Treat/)).toBeInTheDocument()
    expect(screen.getByText(/Garlic-Butter Ants/)).toBeInTheDocument()
    expect(screen.getByText(/Crispy Ant Brood/)).toBeInTheDocument()
    expect(screen.getByText(/Ants — Species-by-Species Status/)).toBeInTheDocument()
    expect(screen.getByText(/NOT RECOMMENDED AS A WILD FOOD/)).toBeInTheDocument()
    expect(screen.getByText(/Ants I Would NOT Eat/)).toBeInTheDocument()
  })

  it('renders the bee/wasp recipes and the bee/wasp safety guide within the Insects section', () => {
    render(<RecipesContent />)
    expect(screen.getByText(/Simple Honey$/)).toBeInTheDocument()
    expect(screen.getByText(/Fresh Honeycomb/)).toBeInTheDocument()
    expect(screen.getByText(/Roasted Bumblebees/)).toBeInTheDocument()
    expect(screen.getByText(/Crispy Wasps/)).toBeInTheDocument()
    expect(screen.getByText(/Yellowjacket Brood Tacos/)).toBeInTheDocument()
    expect(screen.getByText(/Wasp Brood Curry/)).toBeInTheDocument()
    expect(screen.getByText(/Bees & Wasps — Safety & Species Status/)).toBeInTheDocument()
    expect(screen.getByText(/Never eat an unidentified bee or wasp/)).toBeInTheDocument()
    expect(screen.getByText(/harvest active hornet nests/)).toBeInTheDocument()
  })

  it('renders the cicada/dragonfly/termite/water-bug recipes and the other-insects safety guide within the Insects section', () => {
    render(<RecipesContent />)
    expect(screen.getByText(/Classic Roasted Cicadas/)).toBeInTheDocument()
    expect(screen.getByText(/Cicada Flour\/Protein Powder/)).toBeInTheDocument()
    expect(screen.getByText(/Crispy Dragonfly Nymphs/)).toBeInTheDocument()
    expect(screen.getByText(/Termite Fried Rice/)).toBeInTheDocument()
    expect(screen.getByText(/Roasted Giant Water Bugs/)).toBeInTheDocument()
    expect(screen.getByText(/Spicy Roasted Insect Mix/)).toBeInTheDocument()
    expect(screen.getByText(/Other Insects — Safety & Species Status/)).toBeInTheDocument()
    expect(screen.getByText(/Identify the insect before eating it/)).toBeInTheDocument()
    expect(screen.getByText(/never eat an unidentified stink bug/i)).toBeInTheDocument()
  })
})
