/**
 * Unified data service for the Duo admin dashboard.
 *
 * Every screen imports from here. When Firebase is configured
 * (isFirebaseEnabled) it subscribes to live Firestore collections and writes
 * real mutations; otherwise it serves the built-in demo data with an in-memory
 * pub/sub so the UI still behaves realistically (mutations reflect live).
 *
 * Shapes mirror the mobile app (appliction_src/data/types.ts).
 */
import { isFirebaseEnabled, db } from "../firebase/client";
import { Collections } from "../constants";
import { toMillis } from "../format";
import {
  mockProfiles,
  mockMatchRequests,
  mockPhotoRequests,
  mockChatRooms,
  mockMessages,
  mockNotifications,
  mockReports,
  mockCalls,
} from "./mockData";

/* ------------------------------------------------------------------ */
/* Firebase implementation                                             */
/* ------------------------------------------------------------------ */

let fb = null;
async function loadFb() {
  if (fb) return fb;
  fb = await import("firebase/firestore");
  return fb;
}

/** Subscribe to an entire collection; maps each doc via `shape`. */
function fbSubscribeCollection(name, shape, cb) {
  let unsub = () => {};
  loadFb().then(({ collection, onSnapshot }) => {
    unsub = onSnapshot(
      collection(db, name),
      (snap) => cb(snap.docs.map((d) => shape(d.id, d.data()))),
      () => cb([])
    );
  });
  return () => unsub();
}

/* ------------------------------------------------------------------ */
/* Mock implementation (in-memory pub/sub)                             */
/* ------------------------------------------------------------------ */

const store = {
  users: [...mockProfiles],
  match_requests: [...mockMatchRequests],
  photo_requests: [...mockPhotoRequests],
  chat_rooms: [...mockChatRooms],
  messages: [...mockMessages],
  notifications: [...mockNotifications],
  reports: [...mockReports],
  calls: [...mockCalls],
  config: { notificationsEnabled: true, apk: {} },
};

const listeners = {}; // name -> Set<cb>

function emit(name) {
  (listeners[name] || new Set()).forEach((cb) => cb([...store[name]]));
}

function mockSubscribe(name, cb) {
  if (!listeners[name]) listeners[name] = new Set();
  listeners[name].add(cb);
  cb([...store[name]]);
  return () => listeners[name].delete(cb);
}

const uid = () => "id_" + Math.random().toString(36).slice(2, 10);

/* ------------------------------------------------------------------ */
/* Doc shapers                                                         */
/* ------------------------------------------------------------------ */

const shapeUser = (id, d) => ({
  ...d,
  userId: id,
  createdAt: toMillis(d.createdAt) || 0,
  lastActive: d.lastActive ? toMillis(d.lastActive) : undefined,
});
const shapeRequest = (id, d) => ({
  requestId: id,
  senderId: d.senderId,
  receiverId: d.receiverId,
  status: d.status,
  createdAt: toMillis(d.createdAt),
});
const shapeRoom = (id, d) => ({
  chatRoomId: id,
  userIds: d.userIds ?? [],
  lastMessage: d.lastMessage ?? "",
  lastMessageTime: toMillis(d.lastMessageTime),
  unread:
    typeof d.unread === "number"
      ? d.unread
      : Object.values(d.unread || {}).reduce((a, b) => a + (b || 0), 0),
  createdAt: toMillis(d.createdAt),
});
const shapeMessage = (id, d) => ({
  messageId: id,
  chatRoomId: d.chatRoomId,
  senderId: d.senderId,
  receiverId: d.receiverId,
  message: d.message,
  messageType: d.messageType ?? "text",
  createdAt: toMillis(d.createdAt),
  isRead: !!d.isRead,
});
const shapeNotification = (id, d) => ({
  notificationId: id,
  userId: d.userId,
  title: d.title,
  body: d.body,
  type: d.type,
  isRead: !!d.isRead,
  createdAt: toMillis(d.createdAt),
  avatarUrl: d.avatarUrl,
  chatRoomId: d.chatRoomId,
});
const shapeReport = (id, d) => ({
  reportId: id,
  reporterId: d.reporterId,
  reportedUserId: d.reportedUserId,
  reason: d.reason,
  createdAt: toMillis(d.createdAt),
});
const shapeCall = (id, d) => ({
  callId: id,
  callerId: d.callerId,
  calleeId: d.calleeId,
  participants: d.participants ?? [],
  type: d.type,
  status: d.status,
  createdAt: toMillis(d.createdAt),
});

/* ------------------------------------------------------------------ */
/* Public subscriptions                                                */
/* ------------------------------------------------------------------ */

