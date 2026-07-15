"use client";
import { useMemo, useState } from "react";
import {
  Bell,
  Send,
  Megaphone,
  Heart,
  MessageCircle,
  Eye,
  Sparkles,
  Lock,
} from "lucide-react";
import { useNotifications, useUsers } from "@/hooks/useCollection";
import { buildUserMap, nameOf } from "@/lib/selectors";
import { timeAgo } from "@/lib/format";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import NotifyModal from "@/components/NotifyModal";

const typeMeta = {
  match_request: { icon: Heart, tone: "rose", label: "Match request" },
  request_accepted: { icon: Heart, tone: "green", label: "Match" },
  photo_request: { icon: Lock, tone: "violet", label: "Photo request" },
  photo_request_accepted: { icon: Lock, tone: "violet", label: "Photo unlocked" },
  new_message: { icon: MessageCircle, tone: "sky", label: "Message" },
  profile_view: { icon: Eye, tone: "amber", label: "Profile view" },
  system: { icon: Sparkles, tone: "gray", label: "System" },
};

export default function NotificationsPage() {
  const { data: notifications, loading } = useNotifications();
  const { data: users } = useUsers();
  const userMap = useMemo(() => buildUserMap(users), [users]);
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [filter, setFilter] = useState("All");

  const allIds = useMemo(() => users.map((u) => u.userId), [users]);
  const sorted = useMemo(() => [...notifications].sort((a, b) => b.createdAt - a.createdAt), [notifications]);
  const filtered = filter === "All" ? sorted : sorted.filter((n) => n.type === filter);

  const types = ["All", ...Object.keys(typeMeta)];

  return (
    <div>
      <PageHeader title="Notifications" subtitle="Broadcast announcements and review delivery history.">
        <Button onClick={() => setBroadcastOpen(true)}>
          <Megaphone size={17} /> Broadcast to all
        </Button>
      </PageHeader>

      {/* Broadcast banner */}
      <div className="card p-5 mb-6 grad-hero text-white flex items-center gap-4 overflow-hidden relative">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
        <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <Megaphone size={22} />
        </div>
        <div className="relative flex-1">
          <h3 className="font-extrabold text-lg">Reach every member instantly</h3>
          <p className="text-sm text-white/85 mt-0.5">
            Send an announcement to all {allIds.length} members' in-app inbox.
          </p>
        </div>
        <Button variant="dark" onClick={() => setBroadcastOpen(true)} className="bg-white/20 hover:bg-white/30 border-transparent relative">
          <Send size={16} /> Compose
        </Button>
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 h-8 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
              filter === t
                ? "grad-heart text-white border-transparent"
                : "bg-white text-plum-soft border-[var(--border)] hover:bg-brand-50"
            }`}
          >
            {t === "All" ? "All" : typeMeta[t]?.label || t}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications" subtitle="Delivered notifications will appear here." />
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {filtered.map((n) => {
              const meta = typeMeta[n.type] || typeMeta.system;
              const Icon = meta.icon;
              return (
                <div key={n.notificationId} className="flex items-center gap-3 p-4 hover:bg-brand-50/40 transition">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 bg-brand-50 text-brand-500`}>
                    {n.avatarUrl ? (
                      <Avatar src={n.avatarUrl} name={n.title} size={40} />
                    ) : (
                      <Icon size={18} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-plum truncate">{n.title}</span>
                      {!n.isRead && <span className="h-2 w-2 rounded-full grad-heart shrink-0" />}
                    </div>
                    <p className="text-xs text-muted truncate">{n.body}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge tone={meta.tone}>{meta.label}</Badge>
                    <span className="text-[11px] text-muted">to {nameOf(userMap, n.userId)} · {timeAgo(n.createdAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <NotifyModal open={broadcastOpen} onClose={() => setBroadcastOpen(false)} target="all" allIds={allIds} />
    </div>
  );
}
