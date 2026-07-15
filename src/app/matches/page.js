"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Heart, Lock, ArrowRight, Check, X, RotateCcw } from "lucide-react";
import { useMatchRequests, usePhotoRequests, useUsers } from "@/hooks/useCollection";
import * as data from "@/lib/data/service";
import { Collections } from "@/lib/constants";
import { useFeedback } from "@/components/ui/Feedback";
import { buildUserMap, nameOf, photoOf, computeMatches } from "@/lib/selectors";
import { timeAgo } from "@/lib/format";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";

const statusTone = { Pending: "amber", Accepted: "green", Rejected: "red", Cancelled: "gray" };

export default function MatchesPage() {
  const { data: matchReqs, loading } = useMatchRequests();
  const { data: photoReqs } = usePhotoRequests();
  const { data: users } = useUsers();
  const { toast } = useFeedback();
  const [tab, setTab] = useState("match");
  const [filter, setFilter] = useState("All");
  const userMap = useMemo(() => buildUserMap(users), [users]);

  const matches = useMemo(() => computeMatches(matchReqs), [matchReqs]);
  const pending = matchReqs.filter((r) => r.status === "Pending").length;

  const rows = (tab === "match" ? matchReqs : photoReqs)
    .filter((r) => filter === "All" || r.status === filter)
    .sort((a, b) => b.createdAt - a.createdAt);

  const setStatus = async (r, status) => {
    const col = tab === "match" ? Collections.matchRequests : Collections.photoRequests;
    await data.setRequestStatus(col, r.requestId, status);
    toast(`Request marked ${status.toLowerCase()}.`, status === "Rejected" ? "info" : "success");
  };

  return (
    <div>
      <PageHeader title="Matches & Requests" subtitle="Track every connection and photo-unlock request." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Heart} label="Total Matches" value={matches.length} tone="rose" />
        <StatCard icon={ArrowRight} label="Match Requests" value={matchReqs.length} tone="violet" />
        <StatCard icon={Lock} label="Photo Requests" value={photoReqs.length} tone="sky" />
        <StatCard icon={RotateCcw} label="Pending" value={pending} tone="amber" />
      </div>

      {/* Tabs + filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-1 bg-white border border-[var(--border)] rounded-xl p-1">
          {[["match", "Match Requests"], ["photo", "Photo Requests"]].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`px-4 h-9 rounded-lg text-sm font-bold transition cursor-pointer ${
                tab === k ? "grad-heart text-white" : "text-plum-soft hover:bg-brand-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-white border border-[var(--border)] rounded-xl p-1 sm:ml-auto overflow-x-auto">
          {["All", "Pending", "Accepted", "Rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 h-8 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                filter === s ? "bg-plum text-white" : "text-plum-soft hover:bg-black/5"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
        ) : rows.length === 0 ? (
          <EmptyState icon={tab === "match" ? Heart : Lock} title="Nothing here yet" subtitle="No requests match this filter." />
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {rows.map((r) => (
              <div key={r.requestId} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 hover:bg-brand-50/40 transition">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <PersonChip map={userMap} id={r.senderId} />
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${tab === "match" ? "bg-brand-50 text-brand-500" : "bg-violet-50 text-violet-500"}`}>
                    {tab === "match" ? <Heart size={13} fill="currentColor" /> : <Lock size={13} />}
                  </div>
                  <PersonChip map={userMap} id={r.receiverId} />
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={statusTone[r.status] || "gray"} dot>{r.status}</Badge>
                  <span className="text-xs text-muted w-16">{timeAgo(r.createdAt)}</span>
                  {r.status === "Pending" ? (
                    <div className="flex items-center gap-1.5">
                      <Button variant="danger" size="sm" onClick={() => setStatus(r, "Rejected")}><X size={14} /></Button>
                      <Button size="sm" onClick={() => setStatus(r, "Accepted")}><Check size={14} /> Accept</Button>
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => setStatus(r, "Pending")}><RotateCcw size={14} /> Reset</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PersonChip({ map, id }) {
  return (
    <Link href={`/users/${id}`} className="flex items-center gap-2 min-w-0 hover:opacity-80">
      <Avatar src={photoOf(map, id)} name={nameOf(map, id)} size={34} />
      <span className="text-sm font-bold text-plum truncate">{nameOf(map, id)}</span>
    </Link>
  );
}
