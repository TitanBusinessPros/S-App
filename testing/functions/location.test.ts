import functionsTest from "firebase-functions-test";

const testEnv = functionsTest();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getLocationName } = require("../../functions/src/location");

function censusResponse(geographies: Record<string, unknown[]>) {
  return { result: { geographies } };
}

describe("getLocationName", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  afterAll(() => {
    testEnv.cleanup();
  });

  it("rejects missing/invalid arguments", async () => {
    const wrapped = testEnv.wrap(getLocationName);
    await expect(wrapped({ data: { lat: 35.5 } })).rejects.toThrow(/required numbers/);
  });

  it("rejects out-of-range coordinates", async () => {
    const wrapped = testEnv.wrap(getLocationName);
    await expect(wrapped({ data: { lat: 999, lng: 0 } })).rejects.toThrow(/out of range/);
  });

  it("resolves the nearest incorporated place and includes attribution", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () =>
        censusResponse({
          "Incorporated Places": [{ BASENAME: "Norman", NAME: "Norman city" }],
          States: [{ NAME: "Oklahoma" }],
        }),
    }) as unknown as typeof fetch;

    const wrapped = testEnv.wrap(getLocationName);
    const result = await wrapped({ data: { lat: 35.2226, lng: -97.4395 } });

    expect(result.locality).toBe("Norman, Oklahoma");
    expect(result.attribution).toContain("Census");
  });

  it("falls back to the county subdivision when no incorporated place covers this point", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () =>
        censusResponse({
          "County Subdivisions": [{ BASENAME: "Norman", NAME: "Norman CCD" }],
          States: [{ NAME: "Oklahoma" }],
        }),
    }) as unknown as typeof fetch;

    const wrapped = testEnv.wrap(getLocationName);
    const result = await wrapped({ data: { lat: 35.5, lng: -97.5 } });

    expect(result.locality).toBe("Norman, Oklahoma");
  });

  it("falls back to the county when neither a place nor a county subdivision is available", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () =>
        censusResponse({
          Counties: [{ BASENAME: "Cleveland", NAME: "Cleveland County" }],
          States: [{ NAME: "Oklahoma" }],
        }),
    }) as unknown as typeof fetch;

    const wrapped = testEnv.wrap(getLocationName);
    const result = await wrapped({ data: { lat: 35.5, lng: -97.5 } });

    expect(result.locality).toBe("Cleveland County, Oklahoma");
  });

  it("returns a null locality (not an error) when nothing usable is in the geographies", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => censusResponse({}),
    }) as unknown as typeof fetch;

    const wrapped = testEnv.wrap(getLocationName);
    const result = await wrapped({ data: { lat: 0, lng: 0 } });

    expect(result.locality).toBeNull();
  });

  it("degrades to a null locality (not a thrown error) when the lookup fails", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("network down")) as unknown as typeof fetch;

    const wrapped = testEnv.wrap(getLocationName);
    const result = await wrapped({ data: { lat: 35.5, lng: -97.5 } });

    expect(result.locality).toBeNull();
    expect(result.attribution).toBe("");
  });
});
