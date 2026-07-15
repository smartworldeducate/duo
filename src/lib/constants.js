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
const drive = (id) => `https://drive.google.com/uc?export=download&id=${id}`;
const UNIVERSAL = process.env.NEXT_PUBLIC_APK_URL || drive("1sXdp87wjx1HRqWcK7W-HtELiUVHUcg58");
const MODERN = process.env.NEXT_PUBLIC_APK_URL_MODERN || drive("1PbkA0RIqHH6Y1CFeV2V0RuMiSeh9EBMy");

export const APK = {
  url: UNIVERSAL, // primary download = all devices
  universal: UNIVERSAL,
  modern: MODERN,
  version: process.env.NEXT_PUBLIC_APK_VERSION || "1.0.0",
  size: process.env.NEXT_PUBLIC_APK_SIZE || "24 MB",
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
