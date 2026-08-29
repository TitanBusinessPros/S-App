import functionsTest from "firebase-functions-test";

const testEnv = functionsTest();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const {
  milesToMeters,
  buildOverpassQuery,
  parseOverpassResponse,
  clampRadiusMiles,
  getWaterFeatures,
  MIN_RADIUS_MILES,
  MAX_RADIUS_MILES,
} = require("../../functions/src/water");

describe("milesToMeters", () => {
  it("converts miles to meters", () => {
    expect(milesToMeters(1)).toBeCloseTo(1609.344, 3);
    expect(milesToMeters(10)).toBeCloseTo(16093.44, 2);
  });
});

describe("clampRadiusMiles", () => {
  it("passes through values already in range", () => {
    expect(clampRadiusMiles(25)).toBe(25);
  });

  it("clamps below the minimum", () => {
    expect(clampRadiusMiles(-5)).toBe(MIN_RADIUS_MILES);
  });

  it("clamps above the maximum", () => {
    expect(clampRadiusMiles(500)).toBe(MAX_RADIUS_MILES);
  });
});

describe("buildOverpassQuery", () => {
  it("embeds the radius and coordinates in an around clause", () => {
    const query = buildOverpassQuery(35.5, -97.5, 16093.44);
    expect(query).toContain("around:16093.44,35.5,-97.5");
    expect(query).toContain('waterway"~"^(river|stream|canal)$"');
  });
});

describe("parseOverpassResponse", () => {
  it("classifies known water tag combinations", () => {
    const result = parseOverpassResponse({
      elements: [
        { type: "way", id: 1, lat: 1, lon: 2, tags: { waterway: "river", name: "Deep Fork River" } },
        { type: "way", id: 2, lat: 3, lon: 4, tags: { water: "pond" } },
        { type: "node", id: 3, lat: 5, lon: 6, tags: { natural: "spring" } },
        { type: "way", id: 4, center: { lat: 7, lon: 8 }, tags: { natural: "water" } },
      ],
    });

    expect(result).toEqual([
      { id: "way/1", name: "Deep Fork River", waterType: "river", lat: 1, lng: 2 },
      { id: "way/2", name: null, waterType: "pond", lat: 3, lng: 4 },
      { id: "node/3", name: null, waterType: "water", lat: 5, lng: 6 },
      { id: "way/4", name: null, waterType: "water", lat: 7, lng: 8 },
    ]);
  });

  it("skips elements with no usable coordinates", () => {
    const result = parseOverpassResponse({ elements: [{ type: "way", id: 1, tags: { water: "lake" } }] });
    expect(result).toEqual([]);
  });

  it("skips elements with no recognized water tag", () => {
    const result = parseOverpassResponse({
      elements: [{ type: "way", id: 1, lat: 1, lon: 2, tags: { building: "yes" } }],
    });
    expect(result).toEqual([]);
  });
});

describe("getWaterFeatures", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  afterAll(() => {
    testEnv.cleanup();
  });

  it("rejects missing/invalid arguments", async () => {
    const wrapped = testEnv.wrap(getWaterFeatures);
    await expect(wrapped({ data: { lat: 35.5 } })).rejects.toThrow(/required numbers/);
  });

  it("rejects out-of-range coordinates", async () => {
    const wrapped = testEnv.wrap(getWaterFeatures);
    await expect(wrapped({ data: { lat: 999, lng: 0, radiusMiles: 10 } })).rejects.toThrow(/out of range/);
  });

  it("returns parsed features and the clamped radius on success", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        elements: [{ type: "way", id: 1, lat: 35.5, lon: -97.5, tags: { water: "lake", name: "Test Lake" } }],
      }),
    }) as unknown as typeof fetch;

    const wrapped = testEnv.wrap(getWaterFeatures);
    const result = await wrapped({ data: { lat: 35.5, lng: -97.5, radiusMiles: 500 } });

    expect(result.radiusMiles).toBe(MAX_RADIUS_MILES);
    expect(result.features).toEqual([
      { id: "way/1", name: "Test Lake", waterType: "lake", lat: 35.5, lng: -97.5 },
    ]);
  });

  it("throws unavailable when the fetch itself fails", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("network down")) as unknown as typeof fetch;

    const wrapped = testEnv.wrap(getWaterFeatures);
    await expect(wrapped({ data: { lat: 35.5, lng: -97.5, radiusMiles: 10 } })).rejects.toThrow(/Could not reach/);
  });

  it("throws unavailable when Overpass responds with a non-OK status", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 504 }) as unknown as typeof fetch;

    const wrapped = testEnv.wrap(getWaterFeatures);
    await expect(wrapped({ data: { lat: 35.5, lng: -97.5, radiusMiles: 10 } })).rejects.toThrow(/returned an error/);
  });
});
