import { HttpsError } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";

interface CreditDoc {
  count: number;
  windowStartAt: number;
}

export interface ConsumeCreditResult {
  /** Credits left in the window AFTER this one was consumed. */
  creditsRemaining: number;
}

/**
 * Atomically checks and consumes one credit for `uid` in `collection`,
 * within a rolling `windowMs` window capped at `limit` credits — the shared
 * transaction behind every per-user "N times per rolling 24h" feature gate
 * (water scans, species lookups, ...), extracted here so the rolling-window
 * logic itself isn't duplicated per feature. See waterScanCredits.ts and
 * speciesLookupCredits.ts for the actual named wrappers each feature calls.
 *
 * Throws a `resource-exhausted` HttpsError (with `details.resetAt`, the
 * epoch ms the next credit becomes available) once `limit` is used up
 * within the current window.
 */
export async function consumeDailyCredit(
  collection: string,
  uid: string,
  limit: number,
  windowMs: number,
  exhaustedMessage: string,
): Promise<ConsumeCreditResult> {
  const db = getFirestore();
  const ref = db.collection(collection).doc(uid);

  let creditsRemaining = 0;
  let exhausted = false;
  let resetAt = 0;

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const now = Date.now();
    const existing = snap.exists ? (snap.data() as CreditDoc) : null;

    const windowExpired = !existing || now - existing.windowStartAt >= windowMs;
    const windowStartAt = windowExpired ? now : existing!.windowStartAt;
    const currentCount = windowExpired ? 0 : existing!.count;

    if (currentCount >= limit) {
      exhausted = true;
      resetAt = windowStartAt + windowMs;
      return;
    }

    const newCount = currentCount + 1;
    tx.set(ref, { count: newCount, windowStartAt });
    creditsRemaining = limit - newCount;
  });

  if (exhausted) {
    throw new HttpsError("resource-exhausted", exhaustedMessage, { resetAt });
  }

  return { creditsRemaining };
}