export const subscribeUsers = (cb) =>
  isFirebaseEnabled
    ? fbSubscribeCollection(Collections.users, shapeUser, cb)
    : mockSubscribe("users", cb);

export const subscribeMatchRequests = (cb) =>
  isFirebaseEnabled
    ? fbSubscribeCollection(Collections.matchRequests, shapeRequest, cb)
    : mockSubscribe("match_requests", cb);

export const subscribePhotoRequests = (cb) =>
  isFirebaseEnabled
    ? fbSubscribeCollection(Collections.photoRequests, shapeRequest, cb)
    : mockSubscribe("photo_requests", cb);

export const subscribeChatRooms = (cb) =>
  isFirebaseEnabled
    ? fbSubscribeCollection(Collections.chatRooms, shapeRoom, cb)
    : mockSubscribe("chat_rooms", cb);

export const subscribeMessages = (cb) =>
  isFirebaseEnabled
    ? fbSubscribeCollection(Collections.messages, shapeMessage, cb)
    : mockSubscribe("messages", cb);

export const subscribeNotifications = (cb) =>
  isFirebaseEnabled
    ? fbSubscribeCollection(Collections.notifications, shapeNotification, cb)
    : mockSubscribe("notifications", cb);

export const subscribeReports = (cb) =>
  isFirebaseEnabled
    ? fbSubscribeCollection(Collections.reports, shapeReport, cb)
    : mockSubscribe("reports", cb);

export const subscribeCalls = (cb) =>
  isFirebaseEnabled
    ? fbSubscribeCollection(Collections.calls, shapeCall, cb)
    : mockSubscribe("calls", cb);

/**
 * App download overrides admins can edit from Settings. Any field left blank
 * falls back to the compiled-in values in constants.js (the `APK` object), so
 * an empty/absent config never breaks the /download page.
 */
function readApkConfig(data = {}) {
  const apk = data.apk || {};
  return {
    universal: apk.universal || "",
    modern: apk.modern || "",
    version: apk.version || "",
    size: apk.size || "",
  };
}

export function subscribeAppConfig(cb) {
  if (!isFirebaseEnabled) {
    cb({ ...store.config, apk: readApkConfig(store.config) });
    return () => {};
  }
  let unsub = () => {};
  loadFb().then(({ doc, onSnapshot }) => {
    unsub = onSnapshot(
      doc(db, "_meta", "config"),
      (d) => {
        const data = d.data() || {};
        cb({ notificationsEnabled: data.notificationsEnabled !== false, apk: readApkConfig(data) });
      },
      () => cb({ notificationsEnabled: true, apk: readApkConfig() })
    );
  });
  return () => unsub();
}

/* ------------------------------------------------------------------ */
/* Mutations                                                           */
/* ------------------------------------------------------------------ */

/** Recursively drop undefined — Firestore rejects it. */
function stripUndefined(value) {
  if (Array.isArray(value)) return value.map(stripUndefined);
  if (value && typeof value === "object" && !(value instanceof Date)) {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (v !== undefined) out[k] = stripUndefined(v);
    }
    return out;
  }
  return value;
}

export async function adminUpdateUser(userId, partial) {
  if (isFirebaseEnabled) {
    const { doc, setDoc } = await loadFb();
    await setDoc(doc(db, Collections.users, userId), stripUndefined(partial), {
      merge: true,
    });
    return;
  }
  store.users = store.users.map((u) =>
    u.userId === userId ? deepMerge(u, partial) : u
  );
  emit("users");
}

export async function adminCreateUser(input) {
  const base = blankProfile(input);
  if (isFirebaseEnabled) {
    const { collection, addDoc, serverTimestamp } = await loadFb();
    const ref = await addDoc(
      collection(db, Collections.users),
      stripUndefined({ ...base, createdAt: serverTimestamp() })
    );
    return ref.id;
  }
  const id = uid();
  store.users = [{ ...base, userId: id, createdAt: Date.now() }, ...store.users];
  emit("users");
  return id;
}

export async function adminDeleteUser(userId) {
  if (isFirebaseEnabled) {
    const { doc, deleteDoc } = await loadFb();
    await deleteDoc(doc(db, Collections.users, userId));
    return;
  }
  store.users = store.users.filter((u) => u.userId !== userId);
  emit("users");
}

export async function bulkDeleteUsers(ids) {
  await Promise.all(ids.map((id) => adminDeleteUser(id).catch(() => {})));
}

export const suspendUser = (userId) => adminUpdateUser(userId, { suspended: true });
export const unsuspendUser = (userId) => adminUpdateUser(userId, { suspended: false });
export const verifyUser = (userId) => adminUpdateUser(userId, { verified: true, suspended: false });
export const setPremium = (userId, premium) => adminUpdateUser(userId, { premium });

