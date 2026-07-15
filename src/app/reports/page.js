"use client";
import { useMemo } from "react";
import Link from "next/link";
import { Flag, Ban, Check, Eye, ArrowRight } from "lucide-react";
import { useReports, useUsers } from "@/hooks/useCollection";
import * as data from "@/lib/data/service";
import { useFeedback } from "@/components/ui/Feedback";
import { buildUserMap, nameOf, photoOf } from "@/lib/selectors";
import { timeAgo } from "@/lib/format";
import PageHeader from "@/components/ui/PageHeader";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";

export default function ReportsPage() {
  const { data: reports, loading } = useReports();
  const { data: users } = useUsers();
  const { toast, ask } = useFeedback();
  const userMap = useMemo(() => buildUserMap(users), [users]);

  const sorted = useMemo(() => [...reports].sort((a, b) => b.createdAt - a.createdAt), [reports]);

  const dismiss = async (r) => {
    await data.deleteReport(r.reportId);
    toast("Report dismissed.", "info");
  };
  const ban = async (r) => {
    const ok = await ask({
      title: "Suspend & resolve?",
      body: `${nameOf(userMap, r.reportedUserId)} will be suspended and this report closed.`,
      confirmText: "Suspend user",
      danger: true,
    });
    if (!ok) return;
    await data.suspendUser(r.reportedUserId);
    await data.deleteReport(r.reportId);
    toast(`${nameOf(userMap, r.reportedUserId)} suspended.`);
  };

  return (
    <div>
      <PageHeader title="Reports" subtitle="User-submitted reports awaiting moderation." />

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
      ) : sorted.length === 0 ? (
        <div className="card"><EmptyState icon={Flag} title="No open reports 🎉" subtitle="Your community is looking healthy." /></div>
      ) : (
        <>
          <Badge tone="red" dot>{sorted.length} open</Badge>
          <div className="mt-4 space-y-3">
            {sorted.map((r) => (
              <div key={r.reportId} className="card p-4 sm:p-5 animate-fade-up">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                    <Flag size={18} />
                  </div>

                  {/* reporter → reported */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar src={photoOf(userMap, r.reporterId)} name={nameOf(userMap, r.reporterId)} size={32} />
                      <span className="text-sm font-semibold text-ink-soft truncate">{nameOf(userMap, r.reporterId)}</span>
                    </div>
                    <ArrowRight size={16} className="text-muted shrink-0" />
                    <Link href={`/users/${r.reportedUserId}`} className="flex items-center gap-2 min-w-0 hover:opacity-80">
                      <Avatar src={photoOf(userMap, r.reportedUserId)} name={nameOf(userMap, r.reportedUserId)} size={32} />
                      <span className="text-sm font-bold text-plum truncate">{nameOf(userMap, r.reportedUserId)}</span>
                    </Link>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge tone="amber">{r.reason}</Badge>
                    <span className="text-xs text-muted">{timeAgo(r.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-2 sm:ml-2">
                    <Button as={Link} href={`/users/${r.reportedUserId}`} variant="ghost" size="sm"><Eye size={15} /></Button>
                    <Button variant="secondary" size="sm" onClick={() => dismiss(r)}><Check size={15} /> Dismiss</Button>
                    <Button variant="danger" size="sm" onClick={() => ban(r)}><Ban size={15} /> Suspend</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
