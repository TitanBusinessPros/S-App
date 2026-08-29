import functionsTest from "firebase-functions-test";

const testEnv = functionsTest();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { SPECIES_DATA } = require("../../functions/src/speciesData");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { isActiveInMonth, milesToKm, hasNearbyOccurrence, getSpeciesNearby } = require("../../functions/src/species");

const VALID_CATEGORIES = [
  "edible-plant",
  "tree-wood",
  "edible-wildlife",
  "edible-insect",
  "dangerous-plant",
  "dangerous-animal",
];

describe("SPECIES_DATA", () => {
  it("is non-empty and every entry has the required shape", () => {
    expect(SPECIES_DATA.length).toBeGreaterThan(0);

    for (const entry of SPECIES_DATA) {
      expect(entry.id).toEqual(expect.any(String));
      expect(entry.id.length).toBeGreaterThan(0);
      expect(entry.commonName.length).toBeGreaterThan(0);
      expect(entry.scientificName.length).toBeGreaterThan(0);
      expect(entry.summary.length).toBeGreaterThan(0);
      expect(VALID_CATEGORIES).toContain(entry.category);
      expect(Array.isArray(entry.activeMonths)).toBe(true);
      expect(entry.activeMonths.length).toBeGreaterThan(0);
      for (const month of entry.activeMonths) {
        expect(month).toBeGreaterThanOrEqual(1);
        expect(month).toBeLessThanOrEqual(12);
      }
    }
  });

  it("has unique ids", () => {
    const ids = SPECIES_DATA.map((e: { id: string }) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every tree-wood entry a woodUse block", () => {
    const trees = SPECIES_DATA.filter((e: { category: string }) => e.category === "tree-wood");
    expect(trees.length).toBeGreaterThan(0);
    for (const tree of trees) {
      expect(tree.woodUse).toBeDefined();
    }
  });
});

describe("isActiveInMonth", () => {
  it("returns true when the month is in activeMonths", () => {
    expect(isActiveInMonth({ activeMonths: [9, 10, 11] }, 10)).toBe(true);
  });

  it("returns false when the month is not in activeMonths", () => {
    expect(isActiveInMonth({ activeMonths: [9, 10, 11] }, 3)).toBe(false);
  });
});

describe("milesToKm", () => {
  it("converts miles to kilometers", () => {
    expect(milesToKm(10)).toBeCloseTo(16.09344, 4);
  });
});

describe("hasNearbyOccurrence", () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("returns true when GBIF reports at least one occurrence", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ count: 3 }) }) as unknown as typeof fetch;
    await expect(hasNearbyOccurrence("Rubus spp.", 35.5, -97.5, 16)).resolves.toBe(true);
  });

  it("returns false when GBIF reports zero occurrences", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ count: 0 }) }) as unknown as typeof fetch;
    await expect(hasNearbyOccurrence("Rubus spp.", 35.5, -97.5, 16)).resolves.toBe(false);
  });

  it("throws when GBIF responds with a non-OK status", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 503 }) as unknown as typeof fetch;
    await expect(hasNearbyOccurrence("Rubus spp.", 35.5, -97.5, 16)).rejects.toThrow(/status 503/);
  });
});

describe("getSpeciesNearby", () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });
  afterAll(() => {
    testEnv.cleanup();
  });

  it("rejects missing/invalid arguments", async () => {
    const wrapped = testEnv.wrap(getSpeciesNearby);
    await expect(wrapped({ data: { lat: 35.5, lng: -97.5, radiusMiles: 10 } })).rejects.toThrow(/required numbers/);
  });

  it("rejects an out-of-range month", async () => {
    const wrapped = testEnv.wrap(getSpeciesNearby);
    await expect(
      wrapped({ data: { lat: 35.5, lng: -97.5, radiusMiles: 10, month: 13 } }),
    ).rejects.toThrow(/month must be between/);
  });

  it("only calls GBIF for in-season species, and only returns ones GBIF confirms", async () => {
    // Every species active in month 1 (January) — a small, deterministic set.
    const januaryEntries = SPECIES_DATA.filter((e: { activeMonths: number[] }) => e.activeMonths.includes(1));
    expect(januaryEntries.length).toBeGreaterThan(0);

    const fetchMock = jest.fn().mockImplementation((url: string) => {
      // Confirm only the first january-active species; deny the rest.
      const requestedName = new URL(url).searchParams.get("scientificName");
      const confirm = requestedName === januaryEntries[0].scientificName;
      return Promise.resolve({ ok: true, json: async () => ({ count: confirm ? 1 : 0 }) });
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const wrapped = testEnv.wrap(getSpeciesNearby);
    const result = await wrapped({ data: { lat: 35.5, lng: -97.5, radiusMiles: 10, month: 1 } });

    // Only species active in January are ever queried.
    expect(fetchMock).toHaveBeenCalledTimes(januaryEntries.length);
    // Only the GBIF-confirmed one comes back.
    expect(result.species).toHaveLength(1);
    expect(result.species[0].id).toBe(januaryEntries[0].id);
    expect(result.radiusMiles).toBe(10);
    expect(result.month).toBe(1);
  });

  it("excludes a species whose GBIF lookup fails, without failing the whole request", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("network down")) as unknown as typeof fetch;

    const wrapped = testEnv.wrap(getSpeciesNearby);
    const result = await wrapped({ data: { lat: 35.5, lng: -97.5, radiusMiles: 10, month: 1 } });

    expect(result.species).toEqual([]);
  });
});
