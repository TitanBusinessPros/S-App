import { Shell } from '../components/Shell'
import { GuideDisclaimer } from '../components/GuideDisclaimer'
import {
  RECIPES,
  RECIPE_SAFETY_RULES,
  RECIPE_CATEGORIES,
  PROTECTED_BIRDS_GUIDE,
  FISH_SAFETY_GUIDE,
  FROG_SAFETY_GUIDE,
  INSECT_SAFETY_GUIDE,
  BEETLE_GUIDE,
  CATERPILLAR_GUIDE,
  ANT_GUIDE,
  BEE_WASP_GUIDE,
  LIZARD_GUIDE,
  TURTLE_GUIDE,
  SNAKE_GUIDE,
  CRAWFISH_GUIDE,
  MUSSEL_GUIDE,
  groupRecipesByLetter,
  groupRecipesByAnimal,
  getCategoryRecipes,
  type Recipe,
  type RecipeCategory,
  type AnimalGroupGuide,
} from '../lib/recipesData'
import '../components/GuidePage.css'
import './Recipes.css'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function AnimalGroupGuideCard({ guide }: { guide: AnimalGroupGuide }) {
  return (
    <div className="card animal-group-guide-card">
      <h3>⚠️ {guide.title}</h3>
      {guide.intro && <p>{guide.intro}</p>}

      {guide.statusEntries.map((entry) => (
        <div key={entry.name} className="species-status-entry">
          <span className="recipe-subheading">
            {entry.name} — {entry.status}
          </span>
          {entry.examples && (
            <ul className="recipe-list">
              {entry.examples.map((example, i) => (
                <li key={i}>{example}</li>
              ))}
            </ul>
          )}
          {entry.note && <p>{entry.note}</p>}
        </div>
      ))}

      {guide.extraNotes?.map((note) => (
        <div key={note.heading} className="species-status-entry">
          <span className="recipe-subheading">{note.heading}</span>
          <p>{note.text}</p>
        </div>
      ))}
    </div>
  )
}

