import { onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

/**
 * Simple health-check callable function. Proves out the deploy pipeline
 * and the CI test-coverage enforcement (see testing/functions/).
 * (Content bumped again to force a fresh Cloud Build against the
 * package.json "files" allowlist fix.)
 */
export const healthCheck = onCall({ invoker: "public" }, (request) => {
  logger.info("healthCheck invoked", { auth: !!request.auth });
  return {
    status: "ok",
    timestamp: Date.now(),
  };
});
