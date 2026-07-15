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

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
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
