/** Jest config for Firebase Cloud Functions unit tests. */
module.exports = {
  testEnvironment: "node",
  rootDir: "../../",
  roots: ["<rootDir>/testing/functions"],
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "<rootDir>/testing/functions/tsconfig.json" }],
  },
};
