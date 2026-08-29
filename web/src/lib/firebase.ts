import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'

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
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const functions = getFunctions(app)

// Google is the ONLY sign-in method for this app — no email/password.
export const googleProvider = new GoogleAuthProvider()
