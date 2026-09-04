/**
 * Only used to decide whether to *show* the admin nav link / page. This is
 * not the security boundary — grantGoldMembership and backfillTrialTiers
 * (functions/src/billing.ts) re-check the caller's email server-side
 * before doing anything privileged, so a client tampering with this
 * constant can't actually grant itself anything.
 */
export const ADMIN_EMAIL = 'adonai4you@gmail.com'
