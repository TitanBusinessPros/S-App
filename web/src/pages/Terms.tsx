import { LegalPageLayout } from '../components/LegalPageLayout'

const LAST_UPDATED = 'September 5, 2026'

export function Terms() {
  return (
    <LegalPageLayout title="Terms of Service" updated={LAST_UPDATED}>
      <div className="legal-callout legal-callout-warning">
        ⚠️ <strong>Read this first:</strong> Survival Day provides general educational information about
        wilderness survival, foraging, and outdoor safety. It is <strong>not</strong> a substitute for
        professional training, medical care, or expert identification of plants, fungi, insects, or wildlife.
        Misidentifying wild food or misapplying survival or first-aid techniques can cause serious injury,
        illness, or death. Wilderness activities carry inherent risk. By using this app, you agree that you are
        solely responsible for your own safety and decisions in the field.
      </div>

      <p>
        These Terms of Service ("Terms") govern your access to and use of the Survival Day application (the
        "Service"), operated by Titan Business Pros LLC ("Titan Business Pros," "we," "us," or "our"). By
        creating an account or using the Service, you agree to these Terms. If you do not agree, do not use the
        Service.
      </p>

      <h2>1. The Service</h2>
      <p>
        Survival Day is an offline-first informational app covering topics such as a compass and star
        navigation, water and terrain maps, weather forecasts, plant/wildlife/wood identification, first aid,
        shelter building, snares and traps, and wild-game recipes. Content is general-purpose and not tailored
        to your specific location, physical condition, medical history, or experience level.
      </p>

      <h2>2. Not Professional Advice; Assumption of Risk</h2>
      <p>
        Nothing in the Service constitutes medical, legal, or professional wilderness-guiding advice. Species
        identification, foraging, and recipe content are provided for general education only — always verify
        any plant, fungus, insect, or animal with a qualified local expert before consuming it, and never eat
        anything you cannot confidently identify as safe. First-aid content is not a substitute for training,
        certification, or professional medical treatment; seek emergency services for any serious injury or
        illness. You assume full responsibility and all risk for any outdoor, survival, foraging, or first-aid
        activity you undertake, whether or not based on information from the Service.
      </p>

      <h2>3. Accounts</h2>
      <p>
        The Service uses Google Sign-In only — there is no separate username or password to create or lose. You
        are responsible for maintaining the security of the Google account you sign in with, and for all
        activity that occurs under your account.
      </p>

      <h2>4. Free Trial, Subscriptions &amp; Billing</h2>
      <p>
        New accounts receive a free trial period (currently 3 days) with full access to the Service. After the
        trial ends, continued access to paid features requires an active annual subscription (currently
        $12/year), billed and processed securely through Stripe. Subscriptions do not auto-renew unless you
        initiate a new payment through Stripe's checkout; we do not store your payment card details ourselves.
        At our sole discretion, we may grant certain individuals (e.g., partners or people helping promote the
        app) a complimentary "Gold" membership at no charge and for no fixed term. We may change trial length,
        pricing, or which features require a subscription at any time, with the change applying prospectively.
      </p>

      <h2>5. Acceptable Use</h2>
      <p>
        You agree not to misuse the Service, including by attempting to circumvent billing or access controls,
        interfering with the Service's operation, or using it for any unlawful purpose.
      </p>

      <h2>6. Intellectual Property</h2>
      <p>
        The Service, including its content, design, and branding, is owned by Titan Business Pros LLC or its
        licensors and is protected by applicable intellectual property laws. You may use the Service for your
        own personal, non-commercial purposes only.
      </p>

      <h2>7. Third-Party Data &amp; Services</h2>
      <p>
        The Service displays data from independent third parties, including Open-Meteo (weather), the USGS
        (water features), and GBIF (species occurrence records), and relies on Google (sign-in) and Stripe
        (payments) to operate. We do not control and are not responsible for the accuracy, availability, or
        reliability of any third-party data or service, and your use of those third parties is subject to their
        own terms and policies.
      </p>

      <h2>8. Disclaimer of Warranties</h2>
      <p>
        THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED,
        INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, ACCURACY, OR
        NON-INFRINGEMENT. WE DO NOT WARRANT THAT ANY CONTENT IS ACCURATE, COMPLETE, OR SAFE TO RELY ON IN A
        REAL SURVIVAL OR MEDICAL SITUATION.
      </p>

      <h2>9. Limitation of Liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, TITAN BUSINESS PROS LLC AND ITS OWNERS, EMPLOYEES, AND AGENTS
        WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY
        LOSS OF LIFE, PERSONAL INJURY, ILLNESS, OR PROPERTY DAMAGE, ARISING FROM OR RELATED TO YOUR USE OF THE
        SERVICE OR RELIANCE ON ANY CONTENT IN IT, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR TOTAL
        LIABILITY FOR ANY CLAIM RELATING TO THE SERVICE WILL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS
        BEFORE THE CLAIM AROSE.
      </p>

      <h2>10. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless Titan Business Pros LLC from any claims, damages, or expenses
        arising from your use of the Service or violation of these Terms.
      </p>

      <h2>11. Termination</h2>
      <p>
        We may suspend or terminate your access to the Service at any time, for any reason, including a
        violation of these Terms. You may stop using the Service and cancel any subscription at any time.
      </p>

      <h2>12. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. Continued use of the Service after a change means you
        accept the updated Terms. We'll update the "Last updated" date above when that happens.
      </p>

      <h2>13. Governing Law</h2>
      <p>
        These Terms are governed by the laws of the State of Oklahoma, without regard to conflict-of-law
        principles, and any dispute will be resolved in the state or federal courts located in Oklahoma County,
        Oklahoma.
      </p>

      <h2>14. Contact</h2>
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
