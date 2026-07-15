"use client";
import { useMemo } from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  Heart,
  Flag,
  ShieldCheck,
  Crown,
  Radio,
  TrendingUp,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { useUsers, useMatchRequests, useReports } from "@/hooks/useCollection";
import {
  computeMatches,
  signupsByDay,
  genderSplit,
  topCities,
  buildUserMap,
  nameOf,
} from "@/lib/selectors";
import { compact, timeAgo } from "@/lib/format";
import StatCard from "@/components/ui/StatCard";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";

export default function OverviewPage() {
  const { data: users, loading } = useUsers();
  const { data: requests } = useMatchRequests();
  const { data: reports } = useReports();

  const stats = useMemo(() => {
    const matches = computeMatches(requests);
    const online = users.filter((u) => u.online).length;
    const premium = users.filter((u) => u.premium).length;
    const pendingApprovals = users.filter((u) => !u.verified && u.profileCompleted).length;
    // Real week-over-week signup trend.
    const wk = 7 * 86_400_000;
    const nowT = Date.now();
    const last7 = users.filter((u) => u.createdAt >= nowT - wk).length;
    const prev7 = users.filter((u) => u.createdAt >= nowT - 2 * wk && u.createdAt < nowT - wk).length;
    const trend = prev7 === 0 ? (last7 > 0 ? 100 : 0) : Math.round(((last7 - prev7) / prev7) * 100);
    return {
      total: users.length,
      online,
      premium,
      matches: matches.length,
      pendingApprovals,
      reports: reports.length,
      trend,
    };
  }, [users, requests, reports]);

  const chart = useMemo(() => signupsByDay(users, 14), [users]);
  const gender = useMemo(() => genderSplit(users), [users]);
  const cities = useMemo(() => topCities(users, 5), [users]);
  const userMap = useMemo(() => buildUserMap(users), [users]);

  const recentUsers = useMemo(
    () => [...users].sort((a, b) => b.createdAt - a.createdAt).slice(0, 6),
    [users]
  );
  const recentReports = useMemo(
    () => [...reports].sort((a, b) => b.createdAt - a.createdAt).slice(0, 4),
    [reports]
  );

  const genderData = [
    { name: "Female", value: gender.female, color: "#ff4d8d" },
    { name: "Male", value: gender.male, color: "#9a6bf5" },
  ];

  if (loading) return <OverviewSkeleton />;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="grad-hero rounded-2xl p-6 sm:p-7 text-white relative overflow-hidden">
        <div className="absolute -top-16 -right-10 h-56 w-56 rounded-full bg-white/10" />
        <div className="relative">
          <p className="text-white/80 text-sm font-semibold">Welcome back 👋</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
            Here's what's happening today
          </h1>
          <p className="text-white/85 text-sm mt-2 max-w-lg">
            {compact(stats.total)} members · {stats.online} online now · {stats.matches} matches
            made
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Members" value={compact(stats.total)} tone="rose" trend={stats.trend} delay={0} />
        <StatCard icon={Radio} label="Online Now" value={compact(stats.online)} tone="green" delay={60} />
        <StatCard icon={Heart} label="Matches Made" value={compact(stats.matches)} tone="violet" delay={120} />
        <StatCard icon={Crown} label="Premium Members" value={compact(stats.premium)} tone="amber" delay={180} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Signups area chart */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-plum">New Signups</h3>
              <p className="text-xs text-muted mt-0.5">Last 14 days</p>
            </div>
            <Badge tone="green">
              <TrendingUp size={13} /> Trending
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chart} margin={{ left: -20, right: 8, top: 4 }}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff4d8d" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#ff4d8d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e7f0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9b8aa8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9b8aa8" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #efe4ee",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              />
              <Area type="monotone" dataKey="count" name="Signups" stroke="#ff4d8d" strokeWidth={2.5} fill="url(#grad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Gender donut */}
        <div className="card p-5">
          <h3 className="font-extrabold text-plum">Gender Split</h3>
          <p className="text-xs text-muted mt-0.5 mb-2">Member distribution</p>
          <div className="relative">
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie
                  data={genderData}
                  dataKey="value"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={3}
                  stroke="none"
                >
                  {genderData.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #efe4ee", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-extrabold text-plum">{compact(stats.total)}</span>
              <span className="text-[11px] text-muted font-semibold">members</span>
            </div>
          </div>
          <div className="flex justify-center gap-5 mt-2">
            {genderData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                <span className="text-xs font-semibold text-ink-soft">
                  {d.name} · {d.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent members */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-plum">Recent Members</h3>
            <Link href="/users" className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1">
              View all <ArrowRight size={13} />
            </Link>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {recentUsers.map((u) => (
              <Link
                key={u.userId}
                href={`/users/${u.userId}`}
                className="flex items-center gap-3 py-2.5 -mx-2 px-2 rounded-lg hover:bg-brand-50/50 transition"
              >
                <Avatar src={u.personalInfo?.photoUrl} name={u.personalInfo?.fullName} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-plum truncate">
                      {u.personalInfo?.fullName || "Unnamed"}
                    </span>
                    {u.premium && <Crown size={13} className="text-amber-400 shrink-0" />}
                  </div>
                  <div className="text-xs text-muted truncate">
                    {u.educationInfo?.occupation || "—"} · {u.personalInfo?.city || "—"}
                  </div>
                </div>
                {u.verified ? (
                  <Badge tone="sky">Verified</Badge>
                ) : (
                  <Badge tone="amber">Pending</Badge>
                )}
                <span className="text-[11px] text-muted hidden sm:block w-16 text-right">
                  {timeAgo(u.createdAt)}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Side: reports + cities */}
        <div className="space-y-6">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-plum flex items-center gap-2">
                <Flag size={16} className="text-red-500" /> Open Reports
              </h3>
              <Link href="/reports" className="text-xs font-bold text-brand-600 hover:underline">
                View
              </Link>
            </div>
            {recentReports.length === 0 ? (
              <p className="text-sm text-muted py-4 text-center">No open reports 🎉</p>
            ) : (
              <div className="space-y-2.5">
                {recentReports.map((r) => (
                  <div key={r.reportId} className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                      <Flag size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-plum truncate">
                        {nameOf(userMap, r.reportedUserId)}
                      </div>
                      <div className="text-[11px] text-muted truncate">{r.reason}</div>
                    </div>
                    <span className="text-[11px] text-muted shrink-0">{timeAgo(r.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card p-5">
            <h3 className="font-extrabold text-plum flex items-center gap-2 mb-3">
              <MapPin size={16} className="text-brand-500" /> Top Cities
            </h3>
            {cities.length === 0 ? (
              <p className="text-sm text-muted py-2 text-center">No data</p>
            ) : (
              <div className="space-y-2.5">
                {cities.map((c, i) => {
                  const pct = Math.round((c.count / (cities[0].count || 1)) * 100);
                  return (
                    <div key={c.city}>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-plum">{c.city}</span>
                        <span className="text-muted">{c.count}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-brand-50 overflow-hidden">
                        <div
                          className="h-full grad-heart rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-32 w-full" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-36 w-full" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-80 lg:col-span-2" />
        <Skeleton className="h-80" />
      </div>
    </div>
  );
}
