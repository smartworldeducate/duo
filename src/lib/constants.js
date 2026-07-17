/**
 * App-wide constants for the Duo admin dashboard.
 * Brand name is centralized here — change BRAND to re-label the whole UI.
 */
export const BRAND = "Duo";
export const BRAND_TAGLINE = "Matchmaking Admin";

/**
 * Public APK download config (used by /download).
 * Two hosted builds on Google Drive:
 *   - universal → "All devices"  (best compatibility, the default button)
 *   - modern    → "Modern devices"
 * The /download QR codes (public/downloads/qr-*.png) encode these same URLs.
 * Override with NEXT_PUBLIC_APK_URL / NEXT_PUBLIC_APK_URL_MODERN if needed.
 */

/**
 * Normalise any Google Drive link to the direct-download host.
 * A share link (drive.google.com/file/d/<id>/view) is a *preview* page: Android
 * deep-links it into the Drive app, which can't preview an APK and won't hand it
 * to the browser's downloader — so it only works from a desktop. The legacy
 * uc?export=download form also stalls on a virus-scan interstitial for builds
 * over 100 MB. drive.usercontent.google.com streams the bytes on every device.
 * Non-Drive URLs (a self-hosted /downloads/*.apk, S3, …) pass through untouched.
 */
export function directDownloadUrl(url) {
  const m = String(url || "").match(/\/file\/d\/([\w-]+)|[?&]id=([\w-]+)/);
  if (!m) return url;
  return `https://drive.usercontent.google.com/download?id=${m[1] || m[2]}&export=download&confirm=t`;
}

const drive = (id) => directDownloadUrl(`https://drive.google.com/file/d/${id}/view`);
const UNIVERSAL = process.env.NEXT_PUBLIC_APK_URL || drive("1zTNh_KfIo006X4lUw9mMQq_c_Xm4NyBx");
const MODERN = process.env.NEXT_PUBLIC_APK_URL_MODERN || drive("1w9tmOogaYYVnzZ4p_6w6I0Lq4_oc0rxN");

export const APK = {
  url: UNIVERSAL, // primary download = all devices
  universal: UNIVERSAL,
  modern: MODERN,
  version: process.env.NEXT_PUBLIC_APK_VERSION || "1.0.0",
  // Spans both builds: modern ≈51 MB, universal ≈139 MB.
  size: process.env.NEXT_PUBLIC_APK_SIZE || "51–139 MB",
  minAndroid: "Android 7.0+",
  packageName: "com.leveldo",
};

/** Firestore collection names — mirror the mobile app (services/firebase.ts). */
export const Collections = {
  users: "users",
  matchRequests: "match_requests",
  photoRequests: "photo_requests",
  chatRooms: "chat_rooms",
  messages: "messages",
  notifications: "notifications",
  reports: "reports",
  calls: "calls",
};

/** Data collections shown on the Settings → Data management screen. */
export const DATA_COLLECTIONS = [
  { label: "Notifications", name: "notifications", desc: "In-app & push alerts", tone: "rose" },
  { label: "Reports", name: "reports", desc: "User-submitted reports", tone: "red" },
  { label: "Messages", name: "messages", desc: "All chat messages", tone: "violet" },
  { label: "Chat Rooms", name: "chat_rooms", desc: "Conversation threads", tone: "sky" },
  { label: "Match Requests", name: "match_requests", desc: "Connection requests", tone: "pink" },
  { label: "Photo Requests", name: "photo_requests", desc: "Photo view requests", tone: "purple" },
  { label: "Call Logs", name: "calls", desc: "Voice & video calls", tone: "green" },
];
