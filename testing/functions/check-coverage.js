#!/usr/bin/env node
/**
 * Enforces the project rule: every deployed Cloud Function must have a
 * matching test in testing/functions/.
 *
 * How it works:
 *   1. Parses functions/src/*.ts for top-level `export const <name> =` /
 *      `export function <name>(` declarations — these are the deployed
 *      function entry points.
 *   2. Scans testing/functions/*.test.ts for `describe("<name>"` blocks
 *      (or a bare reference to the function name) to confirm each one is
 *      referenced by a test.
 *   3. Exits non-zero, listing the gaps, if any function has no test.
 *
 * This runs as its own CI job (see .github/workflows/ci.yml) so 100%
 * function-test coverage is a hard requirement, not a convention.
 */

const fs = require("fs");
const path = require("path");

const FUNCTIONS_SRC_DIR = path.join(__dirname, "..", "..", "functions", "src");
const TESTING_DIR = __dirname;

function getExportedFunctionNames(dir) {
  const names = [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".ts"));

  for (const file of files) {
    const content = fs.readFileSync(path.join(dir, file), "utf8");
    const exportConstRe = /export\s+const\s+(\w+)\s*=/g;
    const exportFnRe = /export\s+function\s+(\w+)\s*\(/g;

    let match;
    while ((match = exportConstRe.exec(content)) !== null) {
      names.push(match[1]);
    }
    while ((match = exportFnRe.exec(content)) !== null) {
      names.push(match[1]);
    }
  }

  return names;
}

function getTestedFunctionNames(dir) {
  const tested = new Set();
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".test.ts"));

  for (const file of files) {
    const content = fs.readFileSync(path.join(dir, file), "utf8");
    tested.add(content);
  }

  return { files, blob: files.map((f) => fs.readFileSync(path.join(dir, f), "utf8")).join("\n") };
}

function main() {
  if (!fs.existsSync(FUNCTIONS_SRC_DIR)) {
    console.error(`functions/src directory not found at ${FUNCTIONS_SRC_DIR}`);
    process.exit(1);
  }

  const deployedFunctions = getExportedFunctionNames(FUNCTIONS_SRC_DIR);
  const { files: testFiles, blob: testBlob } = getTestedFunctionNames(TESTING_DIR);

  const missing = deployedFunctions.filter((name) => {
    const nameRe = new RegExp(`\\b${name}\\b`);
    return !nameRe.test(testBlob);
  });

  console.log(`Deployed functions found: ${deployedFunctions.length ? deployedFunctions.join(", ") : "(none)"}`);
  console.log(`Test files scanned: ${testFiles.length ? testFiles.join(", ") : "(none)"}`);

  if (missing.length > 0) {
    console.error("\n❌ Missing test coverage for the following function(s):");
    missing.forEach((name) => console.error(`   - ${name}`));
    console.error("\nAdd a test referencing each function in testing/functions/ before this can merge.");
    process.exit(1);
  }

  console.log("\n✅ 100% of deployed functions have matching tests.");
}

main();
