/**
 * Admin authentication — secure, no shared/hardcoded credentials.
 *
 * Admins sign in with their OWN Firebase email + password, typed at login and
 * sent straight to Firebase Auth (never stored in the code or the client
 * bundle). Access to Firestore is then governed by your security rules, so only
 * real admin accounts can read/write. In mock mode (no backend) any non-empty
 * credentials unlock the local demo, which has no real data.
 */
import { isFirebaseEnabled, auth } from "./firebase/client";

export async function signInAdmin(email, password) {
  const e = (email || "").trim();
  if (!e || !password) throw new Error("Enter your admin email and password.");

  if (!isFirebaseEnabled) {
    // Local demo only (built-in mock data, no backend).
    return { email: e };
  }

  const { signInWithEmailAndPassword } = await import("firebase/auth");
  const cred = await signInWithEmailAndPassword(auth, e, password);
  return { email: cred.user.email, uid: cred.user.uid };
}

export async function signOutAdmin() {
  if (!isFirebaseEnabled) return;
  const { signOut } = await import("firebase/auth");
  await signOut(auth).catch(() => {});
}

export async function sendPasswordReset(email) {
  if (!isFirebaseEnabled) return;
  const { sendPasswordResetEmail } = await import("firebase/auth");
  await sendPasswordResetEmail(auth, (email || "").trim());
}
