import { Shell } from '../components/Shell'
import { useAuth } from '../lib/AuthContext'
import { useEntitlement } from '../lib/entitlement'
import { buildCheckoutUrl } from '../lib/stripe'
import './Upgrade.css'

export function Upgrade() {
  const { user } = useAuth()
  const { loading, isTrialing, trialDaysLeft, tier } = useEntitlement()

  const checkoutUrl = user ? buildCheckoutUrl(user.uid, user.email) : null

  return (
    <Shell>
      <div className="upgrade-header">
        <h1>🧭 Survival Day Membership</h1>
        <p>One price, everything unlocked, all year.</p>
      </div>

      {loading && (
        <div className="card upgrade-state">
          <p>Loading your membership status…</p>
        </div>
      )}

      {!loading && (
        <>
          {isTrialing && (
            <div className="card upgrade-trial-banner">
              🎁 You're on your free trial — <strong>{trialDaysLeft} day{trialDaysLeft === 1 ? '' : 's'}</strong> left.
            </div>
          )}

          {!isTrialing && tier === 'gold' && (
            <div className="card upgrade-state upgrade-good">
              <p>⭐ You have permanent Gold membership — every feature, no billing, ever. Thank you for building this app!</p>
            </div>
          )}

          {!isTrialing && tier === 'premium' && (
            <div className="card upgrade-state upgrade-good">
              <p>✅ You're subscribed. Every feature is unlocked — thanks for supporting Survival Day!</p>
            </div>
          )}

          {(tier === 'trial' || tier === 'free') && (
            <div className="card upgrade-pitch">
              <div className="upgrade-price">
                <span className="upgrade-price-amount mono">$12</span>
                <span className="upgrade-price-period">/ year</span>
              </div>
              <p className="upgrade-price-breakdown">
                That's just <strong>$1 a month</strong> — less than a candy bar, to carry a survival guide with you
                everywhere you go, all year long. So worth it!!!
              </p>

              <ul className="upgrade-benefits">
                <li>🧭 Compass, water &amp; terrain maps, and weather</li>
                <li>🌿 Species, first aid, shelter, snares &amp; recipes</li>
              </ul>

              <a
                className="btn btn-primary upgrade-cta"
                href={checkoutUrl ?? '#'}
                target="_blank"
                rel="noreferrer"
              >
                {isTrialing ? 'Subscribe now — lock in $1/month' : 'Subscribe for $12/year'}
              </a>
              <p className="upgrade-fineprint">
                Handled securely by Stripe. Cancel anytime — you'll keep access through the end of your billing year.
              </p>
            </div>
          )}
        </>
      )}
    </Shell>
  )
}
