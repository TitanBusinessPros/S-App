/**
 * The one account that always has full, permanent access and is the only
 * one allowed to call grantGoldMembership (see billing.ts). Lowercase —
 * every comparison against it must lowercase the incoming email first.
 */
export const ADMIN_EMAIL = "adonai4you@gmail.com";

/** Every new sign-in gets this much time on every feature before the
 * paywall applies — see createUserProfile (auth.ts) and the client-side
 * useEntitlement hook (web/src/lib/entitlement.ts), which is what actually
 * decides "trial expired" by comparing against this timestamp. Nothing
 * server-side needs to run when a trial ends. */
export const TRIAL_DURATION_MS = 30 * 24 * 60 * 60 * 1000;
