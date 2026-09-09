import { consumeDailyCredit, type ConsumeCreditResult } from "./dailyCredits";

/** How many water scans a signed-in user gets before the credit window resets. */
export const DAILY_WATER_SCAN_LIMIT = 3;

/** The credit window: a rolling 24 hours from the first scan that opened the
 * current window — not a fixed midnight reset. So if your first scan of the
 * day is at 3pm, your next 3 scans free up again at 3pm the next day. */
export const WATER_SCAN_WINDOW_MS = 24 * 60 * 60 * 1000;

export type ConsumeWaterScanCreditResult = ConsumeCreditResult;

/**
 * Atomically checks and consumes one water-scan credit for `uid`, gating
 * every call to getWaterFeatures — this is the actual enforcement point, so
 * it can't be bypassed by a client that skips the "Scan for Water" button's
 * own bookkeeping. Costs a credit on every allowed call, cache hit or not:
 * the limit is about how often someone presses the button, not about which
 * calls happen to reach USGS.
 *
 * A thin wrapper around the shared dailyCredits.ts transaction, scoped to
 * its own waterScanCredits/{uid} collection so this limit never shares
 * credits with speciesLookupCredits.ts's.
 *
 * Throws a `resource-exhausted` HttpsError (with `details.resetAt`, the
 * epoch ms the next credit becomes available) once DAILY_WATER_SCAN_LIMIT is
 * used up within the current window.
 */
export async function consumeWaterScanCredit(uid: string): Promise<ConsumeWaterScanCreditResult> {
  return consumeDailyCredit(
    "waterScanCredits",
    uid,
    DAILY_WATER_SCAN_LIMIT,
    WATER_SCAN_WINDOW_MS,
    "You've used all 3 water scans for today. They reset 24 hours after your first scan.",
  );
}
