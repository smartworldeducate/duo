"use client";
import { useEffect, useState } from "react";
import {
  Bell,
  Trash2,
  Database,
  ShieldAlert,
  Flag,
  MessageSquare,
  MessagesSquare,
  Heart,
  Lock,
  Phone,
  Loader2,
  Server,
  Smartphone,
  Save,
} from "lucide-react";
import * as data from "@/lib/data/service";
import { isFirebaseEnabled } from "@/lib/firebase/client";
import { DATA_COLLECTIONS, BRAND, APK } from "@/lib/constants";
import { useFeedback } from "@/components/ui/Feedback";
import PageHeader from "@/components/ui/PageHeader";
import Toggle from "@/components/ui/Toggle";
import Button from "@/components/ui/Button";

const iconFor = {
  notifications: Bell,
  reports: Flag,
  messages: MessageSquare,
  chat_rooms: MessagesSquare,
  match_requests: Heart,
  photo_requests: Lock,
  calls: Phone,
};
const toneBg = {
  rose: "grad-heart",
  red: "bg-gradient-to-br from-red-400 to-rose-500",
  violet: "grad-lav",
  sky: "bg-gradient-to-br from-sky-400 to-blue-500",
  pink: "bg-gradient-to-br from-pink-400 to-brand-500",
  purple: "bg-gradient-to-br from-violet-400 to-purple-600",
  green: "bg-gradient-to-br from-emerald-400 to-teal-500",
};

export default function SettingsPage() {
  const { toast, ask } = useFeedback();
  const [notifOn, setNotifOn] = useState(true);
  const [clearing, setClearing] = useState(null);
  const [apk, setApk] = useState({ universal: "", modern: "", version: "", size: "" });
  const [savingApk, setSavingApk] = useState(false);

  useEffect(() => {
    const unsub = data.subscribeAppConfig((cfg) => {
      setNotifOn(cfg.notificationsEnabled);
      if (cfg.apk) setApk(cfg.apk);
    });
    return () => unsub && unsub();
  }, []);

  const saveApk = async () => {
    setSavingApk(true);
    try {
      await data.setAppDownloadConfig(apk);
      toast("Download links updated. The public download page now uses these.");
    } catch (e) {
      toast(e?.message || "Could not save download links.", "error");
    } finally {
      setSavingApk(false);
    }
  };

  const toggleNotif = async (val) => {
    setNotifOn(val);
    await data.setNotificationsEnabled(val);
    toast(val ? "Push notifications enabled for all users." : "Push notifications muted for all users.", "info");
  };

  const clear = async (col) => {
    const ok = await ask({
      title: `Clear all ${col.label.toLowerCase()}?`,
      body: `This permanently deletes every document in the "${col.name}" collection. This cannot be undone.`,
      confirmText: "Clear collection",
      danger: true,
    });
    if (!ok) return;
    setClearing(col.name);
    try {
      const n = await data.clearCollection(col.name);
      toast(`Removed ${n} ${col.label.toLowerCase()}.`);
    } catch (e) {
      toast(e?.message || "Could not clear collection.", "error");
    } finally {
      setClearing(null);
    }
  };

  return (
    <div className="max-w-3xl">
      <PageHeader title="Settings" subtitle="App-wide controls and data management." />

      {/* Push notifications */}
      <div className="card p-5 mb-6">
        <h3 className="font-extrabold text-plum mb-4 flex items-center gap-2">
          <Bell size={17} className="text-brand-500" /> Push Notifications
        </h3>
        <div className="flex items-center gap-4">
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-white shrink-0 ${notifOn ? "grad-heart" : "bg-gray-300"}`}>
            <Bell size={22} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-plum">App notifications</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${notifOn ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
                {notifOn ? "Active" : "Muted"}
              </span>
            </div>
            <p className="text-sm text-muted mt-0.5">
              {notifOn ? "Every member receives push & in-app alerts." : "Notifications are muted for all members."}
            </p>
          </div>
          <Toggle checked={notifOn} onChange={toggleNotif} />
        </div>
      </div>

      {/* App download links */}
      <div className="card p-5 mb-6">
        <h3 className="font-extrabold text-plum mb-1 flex items-center gap-2">
          <Smartphone size={17} className="text-brand-500" /> App Download Links
        </h3>
        <p className="text-sm text-muted mb-4">
          Paste the APK download URLs shown on the public <span className="font-semibold">/download</span> page. Leave a field blank to use the built-in default.
        </p>

        <div className="space-y-3">
          <ApkField
            label="All devices (universal) URL"
            placeholder={APK.universal}
            value={apk.universal}
            onChange={(v) => setApk((a) => ({ ...a, universal: v }))}
          />
          <ApkField
            label="Latest devices (modern) URL"
            placeholder={APK.modern}
            value={apk.modern}
            onChange={(v) => setApk((a) => ({ ...a, modern: v }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <ApkField
              label="Version"
              placeholder={APK.version}
              value={apk.version}
              onChange={(v) => setApk((a) => ({ ...a, version: v }))}
            />
            <ApkField
              label="Size"
              placeholder={APK.size}
              value={apk.size}
              onChange={(v) => setApk((a) => ({ ...a, size: v }))}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={saveApk} disabled={savingApk}>
            {savingApk ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save links
          </Button>
        </div>
      </div>

      {/* Data management */}
      <div className="card p-5 mb-6">
        <h3 className="font-extrabold text-plum mb-1 flex items-center gap-2">
          <Database size={17} className="text-brand-500" /> Data Management
        </h3>
        <p className="text-sm text-muted mb-4">Permanently empty a data collection. Handy for resetting test data.</p>

        <div className="rounded-xl bg-red-50 border border-red-100 p-3 mb-4 flex items-start gap-2.5">
          <ShieldAlert size={17} className="text-red-500 mt-0.5 shrink-0" />
          <p className="text-xs text-red-600 font-medium">
            Clearing a collection deletes every document in it. This action is irreversible — proceed with care.
          </p>
        </div>

        <div className="space-y-2.5">
          {DATA_COLLECTIONS.map((col) => {
            const Icon = iconFor[col.name] || Database;
            return (
              <div key={col.name} className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0 ${toneBg[col.tone]}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-plum text-sm">{col.label}</div>
                  <div className="text-xs text-muted">{col.desc}</div>
                </div>
                <Button variant="danger" size="sm" onClick={() => clear(col)} disabled={clearing === col.name}>
                  {clearing === col.name ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  Clear
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Connection info */}
      <div className="card p-5">
        <h3 className="font-extrabold text-plum mb-4 flex items-center gap-2">
          <Server size={17} className="text-brand-500" /> Connection
        </h3>
        <dl className="text-sm divide-y divide-[var(--border)]">
          <Row label="Data source" value={isFirebaseEnabled ? "Firebase Firestore (live)" : "Built-in demo data"} tone={isFirebaseEnabled ? "green" : "amber"} />
          <Row label="Firebase project" value={process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "—"} />
          <Row label="App" value={`${BRAND} Admin Dashboard`} />
        </dl>
      </div>
    </div>
  );
}

function ApkField({ label, value, placeholder, onChange }) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-plum">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm text-plum outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      />
    </label>
  );
}

function Row({ label, value, tone }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-muted font-semibold">{label}</span>
      <span className={`font-bold ${tone === "green" ? "text-emerald-600" : tone === "amber" ? "text-amber-600" : "text-plum"}`}>
        {value}
      </span>
    </div>
  );
}
