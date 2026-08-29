import functionsTest from "firebase-functions-test";

const testEnv = functionsTest();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { healthCheck } = require("../../functions/src/index");

describe("healthCheck", () => {
  afterAll(() => {
    testEnv.cleanup();
  });

  it("returns an ok status with a timestamp", async () => {
    const wrapped = testEnv.wrap(healthCheck);
    const result = await wrapped({ data: {} });

    expect(result.status).toBe("ok");
    expect(typeof result.timestamp).toBe("number");
  });
});
