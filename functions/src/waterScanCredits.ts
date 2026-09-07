import { HttpsError } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";

/** How many water scans a signed-in user gets before the credit window resets. */
export const DAILY_WATER_SCAN_LIMIT = 3;

/** The credit window: a rolling 24 hours from the first scan that opened the
 * current window — not a fixed midnight reset. So if your first scan of the
 * day is at 3pm, your next 3 scans free up again at 3pm the next day. */
export const WATER_SCAN_WINDOW_MS = 24 * 60 * 60 * 1000;

interface WaterScanCreditDoc {
  count: number;
  windowStartAt: number;
}

export interface ConsumeWaterScanCreditResult {
  /** Scans left in the window AFTER this one was consumed. */
  creditsRemaining: number;
}

/**
 * Atomically checks and consumes one water-scan credit for `uid`, gating
 * every call to getWaterFeatures — this is the actual enforcement point, so
 * it can't be bypassed by a client that skips the "Scan for Water" button's
 * own bookkeeping. Costs a credit on every allowed call, cache hit or not:
 * the limit is about how often someone presses the button, not about which
 * calls happen to reach USGS.
 *
 * Throws a `resource-exhausted` HttpsError (with `details.resetAt`, the
 * epoch ms the next credit becomes available) once DAILY_WATER_SCAN_LIMIT is
 * used up within the current window.
 */
export async function consumeWaterScanCredit(uid: string): Promise<ConsumeWaterScanCreditResult> {
  const db = getFirestore();
  const ref = db.collection("waterScanCredits").doc(uid);

  let creditsRemaining = 0;
  let exhausted = false;
  let resetAt = 0;

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const now = Date.now();
    const existing = snap.exists ? (snap.data() as WaterScanCreditDoc) : null;

    const windowExpired = !existing || now - existing.windowStartAt >= WATER_SCAN_WINDOW_MS;
    const windowStartAt = windowExpired ? now : existing!.windowStartAt;
    const currentCount = windowExpired ? 0 : existing!.count;

    if (currentCount >= DAILY_WATER_SCAN_LIMIT) {
      exhausted = true;
      resetAt = windowStartAt + WATER_SCAN_WINDOW_MS;
      return;
    }

    const newCount = currentCount + 1;
    tx.set(ref, { count: newCount, windowStartAt });
    creditsRemaining = DAILY_WATER_SCAN_LIMIT - newCount;
  });

  if (exhausted) {
    throw new HttpsError(
      "resource-exhausted",
      "You've used all 3 water scans for today. They reset 24 hours after your first scan.",
      { resetAt },
    );
  }

  return { creditsRemaining };
}
