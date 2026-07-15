"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ShieldCheck, X, Check, Crown, Eye } from "lucide-react";
import { useUsers } from "@/hooks/useCollection";
import * as data from "@/lib/data/service";
import { useFeedback } from "@/components/ui/Feedback";
import { timeAgo } from "@/lib/format";
import PageHeader from "@/components/ui/PageHeader";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";

export default function ApprovalsPage() {
  const { data: users, loading } = useUsers();
  const { toast } = useFeedback();
  const [handled, setHandled] = useState([]);

  const pending = useMemo(
    () =>
      users
        .filter((u) => u.profileCompleted && !u.verified && !handled.includes(u.userId))
        .sort((a, b) => b.createdAt - a.createdAt),
    [users, handled]
  );

  const approve = async (u) => {
    await data.verifyUser(u.userId);
    setHandled((h) => [...h, u.userId]);
    toast(`${u.personalInfo?.fullName} approved & verified.`);
  };
  const reject = async (u) => {
    await data.suspendUser(u.userId);
    setHandled((h) => [...h, u.userId]);
    toast(`${u.personalInfo?.fullName} rejected & hidden.`, "info");
  };

  return (
    <div>
      <PageHeader
        title="Approvals"
        subtitle="Review and verify newly completed profiles before they appear in Discover."
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
        </div>
      ) : pending.length === 0 ? (
        <div className="card">
          <EmptyState icon={ShieldCheck} title="All caught up 🎉" subtitle="No profiles are waiting for approval right now." />
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-4">
            <Badge tone="amber" dot>{pending.length} pending review</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {pending.map((u) => (
              <div key={u.userId} className="card hover-lift p-5 animate-fade-up">
                <div className="flex items-center gap-3">
                  <Avatar src={u.personalInfo?.photoUrl} name={u.personalInfo?.fullName} size={52} ring />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-plum truncate">{u.personalInfo?.fullName}</span>
                      {u.premium && <Crown size={13} className="text-amber-400" />}
                    </div>
                    <div className="text-xs text-muted truncate">
                      {u.personalInfo?.age ? `${u.personalInfo.age} yrs · ` : ""}
                      {u.personalInfo?.gender} · {u.personalInfo?.city || "—"}
                    </div>
                  </div>
                  <Badge tone="amber">Pending</Badge>
                </div>

                <div className="mt-3 text-xs text-ink-soft space-y-1">
                  <p className="truncate"><span className="text-muted font-semibold">Work:</span> {u.educationInfo?.occupation || "—"} @ {u.educationInfo?.company || "—"}</p>
                  <p className="truncate"><span className="text-muted font-semibold">Education:</span> {u.educationInfo?.education || "—"}</p>
                  <p className="text-muted">Submitted {timeAgo(u.createdAt)}</p>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <Button as={Link} href={`/users/${u.userId}`} variant="ghost" size="sm">
                    <Eye size={15} /> View
                  </Button>
                  <div className="flex-1" />
                  <Button variant="danger" size="sm" onClick={() => reject(u)}><X size={15} /> Reject</Button>
                  <Button size="sm" onClick={() => approve(u)}><Check size={15} /> Approve</Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
