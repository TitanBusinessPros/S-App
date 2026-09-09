import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  CACHE_SIZE_UNLIMITED,
} from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'
import { getAnalytics, isSupported as isAnalyticsSupported, type Analytics } from 'firebase/analytics'

// Firebase web config. The apiKey here is a public client identifier, not a
// secret — it's safe to commit (access is governed by Firestore/Auth rules
// and Firebase's key restrictions, not by hiding this value). Real secrets
// (Stripe keys, etc.) live in GitHub Actions secrets / Cloud Functions
// config, never here.
const firebaseConfig = {
  apiKey: 'AIzaSyCanBFQg7U204ifZTLjrHPpDS41QcvOWps',
  authDomain: 'survival-day-app.firebaseapp.com',
  projectId: 'survival-day-app',
  storageBucket: 'survival-day-app.firebasestorage.app',
  messagingSenderId: '1026576381122',
  appId: '1:1026576381122:web:393ee6d34836239c7a375b',
  measurementId: 'G-QX7JWKJFKH',
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

// Offline-first: persist Firestore reads/writes to IndexedDB with no size
// cap, so a user's saved water areas (see savedWaterAreas.ts) survive
// across sessions instead of being evicted by Firestore's default LRU
// cache limit. Note: this doesn't protect against the browser/OS clearing
// site data under its own storage pressure — that's disclosed in the UI,
// not something a web app can prevent.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  }),
})

export const functions = getFunctions(app)

// Analytics needs an async support check before it can be used — it's
// unavailable in some contexts (private-browsing modes that block
// IndexedDB/cookies, this app's own test suite under jsdom) and, unlike the
// SDKs above, throws instead of silently no-opping if you skip the check.
// Callers get a promise that resolves to null in any unsupported
// environment rather than a synchronous instance — see analytics.ts.
export const analyticsReady: Promise<Analytics | null> = isAnalyticsSupported()
  .then((supported) => (supported ? getAnalytics(app) : null))
  .catch(() => null)

// Google is the ONLY sign-in method for this app — no email/password.
export const googleProvider = new GoogleAuthProvider()
