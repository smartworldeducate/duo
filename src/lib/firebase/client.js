/**
 * Firebase Web SDK bootstrap (client-side only).
 *
 * Reads the config from NEXT_PUBLIC_FIREBASE_* env vars. If the config is
 * incomplete OR NEXT_PUBLIC_DATA_SOURCE=mock, Firebase is not initialized and
 * `isFirebaseEnabled` is false — the data service then serves built-in demo
 * data so the dashboard always renders.
 */
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

/**
 * Firebase Web config for project leveldo-43cdc.
 * These are PUBLIC identifiers (Firebase's apiKey is not a secret — it ships in
 * every client bundle; access is enforced by Firestore security rules). They're
 * baked in as defaults so any deploy connects to live Firestore with no extra
 * env setup; env vars still override them if provided.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAO1Ai3T1DsFVEdrl71Cwj_GTZtIsyNDDQ",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "leveldo-43cdc.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "leveldo-43cdc",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "leveldo-43cdc.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "963853518910",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:963853518910:android:46a11a3b34bf9750c1296f",
};

const DATA_SOURCE = process.env.NEXT_PUBLIC_DATA_SOURCE || "firebase";

export const isFirebaseEnabled =
  DATA_SOURCE !== "mock" &&
  !!firebaseConfig.apiKey &&
  !!firebaseConfig.projectId;

let app = null;
let db = null;
let auth = null;

if (isFirebaseEnabled) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
}

export { app, db, auth, firebaseConfig };