export async function deleteReport(reportId) {
  if (isFirebaseEnabled) {
    const { doc, deleteDoc } = await loadFb();
    await deleteDoc(doc(db, Collections.reports, reportId));
    return;
  }
  store.reports = store.reports.filter((r) => r.reportId !== reportId);
  emit("reports");
}

export async function setRequestStatus(collection_, requestId, status) {
  if (isFirebaseEnabled) {
    const { doc, updateDoc } = await loadFb();
    await updateDoc(doc(db, collection_, requestId), { status });
    return;
  }
  const key = collection_ === Collections.photoRequests ? "photo_requests" : "match_requests";
  store[key] = store[key].map((r) =>
    r.requestId === requestId ? { ...r, status } : r
  );
  emit(key);
}

export async function setNotificationsEnabled(enabled) {
  if (isFirebaseEnabled) {
    const { doc, setDoc } = await loadFb();
    await setDoc(doc(db, "_meta", "config"), { notificationsEnabled: enabled }, { merge: true });
    return;
  }
  store.config.notificationsEnabled = enabled;
}

/**
 * Save admin-editable APK download settings to _meta/config.apk.
 * `patch` may contain any of: universal, modern, version, size.
 * Blank strings are stored as "" and treated as "use the code default".
 */
export async function setAppDownloadConfig(patch) {
  const apk = {
    universal: patch.universal ?? "",
    modern: patch.modern ?? "",
    version: patch.version ?? "",
    size: patch.size ?? "",
  };
  if (isFirebaseEnabled) {
    const { doc, setDoc } = await loadFb();
    await setDoc(doc(db, "_meta", "config"), { apk }, { merge: true });
    return;
  }
  store.config.apk = apk;
}

export async function adminSendNotification(userIds, title, body) {
  const ids = userIds.filter(Boolean);
  if (!ids.length) return;
  if (isFirebaseEnabled) {
    const { collection, writeBatch, doc, serverTimestamp } = await loadFb();
    for (let i = 0; i < ids.length; i += 400) {
      const batch = writeBatch(db);
      ids.slice(i, i + 400).forEach((userId) => {
        batch.set(
          doc(collection(db, Collections.notifications)),
          stripUndefined({
            userId,
            title,
            body,
            type: "system",
            isRead: false,
            createdAt: serverTimestamp(),
          })
        );
      });
      await batch.commit();
    }
    return;
  }
  const items = ids.map((userId) => ({
    notificationId: uid(),
    userId,
    title,
    body,
    type: "system",
    isRead: false,
    createdAt: Date.now(),
  }));
  store.notifications = [...items, ...store.notifications];
  emit("notifications");
}

export async function clearCollection(name) {
  if (isFirebaseEnabled) {
    const { collection, getDocs, writeBatch, query, limit } = await loadFb();
    let total = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const snap = await getDocs(query(collection(db, name), limit(300)));
      if (snap.empty) break;
      const batch = writeBatch(db);
      snap.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
      total += snap.size;
      if (snap.size < 300) break;
    }
    return total;
  }
  const key = name in store ? name : null;
  const n = key ? store[key].length : 0;
  if (key) {
    store[key] = [];
    emit(key);
  }
  return n;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function deepMerge(base, patch) {
  const out = { ...base };
  for (const [k, v] of Object.entries(patch)) {
    if (v && typeof v === "object" && !Array.isArray(v) && base[k] && typeof base[k] === "object") {
      out[k] = deepMerge(base[k], v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

/** A fresh, admin-created (already-approved) profile. */
export function blankProfile(input = {}) {
  return {
    email: input.email ?? "",
    phone: input.phone ?? "",
    verified: true,
    profileCompleted: true,
    premium: false,
    online: false,
    suspended: false,
    photos: [],
    personalInfo: {
      fullName: input.fullName ?? "",
      gender: input.gender ?? "Female",
      age: input.age ?? 0,
      dob: "",
      height: "",
      weight: "",
      maritalStatus: "Single",
      city: input.city ?? "",
      photoUrl: "",
      bio: "",
    },
    educationInfo: { education: "", occupation: input.occupation ?? "", company: "", annualIncome: "", workLocation: "" },
    familyInfo: { fatherName: "", motherName: "", familyType: "Nuclear", siblings: 0, religion: "", caste: "" },
    lifestyleInfo: { smoking: "No", drinking: "No", diet: "Vegetarian", hobbies: [], languages: [] },
    partnerPreferences: { ageRange: [24, 32], preferredLocation: "", education: "", religion: "Any", maritalStatus: "Any" },
    createdAt: Date.now(),
  };
}

export { isFirebaseEnabled };
