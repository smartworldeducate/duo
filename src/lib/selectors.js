/** Pure helpers for deriving views from the raw collections. */
import { BRAND } from "./constants";

export const buildUserMap = (users = []) => {
  const m = new Map();
  users.forEach((u) => m.set(u.userId, u));
  return m;
};

export const profileOf = (map, id) => map.get(id);
export const nameOf = (map, id) => map.get(id)?.personalInfo?.fullName || "Unknown user";
export const photoOf = (map, id) => map.get(id)?.personalInfo?.photoUrl || map.get(id)?.photos?.[0];

/** Unique accepted pairs from match requests → the list of matches. */
export const computeMatches = (requests = []) => {
  const seen = new Set();
  const matches = [];
  requests
    .filter((r) => r.status === "Accepted")
    .forEach((r) => {
      const key = [r.senderId, r.receiverId].sort().join("__");
      if (seen.has(key)) return;
      seen.add(key);
      matches.push({ ...r, pairKey: key });
    });
  return matches;
};

/** Signups grouped by day for the last `days` days → [{label, count}]. */
export const signupsByDay = (users = [], days = 14) => {
  const buckets = [];
  const dayMs = 86_400_000;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = days - 1; i >= 0; i--) {
    const start = today.getTime() - i * dayMs;
    const label = new Date(start).toLocaleDateString(undefined, { month: "short", day: "numeric" });
    buckets.push({ start, end: start + dayMs, label, count: 0 });
  }
  users.forEach((u) => {
    const b = buckets.find((x) => u.createdAt >= x.start && u.createdAt < x.end);
    if (b) b.count += 1;
  });
  return buckets.map(({ label, count }) => ({ label, count }));
};

export const genderSplit = (users = []) => {
  let male = 0, female = 0;
  users.forEach((u) => {
    if (u.personalInfo?.gender === "Male") male += 1;
    else if (u.personalInfo?.gender === "Female") female += 1;
  });
  return { male, female };
};

/** Lifecycle stages a profile moves through. Order matters (funnel). */
export const STAGES = [
  { key: "incomplete", label: "Incomplete", tone: "amber", hint: "Setup not finished" },
  { key: "pending", label: "Pending Review", tone: "sky", hint: "Awaiting approval" },
  { key: "verified", label: "Verified & Live", tone: "green", hint: "Visible in Discover" },
  { key: "suspended", label: "Suspended", tone: "red", hint: "Hidden from Discover" },
];

/** Classify a user into a single lifecycle stage. */
export const stageOf = (u) => {
  if (u.suspended) return "suspended";
  if (!u.profileCompleted) return "incomplete";
  if (!u.verified) return "pending";
  return "verified";
};

/** Group users by stage → { incomplete: [], pending: [], ... }. */
export const groupByStage = (users = []) => {
  const groups = { incomplete: [], pending: [], verified: [], suspended: [] };
  users.forEach((u) => groups[stageOf(u)].push(u));
  Object.values(groups).forEach((arr) => arr.sort((a, b) => b.createdAt - a.createdAt));
  return groups;
};

/**
 * Build a chronological activity timeline for one member from the raw
 * collections. Returns [{ id, time, kind, tone, title, desc }], newest first.
 */
export const buildUserTimeline = (userId, user, { matchReqs = [], photoReqs = [], reports = [] }, map) => {
  const other = (r) => (r.senderId === userId ? r.receiverId : r.senderId);
  const name = (id) => nameOf(map, id);
  const events = [];

  // Match requests
  matchReqs
    .filter((r) => r.senderId === userId || r.receiverId === userId)
    .forEach((r) => {
      const sent = r.senderId === userId;
      const who = name(other(r));
      let title, tone, kind;
      if (r.status === "Accepted") {
        title = sent ? `Matched with ${who}` : `Accepted ${who}'s request — matched`;
        tone = "green";
        kind = "match";
      } else if (r.status === "Rejected") {
        title = sent ? `Request to ${who} was declined` : `Declined ${who}'s request`;
        tone = "red";
        kind = "reject";
      } else {
        title = sent ? `Sent a match request to ${who}` : `Received a match request from ${who}`;
        tone = "rose";
        kind = "request";
      }
      events.push({ id: `m_${r.requestId}`, time: r.createdAt, kind, tone, title, desc: sent ? "Outgoing" : "Incoming" });
    });

  // Photo requests
  photoReqs
    .filter((r) => r.senderId === userId || r.receiverId === userId)
    .forEach((r) => {
      const sent = r.senderId === userId;
      const who = name(other(r));
      const accepted = r.status === "Accepted";
      events.push({
        id: `p_${r.requestId}`,
        time: r.createdAt,
        kind: "photo",
        tone: accepted ? "violet" : "sky",
        title: accepted
          ? sent ? `${who} granted photo access` : `Granted photo access to ${who}`
          : sent ? `Requested photos from ${who}` : `${who} requested photo access`,
        desc: r.status,
      });
    });

  // Reports
  reports.forEach((r) => {
    if (r.reportedUserId === userId) {
      events.push({ id: `r_${r.reportId}`, time: r.createdAt, kind: "report", tone: "red", title: `Reported by a member`, desc: r.reason });
    } else if (r.reporterId === userId) {
      events.push({ id: `r_${r.reportId}`, time: r.createdAt, kind: "report-out", tone: "amber", title: `Reported ${name(r.reportedUserId)}`, desc: r.reason });
    }
  });

  // Lifecycle anchors
  if (user?.lastActive) {
    events.push({ id: "last_active", time: user.lastActive, kind: "active", tone: "green", title: "Last seen online", desc: user.online ? "Currently online" : "Recent session" });
  }
  events.push({ id: "joined", time: user?.createdAt || 0, kind: "join", tone: "rose", title: `Joined ${BRAND}`, desc: "Account created" });

  return events.sort((a, b) => b.time - a.time);
};

export const topCities = (users = [], n = 5) => {
  const counts = {};
  users.forEach((u) => {
    const c = u.personalInfo?.city;
    if (c) counts[c] = (counts[c] || 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([city, count]) => ({ city, count }));
};
