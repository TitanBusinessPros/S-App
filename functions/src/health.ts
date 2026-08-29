import { onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

/**
 * Simple health-check callable function. Proves out the deploy pipeline
 * and the CI test-coverage enforcement (see testing/functions/).
 */
export const healthCheck = onCall((request) => {
  logger.info("healthCheck invoked", { auth: !!request.auth });
  return {
    status: "ok",
    timestamp: Date.now(),
  };
});
