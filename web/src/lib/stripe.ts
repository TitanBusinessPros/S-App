/**
 * The $12/year Stripe Payment Link. Not a secret — it's meant to be public,
 * same as any "buy now" link.
 */
export const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/7sY8wQ5xn5ok99UgnR7AI0X'

/**
 * Appends the signed-in user's uid and email to the payment link so the
 * Stripe webhook (functions/src/billing.ts) can match the completed
 * checkout back to the right Firestore account without any guesswork.
 * client_reference_id and prefilled_email are both plain Stripe Payment
 * Link query parameters — no server round-trip needed to build this.
 */
export function buildCheckoutUrl(uid: string, email: string | null): string {
  const url = new URL(STRIPE_PAYMENT_LINK)
  url.searchParams.set('client_reference_id', uid)
  if (email) url.searchParams.set('prefilled_email', email)
  return url.toString()
}