function BirdsGuideCard() {
  return (
    <div className="card protected-birds-card">
      <h3>⚠️ Protected Birds — Important Identification Guide</h3>
      <p className="protected-birds-intro">
        If you're in the United States, don't treat the following as ordinary game birds.
      </p>

      <span className="recipe-subheading">❌ Do NOT harvest simply because you see them</span>
      <ul className="recipe-safety-list">
        {PROTECTED_BIRDS_GUIDE.neverHarvest.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <span className="recipe-subheading">Special cases — legal only under specific regulations</span>
      <ul className="recipe-safety-list">
        {PROTECTED_BIRDS_GUIDE.specialCases.map((item) => (
          <li key={item.title}>
            <strong>{item.title}:</strong> {item.text}
          </li>
        ))}
      </ul>

      <p className="protected-birds-rule">✅ The safest rule: {PROTECTED_BIRDS_GUIDE.safestRule}</p>
    </div>
  )
}

function FishGuideCard() {
  return (
    <div className="card fish-safety-card">
      <h3>⚠️ Before You Eat It</h3>
      <p className="fish-safety-rule">{FISH_SAFETY_GUIDE.beforeYouEatIt}</p>
      <p>{FISH_SAFETY_GUIDE.contaminationNote}</p>
    </div>
  )
}

function FrogsGuideCard() {
  return (
    <div className="card frog-safety-card">
      <h3>⚠️ Frog Identification — Very Important</h3>
      <span className="recipe-subheading">Never eat a frog if:</span>
      <ul className="recipe-safety-list">
        {FROG_SAFETY_GUIDE.doNotEat.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <p>{FROG_SAFETY_GUIDE.colorMythWarning}</p>
      <p>{FROG_SAFETY_GUIDE.confusionNote}</p>

      <span className="recipe-subheading">🟡 Small frogs (cricket frogs, chorus frogs, etc.)</span>
      <p>Only harvest if all three conditions are met:</p>
      <ul className="recipe-safety-list">
        {FROG_SAFETY_GUIDE.smallFrogConditions.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <p>{FROG_SAFETY_GUIDE.smallFrogOtherwise}</p>

      <span className="recipe-subheading">🚫 Toads</span>
      <p className="frog-toads-warning">{FROG_SAFETY_GUIDE.toadsWarning}</p>

      <span className="recipe-subheading">🥚 Frog eggs</span>
      <p>{FROG_SAFETY_GUIDE.eggsWarning}</p>

      <span className="recipe-subheading">🫀 Other frog portions</span>
      <p>{FROG_SAFETY_GUIDE.otherPortionsNote}</p>

      <p className="frog-additional-species">{FROG_SAFETY_GUIDE.additionalSpeciesNote}</p>

      <span className="recipe-subheading">🍳 The basic frog-leg formula</span>
      <p className="fish-safety-rule">{FROG_SAFETY_GUIDE.basicFormula}</p>
      <ul className="recipe-list">
        {FROG_SAFETY_GUIDE.classicCombinations.map((combo) => (
          <li key={combo.label}>
            <strong>{combo.label}:</strong> {combo.text}
          </li>
        ))}
      </ul>

      <p className="frog-toads-warning">{FROG_SAFETY_GUIDE.finalSafetyNote}</p>
    </div>
  )
}

function InsectGuideCard() {
  return (
    <div className="card animal-group-guide-card">
      <h3>⚠️ What About Smaller Species?</h3>
      <p>
        There are hundreds of grasshopper, cricket, and katydid species in North America, but most aren't practical
        food animals.
      </p>

      <span className="recipe-subheading">🟢 Good candidates</span>
      <ul className="recipe-list">
        {INSECT_SAFETY_GUIDE.goodCandidates.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <span className="recipe-subheading">🟡 Use caution</span>
      <ul className="recipe-list">
        {INSECT_SAFETY_GUIDE.useCaution.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <span className="recipe-subheading">🚨 Leave alone</span>
      <ul className="recipe-list">
        {INSECT_SAFETY_GUIDE.leaveAlone.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <p className="frog-toads-warning">{INSECT_SAFETY_GUIDE.lubberWarning}</p>

      <span className="recipe-subheading">🦗 Pesticides Are the Biggest Wild-Insect Issue</span>
      <p>{INSECT_SAFETY_GUIDE.pesticideWarning}</p>
      <p>Don't collect grasshoppers, crickets, or katydids from:</p>
      <ul className="recipe-list">
        {INSECT_SAFETY_GUIDE.pesticideAvoidLocations.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <span className="recipe-subheading">🦗 Preparation Formula</span>
      <p className="fish-safety-rule">{INSECT_SAFETY_GUIDE.prepFormula}</p>
    </div>
  )
}

// Each dedicated category section's guide content — pulled out of the plain
// A-Z index so a category's recipes and all of its species-status/safety
// info live together in one self-contained place instead of being scattered
// across the alphabet.
const CATEGORY_GUIDES: Record<RecipeCategory, React.ReactNode> = {
  Birds: <BirdsGuideCard />,
  Fish: <FishGuideCard />,
  Frogs: <FrogsGuideCard />,
  Lizards: <AnimalGroupGuideCard guide={LIZARD_GUIDE} />,
  Turtles: <AnimalGroupGuideCard guide={TURTLE_GUIDE} />,
  Snakes: <AnimalGroupGuideCard guide={SNAKE_GUIDE} />,
  Crawfish: <AnimalGroupGuideCard guide={CRAWFISH_GUIDE} />,
  Mussels: <AnimalGroupGuideCard guide={MUSSEL_GUIDE} />,
  Insects: (
    <>
      <InsectGuideCard />
      <AnimalGroupGuideCard guide={BEETLE_GUIDE} />
      <AnimalGroupGuideCard guide={CATERPILLAR_GUIDE} />
      <AnimalGroupGuideCard guide={ANT_GUIDE} />
      <AnimalGroupGuideCard guide={BEE_WASP_GUIDE} />
    </>
  ),
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <div className="card recipe-card">
      <h3>
        {recipe.emoji} {recipe.title}
      </h3>
      {recipe.intro && <p className="recipe-intro">{recipe.intro}</p>}
      {recipe.caution && <p className="recipe-caution">⚠️ {recipe.caution}</p>}

      {recipe.ingredients && (
        <>
          <span className="recipe-subheading">Ingredients</span>
          <ul className="recipe-list">
            {recipe.ingredients.map((ingredient, i) => (
              <li key={i}>{ingredient}</li>
            ))}
          </ul>
        </>
      )}

      <span className="recipe-subheading">Instructions</span>
      <ol className="recipe-list">
        {recipe.instructions.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>

      {recipe.tip && <p className="recipe-tip">💡 {recipe.tip}</p>}
    </div>
  )
}

function CategorySection({ categoryKey, title, emoji }: { categoryKey: RecipeCategory; title: string; emoji: string }) {
  const recipes = getCategoryRecipes(RECIPES, categoryKey)
  if (recipes.length === 0) return null

  return (
    <section id={`recipes-category-${categoryKey}`} className="recipes-category-section">
      <h2 className="recipes-category-heading">
        {emoji} {title}
      </h2>
      {groupRecipesByAnimal(recipes).map(({ animal, recipes: animalRecipes }) => (
        <div key={animal} className="recipes-animal-group">
          {animalRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ))}
      {CATEGORY_GUIDES[categoryKey]}
    </section>
  )
}

export function RecipesContent() {
  const grouped = groupRecipesByLetter(RECIPES)
  const availableLetters = ALPHABET.filter((letter) => grouped[letter])

  return (
    <>
      <div className="guide-header">
        <h1>🍳 Wild Game Recipes</h1>
        <p>
          Field-to-table recipes for common game, birds, fish, and organ meats. Big related groups — birds, fish,
          frogs, lizards, turtles, snakes, crawfish, mussels, and insects — each have their own dedicated section
          below with their recipes and full species-status/safety guide together. Everything else (mammals, plus
          offal and eggs as their own food-type categories) is indexed A-Z by name further down the page.
        </p>
      </div>

      <GuideDisclaimer>
        Wild game carries real disease and parasite risks that cooking heat reduces but doesn't always fully
        eliminate. Read the safety rules below before preparing any of these — some animals need extra caution,
        noted on their specific recipe.
      </GuideDisclaimer>

      <div className="card recipe-safety-card">
        <h2>⚠️ A few important wild-game rules</h2>
        <ul className="recipe-safety-list">
          {RECIPE_SAFETY_RULES.map((rule, i) => (
            <li key={i}>{rule}</li>
          ))}
        </ul>
      </div>

      <nav className="recipes-category-nav" aria-label="Jump to a category">
        {RECIPE_CATEGORIES.map((category) => (
          <a key={category.key} href={`#recipes-category-${category.key}`} className="recipes-category-link">
            {category.emoji} {category.title}
          </a>
        ))}
      </nav>

      {RECIPE_CATEGORIES.map((category) => (
        <CategorySection key={category.key} categoryKey={category.key} title={category.title} emoji={category.emoji} />
      ))}

      <h2 className="recipes-az-heading">A–Z Index</h2>
      <p className="recipes-az-intro">
        Individual species with no blanket grouping above — indexed A-Z by their own name, except Offal and Eggs,
        which file under their own category letter regardless of which animal they came from.
      </p>

      <nav className="recipes-alpha-nav" aria-label="Jump to a letter">
        {ALPHABET.map((letter) =>
          grouped[letter] ? (
            <a key={letter} href={`#recipes-${letter}`} className="recipes-alpha-link">
              {letter}
            </a>
          ) : (
            <span key={letter} className="recipes-alpha-link recipes-alpha-link-empty" aria-hidden="true">
              {letter}
            </span>
          ),
        )}
      </nav>

      {availableLetters.length === 0 && (
        <p className="feature-list-empty">No recipes yet.</p>
      )}

      {availableLetters.map((letter) => (
        <div key={letter} id={`recipes-${letter}`} className="recipes-letter-section">
          <h2 className="recipes-letter-heading">{letter}</h2>

          {groupRecipesByAnimal(grouped[letter]).map(({ animal, recipes }) => (
            <div key={animal} className="recipes-animal-group">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ))}
        </div>
      ))}
    </>
  )
}

export function Recipes() {
  return (
    <Shell>
      <RecipesContent />
    </Shell>
  )
}
