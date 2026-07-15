"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  UserPlus,
  Crown,
  BadgeCheck,
  MoreHorizontal,
  Trash2,
  Ban,
  ShieldCheck,
  Bell,
  Eye,
  Loader2,
  Users as UsersIcon,
  CircleUser,
} from "lucide-react";
import { useUsers } from "@/hooks/useCollection";
import * as data from "@/lib/data/service";
import { useFeedback } from "@/components/ui/Feedback";
import { timeAgo } from "@/lib/format";
import PageHeader from "@/components/ui/PageHeader";
import SearchInput from "@/components/ui/SearchInput";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import Modal from "@/components/ui/Modal";
import RowMenu from "@/components/ui/RowMenu";
import NotifyModal from "@/components/NotifyModal";

const STATUS_TABS = ["All", "Verified", "Pending", "Suspended", "Premium"];

export default function UsersPage() {
  const { data: users, loading } = useUsers();
  const { toast, ask } = useFeedback();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [gender, setGender] = useState("All");
  const [selected, setSelected] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [notifyTarget, setNotifyTarget] = useState(null);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return users
      .filter((u) => {
        if (status === "Verified" && !u.verified) return false;
        if (status === "Pending" && u.verified) return false;
        if (status === "Suspended" && !u.suspended) return false;
        if (status === "Premium" && !u.premium) return false;
        if (gender !== "All" && u.personalInfo?.gender !== gender) return false;
        if (!term) return true;
        return `${u.personalInfo?.fullName} ${u.personalInfo?.city} ${u.email} ${u.educationInfo?.occupation}`
          .toLowerCase()
          .includes(term);
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [users, q, status, gender]);

  const allSelected = filtered.length > 0 && filtered.every((u) => selected.includes(u.userId));
  const toggleAll = () =>
    setSelected(allSelected ? [] : filtered.map((u) => u.userId));
  const toggleOne = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const doSuspend = async (u) => {
    const suspend = !u.suspended;
    const ok = await ask({
      title: suspend ? "Suspend member?" : "Reinstate member?",
      body: suspend
        ? `${u.personalInfo?.fullName} will be hidden from Discover until reinstated.`
        : `${u.personalInfo?.fullName} will become visible again.`,
      confirmText: suspend ? "Suspend" : "Reinstate",
      danger: suspend,
    });
    if (!ok) return;
    await (suspend ? data.suspendUser(u.userId) : data.unsuspendUser(u.userId));
    toast(`${u.personalInfo?.fullName} ${suspend ? "suspended" : "reinstated"}.`);
  };

  const doVerify = async (u) => {
    await data.verifyUser(u.userId);
    toast(`${u.personalInfo?.fullName} is now verified.`);
  };

  const doPremium = async (u) => {
    await data.setPremium(u.userId, !u.premium);
    toast(`Premium ${u.premium ? "removed from" : "granted to"} ${u.personalInfo?.fullName}.`);
  };

  const doDelete = async (u) => {
    const ok = await ask({
      title: "Delete member?",
      body: `Permanently delete ${u.personalInfo?.fullName} and their data. This cannot be undone.`,
      confirmText: "Delete",
      danger: true,
    });
    if (!ok) return;
    await data.adminDeleteUser(u.userId);
    toast(`${u.personalInfo?.fullName} deleted.`);
  };

  const bulkDelete = async () => {
    const ok = await ask({
      title: `Delete ${selected.length} member${selected.length > 1 ? "s" : ""}?`,
      body: "This permanently removes the selected members and their data.",
      confirmText: "Delete",
      danger: true,
    });
    if (!ok) return;
    await data.bulkDeleteUsers(selected);
    toast(`${selected.length} member(s) deleted.`);
    setSelected([]);
  };

  return (
    <div>
      <PageHeader title="Members" subtitle="Manage every member account in your community.">
        <Button onClick={() => setCreateOpen(true)}>
          <UserPlus size={17} /> Add Member
        </Button>
      </PageHeader>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
        <SearchInput value={q} onChange={setQ} placeholder="Search by name, city, email…" className="lg:w-80" />
        <div className="flex items-center gap-1 bg-white border border-[var(--border)] rounded-xl p-1 overflow-x-auto">
          {STATUS_TABS.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 h-8 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                status === s ? "grad-heart text-white" : "text-plum-soft hover:bg-brand-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-white border border-[var(--border)] rounded-xl p-1">
          {["All", "Female", "Male"].map((g) => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={`px-3 h-8 rounded-lg text-xs font-bold transition cursor-pointer ${
                gender === g ? "bg-plum text-white" : "text-plum-soft hover:bg-black/5"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
        <span className="text-sm font-semibold text-muted lg:ml-auto">
          {filtered.length} member{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Bulk bar */}
      {selected.length > 0 && (
        <div className="flex items-center justify-between bg-plum text-white rounded-xl px-4 py-2.5 mb-3 animate-fade-up">
          <span className="text-sm font-semibold">{selected.length} selected</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setSelected([])} className="text-sm font-semibold text-white/80 hover:text-white cursor-pointer px-2">
              Clear
            </button>
            <Button variant="danger" size="sm" onClick={bulkDelete}>
              <Trash2 size={15} /> Delete selected
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={UsersIcon} title="No members found" subtitle="Try adjusting your search or filters." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left text-xs font-bold text-muted uppercase tracking-wide">
                  <th className="py-3 pl-4 pr-2 w-10">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      className="h-4 w-4 rounded border-gray-300 accent-brand-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-2">Member</th>
                  <th className="py-3 px-2 hidden md:table-cell">Location</th>
                  <th className="py-3 px-2 hidden lg:table-cell">Occupation</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 hidden sm:table-cell">Joined</th>
                  <th className="py-3 px-2 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.userId} className="border-b border-[var(--border)] last:border-0 hover:bg-brand-50/40 transition group">
                    <td className="py-3 pl-4 pr-2">
                      <input
                        type="checkbox"
                        checked={selected.includes(u.userId)}
                        onChange={() => toggleOne(u.userId)}
                        className="h-4 w-4 rounded border-gray-300 accent-brand-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <Link href={`/users/${u.userId}`} className="flex items-center gap-3 min-w-0">
                        <Avatar src={u.personalInfo?.photoUrl} name={u.personalInfo?.fullName} size={40} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-plum truncate">
                              {u.personalInfo?.fullName || "Unnamed"}
                            </span>
                            {u.verified && <BadgeCheck size={14} className="text-sky-500 shrink-0" />}
                            {u.premium && <Crown size={13} className="text-amber-400 shrink-0" />}
                          </div>
                          <div className="text-xs text-muted truncate">{u.email || "no email"}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="py-3 px-2 hidden md:table-cell text-ink-soft">
                      {u.personalInfo?.city || "—"}
                    </td>
                    <td className="py-3 px-2 hidden lg:table-cell text-ink-soft">
                      {u.educationInfo?.occupation || "—"}
                    </td>
                    <td className="py-3 px-2">
                      {u.suspended ? (
                        <Badge tone="red" dot>Suspended</Badge>
                      ) : u.online ? (
                        <Badge tone="green" dot>Online</Badge>
                      ) : (
                        <Badge tone="gray" dot>Offline</Badge>
                      )}
                    </td>
                    <td className="py-3 px-2 hidden sm:table-cell text-muted text-xs">
                      {timeAgo(u.createdAt)}
                    </td>
                    <td className="py-3 px-2">
                      <RowMenu
                        items={[
                          { label: "View profile", icon: Eye, href: `/users/${u.userId}` },
                          { label: "Send notification", icon: Bell, onClick: () => setNotifyTarget(u) },
                          !u.verified && { label: "Verify member", icon: ShieldCheck, onClick: () => doVerify(u) },
                          { label: u.premium ? "Remove premium" : "Grant premium", icon: Crown, onClick: () => doPremium(u) },
                          { label: u.suspended ? "Reinstate" : "Suspend", icon: Ban, onClick: () => doSuspend(u), danger: !u.suspended },
                          { label: "Delete", icon: Trash2, onClick: () => doDelete(u), danger: true },
                        ].filter(Boolean)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateUserModal open={createOpen} onClose={() => setCreateOpen(false)} onCreated={(n) => toast(`${n} added.`)} />
      <NotifyModal
        open={!!notifyTarget}
        onClose={() => setNotifyTarget(null)}
        target={notifyTarget}
      />
    </div>
  );
}

/* ---- Create user modal ---- */
function CreateUserModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({ fullName: "", email: "", gender: "Female", city: "", age: "", occupation: "" });
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const create = async () => {
    if (!form.fullName.trim()) return;
    setBusy(true);
    try {
      await data.adminCreateUser({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        gender: form.gender,
        city: form.city.trim(),
        age: parseInt(form.age, 10) || 0,
        occupation: form.occupation.trim(),
      });
      onCreated?.(form.fullName.trim());
      setForm({ fullName: "", email: "", gender: "Female", city: "", age: "", occupation: "" });
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add new member"
      subtitle="Creates a verified profile visible in Discover."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={create} disabled={busy || !form.fullName.trim()}>
            {busy ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
            {busy ? "Creating…" : "Create member"}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <Field label="Full name" className="col-span-2" icon={CircleUser}>
          <input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="e.g. Ayesha Khan" className="field-input" />
        </Field>
        <Field label="Email" className="col-span-2">
          <input value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="user@example.com" className="field-input" />
        </Field>
        <Field label="Gender">
          <select value={form.gender} onChange={(e) => set("gender", e.target.value)} className="field-input">
            <option>Female</option>
            <option>Male</option>
          </select>
        </Field>
        <Field label="Age">
          <input value={form.age} onChange={(e) => set("age", e.target.value.replace(/\D/g, ""))} placeholder="27" className="field-input" />
        </Field>
        <Field label="City">
          <input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="City" className="field-input" />
        </Field>
        <Field label="Occupation">
          <input value={form.occupation} onChange={(e) => set("occupation", e.target.value)} placeholder="Designer" className="field-input" />
        </Field>
      </div>
    </Modal>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <div className={className}>
      <label className="block text-[13px] font-bold text-ink-soft mb-1.5">{label}</label>
      {children}
    </div>
  );
}
