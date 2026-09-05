import { useState, type FormEvent } from 'react'
import { Shell } from '../components/Shell'
import { grantGoldMembership, backfillTrialTiers } from '../lib/functionsApi'
import './Admin.css'

export function Admin() {
  const [email, setEmail] = useState('')
  const [granting, setGranting] = useState(false)
  const [grantMessage, setGrantMessage] = useState<string | null>(null)
  const [grantError, setGrantError] = useState<string | null>(null)

  const [migrating, setMigrating] = useState(false)
  const [migrateMessage, setMigrateMessage] = useState<string | null>(null)
  const [migrateError, setMigrateError] = useState<string | null>(null)

  const handleGrant = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) return

    setGranting(true)
    setGrantMessage(null)
    setGrantError(null)
    try {
      const result = await grantGoldMembership(trimmed)
      setGrantMessage(
        result.granted
          ? `✅ ${trimmed} now has Gold membership.`
          : `⏳ ${trimmed} doesn't have an account yet — Gold will apply automatically the moment they sign in.`,
      )
      setEmail('')
    } catch (err) {
      setGrantError(err instanceof Error ? err.message : 'Could not grant Gold membership.')
    } finally {
      setGranting(false)
    }
  }

  const handleMigrate = async () => {
    setMigrating(true)
    setMigrateMessage(null)
    setMigrateError(null)
    try {
      const result = await backfillTrialTiers()
      setMigrateMessage(
        result.updated > 0
          ? `✅ Started a fresh 3-day trial for ${result.updated} existing account${result.updated === 1 ? '' : 's'}.`
          : 'Nothing to migrate — every account already has a trial, subscription, or Gold.',
      )
    } catch (err) {
      setMigrateError(err instanceof Error ? err.message : 'Could not run the migration.')
    } finally {
      setMigrating(false)
    }
  }

  return (
    <Shell>
      <div className="admin-header">
        <h1>🛠️ Admin Dashboard</h1>
        <p>Only visible to the app admin account.</p>
      </div>

      <div className="card admin-card">
        <h3>Grant Gold Membership</h3>
        <p>
          For giving someone specific — a friend, reviewer, or anyone helping promote the app — permanent full
          access with no billing, ever. Unrelated to the trial migration below; works even if they haven't signed
          up yet.
        </p>
        <form className="admin-form" onSubmit={handleGrant}>
          <input
            type="email"
            className="admin-input"
            placeholder="person@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={granting}>
            {granting ? 'Granting…' : 'Grant Gold'}
          </button>
        </form>
        {grantMessage && <p className="admin-success">{grantMessage}</p>}
        {grantError && <p className="login-error">{grantError}</p>}
      </div>

      <div className="card admin-card">
        <h3>One-time: Start Trials for Prior Sign-Ups</h3>
        <p>
          Accounts created before the paywall shipped have no trial window yet. This gives each of them (everyone
          who signed up before today) a fresh 3-day trial starting now — a one-time migration, not a promotional
          grant. Safe to run more than once; already-migrated accounts are left alone.
        </p>
        <button type="button" className="btn" onClick={handleMigrate} disabled={migrating}>
          {migrating ? 'Running…' : 'Start 3-day trials'}
        </button>
        {migrateMessage && <p className="admin-success">{migrateMessage}</p>}
        {migrateError && <p className="login-error">{migrateError}</p>}
      </div>
    </Shell>
  )
}
