"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Crown,
  BadgeCheck,
  Check,
  X,
  Ban,
  RotateCcw,
  Eye,
  Search,
  UserCircle2,
  Percent,
  GripVertical,
  MoveRight,
} from "lucide-react";
import { useUsers } from "@/hooks/useCollection";
import * as data from "@/lib/data/service";
import { useFeedback } from "@/components/ui/Feedback";
import { STAGES, groupByStage, stageOf } from "@/lib/selectors";
import { timeAgo } from "@/lib/format";
import PageHeader from "@/components/ui/PageHeader";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

const columnAccent = {
  amber: { bar: "bg-amber-400", dot: "bg-amber-400", soft: "bg-amber-50", text: "text-amber-600", ring: "ring-amber-300", tint: "bg-amber-50/60", drop: "border-amber-300 text-amber-600 bg-amber-50" },
  sky: { bar: "bg-sky-400", dot: "bg-sky-400", soft: "bg-sky-50", text: "text-sky-600", ring: "ring-sky-300", tint: "bg-sky-50/60", drop: "border-sky-300 text-sky-600 bg-sky-50" },
  green: { bar: "bg-emerald-400", dot: "bg-emerald-400", soft: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-300", tint: "bg-emerald-50/60", drop: "border-emerald-300 text-emerald-600 bg-emerald-50" },
  red: { bar: "bg-red-400", dot: "bg-red-400", soft: "bg-red-50", text: "text-red-600", ring: "ring-red-300", tint: "bg-red-50/60", drop: "border-red-300 text-red-600 bg-red-50" },
};

/** Field patch applied when a member is moved into each stage. */
const STAGE_UPDATE = {
  incomplete: { profileCompleted: false, suspended: false },
  pending: { profileCompleted: true, verified: false, suspended: false },
  verified: { profileCompleted: true, verified: true, suspended: false },
  suspended: { suspended: true },
};

export default function StagingPage() {
  const { data: users, loading } = useUsers();
  const { toast, ask } = useFeedback();
  const [q, setQ] = useState("");
  const [drag, setDrag] = useState(null); // { user, from }
  const [overStage, setOverStage] = useState(null);

  const filteredUsers = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return users;
    return users.filter((u) =>
      `${u.personalInfo?.fullName} ${u.personalInfo?.city} ${u.email} ${u.educationInfo?.occupation}`
        .toLowerCase()
        .includes(term)
    );
  }, [users, q]);

  const groups = useMemo(() => groupByStage(filteredUsers), [filteredUsers]);

  const total = users.length || 1;
  const funnel = useMemo(() => {
    const completed = users.filter((u) => u.profileCompleted).length;
    const verified = users.filter((u) => u.verified && !u.suspended).length;
    const premium = users.filter((u) => u.premium).length;
    return [
      { label: "Signed up", value: users.length, color: "#ff6fa5" },
      { label: "Profile completed", value: completed, color: "#ff4d8d" },
      { label: "Verified & live", value: verified, color: "#9a6bf5" },
      { label: "Premium", value: premium, color: "#f7b733" },
    ];
  }, [users]);

  /* Button actions */
  const verify = async (u) => { await data.verifyUser(u.userId); toast(`${u.personalInfo?.fullName} verified & live.`); };
  const reject = async (u) => { await data.suspendUser(u.userId); toast(`${u.personalInfo?.fullName} moved to Suspended.`, "info"); };
  const reinstate = async (u) => { await data.unsuspendUser(u.userId); toast(`${u.personalInfo?.fullName} reinstated.`); };
  const suspend = async (u) => {
    const ok = await ask({ title: "Suspend member?", body: `${u.personalInfo?.fullName} will be hidden from Discover.`, confirmText: "Suspend", danger: true });
    if (ok) { await data.suspendUser(u.userId); toast(`${u.personalInfo?.fullName} suspended.`); }
  };
  const grantPremium = async (u) => { await data.setPremium(u.userId, !u.premium); toast(u.premium ? "Premium removed." : "Premium granted."); };

  /* Drag & drop → apply stage transition */
  const moveToStage = async (u, toKey) => {
    const from = stageOf(u);
    if (from === toKey) return;
    const label = STAGES.find((s) => s.key === toKey)?.label || toKey;
    await data.adminUpdateUser(u.userId, STAGE_UPDATE[toKey]);
    toast(`${u.personalInfo?.fullName} → ${label}.`, toKey === "suspended" ? "info" : "success");
  };

  const onDrop = (toKey) => {
    if (drag && drag.from !== toKey) moveToStage(drag.user, toKey);
    setDrag(null);
    setOverStage(null);
  };

  const actionsFor = (stage, u) => {
    switch (stage) {
      case "incomplete":
        return [{ label: "View", icon: Eye, href: `/users/${u.userId}`, variant: "ghost" }];
      case "pending":
        return [
          { label: "Reject", icon: X, onClick: () => reject(u), variant: "danger" },
          { label: "Approve", icon: Check, onClick: () => verify(u), variant: "primary" },
        ];
      case "verified":
        return [
          { label: u.premium ? "Un-premium" : "Premium", icon: Crown, onClick: () => grantPremium(u), variant: "ghost" },
          { label: "Suspend", icon: Ban, onClick: () => suspend(u), variant: "danger" },
        ];
      case "suspended":
        return [{ label: "Reinstate", icon: RotateCcw, onClick: () => reinstate(u), variant: "primary" }];
      default:
        return [];
    }
  };

  return (
    <div>
      <PageHeader
        title="Profile Staging"
        subtitle="Drag members between stages, or use the quick actions on each card."
      />

      {/* Conversion funnel */}
      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-plum flex items-center accent-bar">Conversion Funnel</h3>
          <Badge tone="rose"><Percent size={12} /> of {users.length} members</Badge>
        </div>
        <div className="space-y-3">
          {funnel.map((f) => {
            const pct = Math.round((f.value / total) * 100);
            return (
              <div key={f.label} className="flex items-center gap-3">
                <div className="w-36 text-xs font-bold text-ink-soft shrink-0 hidden sm:block">{f.label}</div>
                <div className="flex-1 h-8 rounded-lg bg-[var(--bg)] overflow-hidden relative">
                  <div
                    className="h-full rounded-lg flex items-center px-3 transition-all duration-700"
                    style={{ width: `${Math.max(pct, 8)}%`, background: f.color }}
                  >
                    <span className="text-xs font-extrabold text-white whitespace-nowrap">{f.value}</span>
                  </div>
                </div>
                <div className="w-12 text-right text-sm font-extrabold text-plum shrink-0">{pct}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search + hint */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-2.5 bg-white border border-[var(--border)] rounded-xl h-10 px-3.5 focus-within:ring-2 focus-within:ring-brand-200 w-full sm:w-80">
          <Search size={17} className="text-muted shrink-0" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search members…" className="flex-1 bg-transparent outline-none text-sm text-plum placeholder:text-muted min-w-0" />
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-muted sm:ml-auto">
          <GripVertical size={14} /> Drag a card
          <MoveRight size={13} className="text-brand-400" /> drop on another stage to update its status
        </div>
      </div>

      {/* Kanban board */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {STAGES.map((s) => <Skeleton key={s.key} className="h-96 w-full" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {STAGES.map((stage) => {
            const list = groups[stage.key] || [];
            const accent = columnAccent[stage.tone];
            const isValidTarget = drag && drag.from !== stage.key;
            const isOver = overStage === stage.key && isValidTarget;
            return (
              <div
                key={stage.key}
                onDragOver={(e) => {
                  if (!isValidTarget) return;
                  e.preventDefault();
                  if (overStage !== stage.key) setOverStage(stage.key);
                }}
                onDragLeave={(e) => {
                  // Only clear when leaving the column entirely.
                  if (!e.currentTarget.contains(e.relatedTarget)) setOverStage((s) => (s === stage.key ? null : s));
                }}
                onDrop={() => onDrop(stage.key)}
                className={cn(
                  "card overflow-hidden flex flex-col max-h-[calc(100vh-160px)] transition-all duration-200",
                  isOver && cn("ring-2 ring-offset-2 ring-offset-[var(--bg)]", accent.ring),
                  isValidTarget && !isOver && "opacity-95"
                )}
              >
                <div className={cn("h-1", accent.bar)} />
                <div className="p-4 border-b border-[var(--border)] flex items-center gap-2.5">
                  <span className={cn("h-2.5 w-2.5 rounded-full", accent.dot)} />
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-plum text-sm truncate">{stage.label}</div>
                    <div className="text-[11px] text-muted">{stage.hint}</div>
                  </div>
                  <span className={cn("h-7 min-w-7 px-2 rounded-full text-xs font-extrabold flex items-center justify-center", accent.soft, accent.text)}>
                    {list.length}
                  </span>
                </div>

                <div className={cn("p-3 space-y-2.5 overflow-y-auto flex-1 transition-colors", isOver && accent.tint)}>
                  {/* Drop hint */}
                  {isOver && (
                    <div className={cn("rounded-xl border-2 border-dashed p-3 text-center text-xs font-bold animate-fade-up", accent.drop)}>
                      Drop to mark as “{stage.label}”
                    </div>
                  )}

                  {list.length === 0 && !isOver ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <UserCircle2 size={26} className="text-[var(--border)] mb-2" />
                      <p className="text-xs font-semibold text-muted">No members here</p>
                    </div>
                  ) : (
                    list.map((u) => {
                      const dragging = drag?.user?.userId === u.userId;
                      return (
                        <div
                          key={u.userId}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.effectAllowed = "move";
                            setDrag({ user: u, from: stage.key });
                          }}
                          onDragEnd={() => { setDrag(null); setOverStage(null); }}
                          className={cn(
                            "group hover-lift rounded-xl border border-[var(--border)] bg-white p-3 cursor-grab active:cursor-grabbing select-none",
                            dragging && "opacity-40 scale-[0.97] rotate-1"
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <GripVertical size={15} className="text-[var(--border)] group-hover:text-muted shrink-0 transition-colors" />
                            <Link href={`/users/${u.userId}`} draggable={false} className="flex items-center gap-2.5 min-w-0 flex-1">
                              <Avatar src={u.personalInfo?.photoUrl} name={u.personalInfo?.fullName} size={38} />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1">
                                  <span className="text-[13px] font-bold text-plum truncate">
                                    {u.personalInfo?.fullName || "Unnamed"}
                                  </span>
                                  {u.verified && <BadgeCheck size={12} className="text-sky-500 shrink-0" />}
                                  {u.premium && <Crown size={11} className="text-amber-400 shrink-0" />}
                                </div>
                                <div className="text-[11px] text-muted truncate">
                                  {u.educationInfo?.occupation || u.personalInfo?.gender || "—"} · {u.personalInfo?.city || "—"}
                                </div>
                              </div>
                            </Link>
                          </div>
                          <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-[var(--border)]">
                            <span className="text-[10px] text-muted flex-1">{timeAgo(u.createdAt)}</span>
                            {actionsFor(stage.key, u).map((a) =>
                              a.href ? (
                                <Button key={a.label} as={Link} href={a.href} draggable={false} size="sm" variant={a.variant} className="!h-7 !px-2.5 !text-[11px]">
                                  <a.icon size={13} /> {a.label}
                                </Button>
                              ) : (
                                <Button key={a.label} size="sm" variant={a.variant} onClick={a.onClick} className="!h-7 !px-2.5 !text-[11px]">
                                  <a.icon size={13} /> {a.label}
                                </Button>
                              )
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
