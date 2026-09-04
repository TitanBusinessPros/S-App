import functionsTest from "firebase-functions-test";

const testEnv = functionsTest();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getLocationName } = require("../../functions/src/location");

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

  it("resolves the nearest city and includes attribution", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ address: { city: "Norman", state: "Oklahoma", county: "Cleveland County" } }),
    }) as unknown as typeof fetch;

    const wrapped = testEnv.wrap(getLocationName);
    const result = await wrapped({ data: { lat: 35.2226, lng: -97.4395 } });

    expect(result.locality).toBe("Norman, Oklahoma");
    expect(result.attribution).toContain("OpenStreetMap");
  });

  it("falls back through town/village/hamlet/county when city is missing", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ address: { hamlet: "Tiny Hamlet", state: "Oklahoma" } }),
    }) as unknown as typeof fetch;

    const wrapped = testEnv.wrap(getLocationName);
    const result = await wrapped({ data: { lat: 35.5, lng: -97.5 } });

    expect(result.locality).toBe("Tiny Hamlet, Oklahoma");
  });

  it("returns a null locality (not an error) when nothing usable is in the address", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ address: {} }),
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
