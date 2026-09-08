import { LegalPageLayout } from '../components/LegalPageLayout'

const LAST_UPDATED = 'September 7, 2026'

export function Privacy() {
  return (
    <LegalPageLayout title="Privacy Policy" updated={LAST_UPDATED}>
      <div className="legal-callout legal-callout-info">
        🔒 <strong>In short:</strong> We collect only what's needed to run your account and the features you use
        — your Google name/email/photo, your device location when a feature needs it, and billing status from
        Stripe. We don't run ads, don't use analytics/advertising trackers, and don't sell your data.
      </div>

      <p>
        This Privacy Policy explains what information Titan Business Pros LLC ("we," "us," or "our") collects
        through the Survival Day application (the "Service"), how we use it, and your choices. By using the
        Service, you agree to this Policy.
      </p>

      <h2>1. Information We Collect</h2>

      <h3>Account information</h3>
      <p>
        Survival Day uses Google Sign-In only. When you sign in, Google shares your email address, display
        name, and profile photo URL with us via Firebase Authentication. We never see or store your Google
        password.
      </p>

      <h3>Location data</h3>
      <p>
        Certain features in the Service need to know your device's precise location in order to work — for
        example, to find water sources or wildlife near you, or to calculate your position for navigation. When
        you open one of those features, your browser or device will ask your permission before sharing it, and
        that feature won't function if you decline. For features that look something up on our servers (like
        nearby water or species data), your location is sent, per request, to our own Cloud Functions; other
        location-based features keep that data entirely on your own device and never send it to us. We do not
        permanently store your location tied to your identity, with one exception: if you choose to save a
        water-area search for offline use, that specific location, radius, and result data is stored in your
        own private account record until you delete it.
      </p>

      <h3>Billing information</h3>
      <p>
        If you subscribe, Stripe collects and processes your payment details directly on its own secure
        checkout page — we never receive or store your card number. We do store the Stripe customer ID,
        subscription ID, and subscription status Stripe provides us, so the app knows whether your account has
        paid access.
      </p>

      <h3>Account/subscription metadata</h3>
      <p>
        We store, in your own account record: your subscription tier (trial, free, premium, or gold), your
        trial start/end dates, and your account creation date. We also track how many Water & Terrain Map
        scans you've used in the current 24-hour period, so the "Scan for Water" button can enforce its daily
        limit.
      </p>

      <h2>2. What We Don't Collect</h2>
      <p>
        We don't use advertising or analytics trackers (no ad networks, no behavioral analytics SDKs), we don't
        run ads, and we never ask for or store a password — Google Sign-In handles that. We don't sell your
        personal information to anyone.
      </p>

      <h2>3. How We Use Information</h2>
      <p>
        We use the information above to: operate your account and remember your preferences; determine trial
        and subscription access; process and reconcile payments through Stripe; provide the location-based
        features you request; and for basic server-side logging to diagnose errors in our Cloud Functions.
      </p>

      <h2>4. Where Data Is Stored</h2>
      <p>
        Your account and saved data live in Google Firebase (Firestore, Authentication, Cloud Functions,
        Hosting), running on Google Cloud infrastructure. The app also stores some data only on your own
        device — such as offline caches and a record of whether you've installed the app — using your browser's
        local storage; that device-local data never leaves your device or reaches us.
      </p>

      <h2>5. Third-Party Services</h2>
      <p>The Service relies on these third parties, each under its own privacy policy:</p>
      <ul>
        <li><strong>Google</strong> — sign-in and the Firebase infrastructure the app runs on.</li>
        <li><strong>Stripe</strong> — payment processing for subscriptions.</li>
        <li>
          <strong>USGS (National Map)</strong>, <strong>GBIF</strong>, and the <strong>U.S. Census Bureau</strong>
          (place-name lookups) — water-feature, species-occurrence, and location-label data, fetched by our own
          Cloud Functions on your behalf (none of these receive your location or IP directly from your device).
        </li>
        <li>
          <strong>OpenFreeMap</strong> — map tiles for the 3D Maps feature. Unlike the sources above, your device
          loads map imagery directly from OpenFreeMap as you look around, so it receives standard web request
          data (such as your IP address) the same way any map provider would; OpenFreeMap's own privacy policy
          states it does not log IP addresses except temporarily during a security incident.
        </li>
      </ul>

      <h2>6. Data Retention</h2>
      <p>
        We retain your account and billing-status information for as long as your account exists. Saved water
        areas are retained until you delete them. You can request deletion of your account and associated data
        at any time — see "Contact" below.
      </p>

      <h2>7. Age Requirement</h2>
      <p>
        The Service is intended for use by adults age 18 and older only. It is not directed to, and must not be
        used by, anyone under 18, and we do not knowingly collect personal information from anyone under 18. If
        you are under 18, do not use the Service or provide us with any personal information. If we learn that
        we've collected personal information from someone under 18, we will delete it. If you believe a minor
        has provided us with personal information, please contact us using the information in "Contact" below.
      </p>

      <h2>8. Your Choices</h2>
      <p>
        You can deny or revoke location permission at any time in your browser or device settings — location-
        based features simply won't work without it. You can sign out at any time. You can request that we
        delete your account and associated data by contacting us below.
      </p>

      <h2>9. Data Security</h2>
      <p>
        We use Firestore security rules so your account data is readable only by you (and writable only by our
        trusted server-side functions, never directly by any client), HTTPS everywhere, and rely on Google and
        Stripe to handle authentication and payment details directly rather than passing through our own
        servers. No method of transmission or storage is 100% secure, but we take reasonable steps to protect
        your information.
      </p>

      <h2>10. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Continued use of the Service after a change means
        you accept the updated Policy. We'll update the "Last updated" date above when that happens.
      </p>

      <h2>11. Contact</h2>
      <p>
        Titan Business Pros LLC
        <br />
        Oklahoma City, OK
        <br />
        Phone: <a href="tel:+14059987979">405-998-7979</a>
        <br />
        Web: <a href="https://www.oklahoma.marketing" target="_blank" rel="noreferrer">www.oklahoma.marketing</a>
      </p>
    </LegalPageLayout>
  )
}
