# Duo — Admin Dashboard

A professional web admin console for the **Duo** matchmaking app (Firebase
project `leveldo-43cdc`). Built with Next.js (App Router), Tailwind CSS v4, Redux
Toolkit, Recharts, and the Firebase Web SDK. It reads and writes the **same
Firestore collections** the mobile app uses, so everything you manage here is
reflected live in the app.

## What you can do

| Section | Capabilities |
|---|---|
| **Overview** | Live KPIs (members, online, matches, premium), signup trend chart, gender split, top cities, recent members & open reports |
| **Members** | Search / filter (status, gender), view full profiles, edit, verify, grant/remove premium, suspend/reinstate, delete, bulk delete, add member, send notification |
| **Member detail** | Complete profile (personal, education, family, lifestyle, preferences, photo gallery) + inline edit + all moderation actions |
| **Approvals** | Review newly completed profiles and approve (verify) or reject (hide) |
| **Reports** | Moderate user reports — dismiss or suspend the reported member |
| **Matches** | Track match & photo-unlock requests; accept / reject / reset status |
| **Conversations** | Read-only oversight of matched members' chat threads |
| **Notifications** | Broadcast to all members, per-member notifications, full delivery history |
| **Settings** | Global push-notification switch, data management (clear collections), connection info |

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 and sign in.

### Sign in

Admins sign in with their own **Firebase email + password** (typed at login and
sent straight to Firebase Auth — no shared password is stored in the code or the
deployed site). Access to data is then enforced by your Firestore security rules,
so only real admin accounts can read/write.

> The `/download` page is public and safe to share. Every other route (the admin
> dashboard) requires sign-in and is redirected to `/login` otherwise.

In live mode this signs the dashboard into your Firebase project so it can read
and write Firestore under your security rules.

## Configuration — `.env.local`

The Firebase Web config is pre-filled from your app's `google-services.json`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=…
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=leveldo-43cdc.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=leveldo-43cdc
…
NEXT_PUBLIC_DATA_SOURCE=firebase   # or "mock" to preview with built-in demo data
```

### Two data modes

- **`firebase`** (default) — live Firestore data from `leveldo-43cdc`.
- **`mock`** — the dashboard runs on the app's built-in demo profiles with no
  backend. Great for a design preview or offline demo.

### If live data is empty or sign-in fails

The bundled API key comes from the **Android** app entry. If it is app-restricted
in Google Cloud, browser requests can be blocked. To fix, in the Firebase console:

1. **Project settings → Your apps → Add app → Web** — copy the generated
   `appId` into `NEXT_PUBLIC_FIREBASE_APP_ID` (and confirm the other values).
2. Ensure **Authentication → Email/Password** is enabled and the admin account
   (`NEXT_PUBLIC_ADMIN_FB_EMAIL`) exists.
3. Confirm Firestore security rules allow that admin account to read the
   collections.

Until then you can always set `NEXT_PUBLIC_DATA_SOURCE=mock` to explore the UI.

## Architecture

```
src/
  app/                    # routes (overview, users, approvals, reports, matches,
                          #         messages, notifications, settings, login)
  components/
    layout/               # AppShell (auth guard), Sidebar, Topbar
    ui/                   # design system: Button, Avatar, Badge, Modal, Toggle,
                          #   StatCard, RowMenu, Feedback (toast + confirm), …
    NotifyModal.js        # shared notification composer
  hooks/useCollection.js  # React hooks over the data service (realtime)
  lib/
    firebase/client.js    # Firebase Web SDK bootstrap (guarded)
    data/service.js       # unified data layer — Firestore live OR in-memory mock
    data/mockData.js      # built-in demo data (ported from the mobile app)
    auth.js               # admin sign-in
    selectors.js          # derived views (matches, charts, lookups)
    constants.js          # brand name, collection names, admin creds
```

The data service exposes one API (`subscribeUsers`, `adminUpdateUser`,
`clearCollection`, …) and transparently targets Firestore or the mock store, so
every page is backend-agnostic.
