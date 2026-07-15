"use client";
import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Crown,
  BadgeCheck,
  Ban,
  ShieldCheck,
  Trash2,
  Bell,
  Pencil,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Cake,
  Ruler,
  Heart,
  Briefcase,
  GraduationCap,
  Users2,
  Wine,
  Cigarette,
  Salad,
  Languages,
} from "lucide-react";
import { useUsers, useMatchRequests, usePhotoRequests, useReports } from "@/hooks/useCollection";
import * as data from "@/lib/data/service";
import { useFeedback } from "@/components/ui/Feedback";
import { formatDate, timeAgo } from "@/lib/format";
import { buildUserMap, buildUserTimeline } from "@/lib/selectors";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import NotifyModal from "@/components/NotifyModal";
import StageProgress from "@/components/StageProgress";
import ActivityTimeline from "@/components/ActivityTimeline";
import { Activity } from "lucide-react";

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: users, loading } = useUsers();
  const { data: matchReqs } = useMatchRequests();
  const { data: photoReqs } = usePhotoRequests();
  const { data: reports } = useReports();
  const { toast, ask } = useFeedback();
  const [editOpen, setEditOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);

  const u = useMemo(() => users.find((x) => x.userId === id), [users, id]);
  const userMap = useMemo(() => buildUserMap(users), [users]);
  const timeline = useMemo(
    () => (u ? buildUserTimeline(u.userId, u, { matchReqs, photoReqs, reports }, userMap) : []),
    [u, matchReqs, photoReqs, reports, userMap]
  );

  if (loading) return <div className="space-y-4"><Skeleton className="h-48 w-full" /><Skeleton className="h-64 w-full" /></div>;
  if (!u)
    return (
      <div>
        <BackLink />
        <div className="card mt-4">
          <EmptyState title="Member not found" subtitle="This account may have been deleted." />
        </div>
      </div>
    );

  const p = u.personalInfo || {};
  const edu = u.educationInfo || {};
  const fam = u.familyInfo || {};
  const life = u.lifestyleInfo || {};
  const pref = u.partnerPreferences || {};

  const doSuspend = async () => {
    const suspend = !u.suspended;
    const ok = await ask({
      title: suspend ? "Suspend member?" : "Reinstate member?",
      confirmText: suspend ? "Suspend" : "Reinstate",
      danger: suspend,
      body: suspend ? `${p.fullName} will be hidden from Discover.` : `${p.fullName} will be visible again.`,
    });
    if (!ok) return;
    await (suspend ? data.suspendUser(u.userId) : data.unsuspendUser(u.userId));
    toast(`${p.fullName} ${suspend ? "suspended" : "reinstated"}.`);
  };
  const doDelete = async () => {
    const ok = await ask({
      title: "Delete member?",
      body: `Permanently delete ${p.fullName}. This cannot be undone.`,
      confirmText: "Delete",
      danger: true,
    });
    if (!ok) return;
    await data.adminDeleteUser(u.userId);
    toast(`${p.fullName} deleted.`);
    router.push("/users");
  };

  return (
    <div>
      <BackLink />

      {/* Header card */}
      <div className="card overflow-hidden mt-4">
        <div className="grad-hero h-28 relative">
          <div className="absolute inset-0 bg-black/5" />
        </div>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <Avatar src={p.photoUrl} name={p.fullName} size={104} className="ring-4 ring-white shadow-lg" />
            <div className="flex-1 min-w-0 sm:pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-extrabold text-plum">{p.fullName || "Unnamed"}</h1>
                {u.verified && <BadgeCheck size={20} className="text-sky-500" />}
                {u.premium && <Badge tone="gold"><Crown size={12} /> Premium</Badge>}
              </div>
              <p className="text-sm text-muted mt-0.5">
                {p.age ? `${p.age} yrs` : "—"} · {p.gender || "—"} · {p.city || "—"}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap sm:pb-1">
              {u.suspended ? (
                <Badge tone="red" dot>Suspended</Badge>
              ) : u.online ? (
                <Badge tone="green" dot>Online</Badge>
              ) : (
                <Badge tone="gray" dot>Offline · {timeAgo(u.lastActive)}</Badge>
              )}
            </div>
          </div>

          {/* Action bar */}
          <div className="flex flex-wrap gap-2 mt-5">
            <Button size="sm" onClick={() => setEditOpen(true)}><Pencil size={15} /> Edit profile</Button>
            <Button size="sm" variant="secondary" onClick={() => setNotifyOpen(true)}><Bell size={15} /> Notify</Button>
            {!u.verified && (
              <Button size="sm" variant="secondary" onClick={async () => { await data.verifyUser(u.userId); toast("Member verified."); }}>
                <ShieldCheck size={15} /> Verify
              </Button>
            )}
            <Button size="sm" variant="secondary" onClick={async () => { await data.setPremium(u.userId, !u.premium); toast(u.premium ? "Premium removed." : "Premium granted."); }}>
              <Crown size={15} /> {u.premium ? "Remove premium" : "Grant premium"}
            </Button>
            <Button size="sm" variant={u.suspended ? "secondary" : "danger"} onClick={doSuspend}>
              <Ban size={15} /> {u.suspended ? "Reinstate" : "Suspend"}
            </Button>
            <Button size="sm" variant="danger" onClick={doDelete}><Trash2 size={15} /> Delete</Button>
          </div>
        </div>
      </div>

      {/* Lifecycle stepper */}
      <div className="card p-5 mt-6 overflow-x-auto">
        <StageProgress user={u} />
      </div>

      {/* Bio */}
      {p.bio && (
        <div className="card p-5 mt-6">
          <SectionTitle>About</SectionTitle>
          <p className="text-sm text-ink-soft leading-relaxed">{p.bio}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Contact & personal */}
        <div className="card p-5">
          <SectionTitle icon={Mail}>Contact & Personal</SectionTitle>
          <dl className="space-y-1">
            <Fact icon={Mail} label="Email" value={u.email} />
            <Fact icon={Phone} label="Phone" value={u.phone} />
            <Fact icon={Cake} label="Date of birth" value={p.dob ? `${p.dob} (${p.age} yrs)` : "—"} />
            <Fact icon={MapPin} label="Location" value={[p.city, p.country].filter(Boolean).join(", ")} />
            <Fact icon={Ruler} label="Height / Weight" value={[p.height, p.weight].filter(Boolean).join(" · ")} />
            <Fact icon={Heart} label="Marital status" value={p.maritalStatus} />
          </dl>
        </div>

        {/* Education & career */}
        <div className="card p-5">
          <SectionTitle icon={Briefcase}>Education & Career</SectionTitle>
          <dl className="space-y-1">
            <Fact icon={GraduationCap} label="Education" value={edu.education} />
            <Fact icon={Briefcase} label="Occupation" value={edu.occupation} />
            <Fact icon={Briefcase} label="Company" value={edu.company} />
            <Fact icon={MapPin} label="Work location" value={edu.workLocation} />
            <Fact icon={Crown} label="Annual income" value={edu.annualIncome} />
          </dl>
        </div>

        {/* Family */}
        <div className="card p-5">
          <SectionTitle icon={Users2}>Family</SectionTitle>
          <dl className="space-y-1">
            <Fact icon={Users2} label="Father" value={fam.fatherName} />
            <Fact icon={Users2} label="Mother" value={fam.motherName} />
            <Fact icon={Users2} label="Family type" value={fam.familyType} />
            <Fact icon={Users2} label="Siblings" value={fam.siblings != null ? String(fam.siblings) : "—"} />
            <Fact icon={Heart} label="Religion / Caste" value={[fam.religion, fam.caste].filter(Boolean).join(" · ")} />
          </dl>
        </div>

        {/* Lifestyle */}
        <div className="card p-5">
          <SectionTitle icon={Salad}>Lifestyle</SectionTitle>
          <dl className="space-y-1">
            <Fact icon={Cigarette} label="Smoking" value={life.smoking} />
            <Fact icon={Wine} label="Drinking" value={life.drinking} />
            <Fact icon={Salad} label="Diet" value={life.diet} />
            <Fact icon={Heart} label="Hobbies" value={(life.hobbies || []).join(", ")} />
            <Fact icon={Languages} label="Languages" value={(life.languages || []).join(", ")} />
          </dl>
        </div>
      </div>

      {/* Partner preferences */}
      <div className="card p-5 mt-6">
        <SectionTitle icon={Heart}>Partner Preferences</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Pref label="Age range" value={pref.ageRange ? `${pref.ageRange[0]}–${pref.ageRange[1]}` : "—"} />
          <Pref label="Location" value={pref.preferredLocation} />
          <Pref label="Education" value={pref.education} />
          <Pref label="Religion" value={pref.religion} />
          <Pref label="Marital status" value={pref.maritalStatus} />
        </div>
      </div>

      {/* Activity timeline */}
      <div className="card p-5 mt-6">
        <div className="flex items-center justify-between mb-5">
          <SectionTitle icon={Activity}>Activity Timeline</SectionTitle>
          <Badge tone="rose">{timeline.length} events</Badge>
        </div>
        <ActivityTimeline events={timeline} />
      </div>

      {/* Photos */}
      {(u.photos || []).length > 0 && (
        <div className="card p-5 mt-6">
          <SectionTitle>Photo Gallery</SectionTitle>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {u.photos.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt="" className="aspect-square w-full rounded-xl object-cover border border-[var(--border)]" />
            ))}
          </div>
        </div>
      )}

      <div className="text-xs text-muted mt-6 text-center">
        Member ID: <span className="font-mono">{u.userId}</span> · Joined {formatDate(u.createdAt)}
      </div>

      <EditModal open={editOpen} onClose={() => setEditOpen(false)} user={u} onSaved={() => toast("Profile updated.")} />
      <NotifyModal open={notifyOpen} onClose={() => setNotifyOpen(false)} target={u} />
    </div>
  );
}

function BackLink() {
  return (
    <Link href="/users" className="inline-flex items-center gap-1.5 text-sm font-bold text-plum-soft hover:text-brand-600">
      <ArrowLeft size={16} /> Back to members
    </Link>
  );
}

function SectionTitle({ icon: Icon, children }) {
  return (
    <h3 className="flex items-center gap-2 font-extrabold text-plum mb-4">
      {Icon && <Icon size={17} className="text-brand-500" />}
      {children}
    </h3>
  );
}

function Fact({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-[var(--border)] last:border-0">
      {Icon && <Icon size={15} className="text-muted shrink-0" />}
      <span className="text-xs font-semibold text-muted w-32 shrink-0">{label}</span>
      <span className="text-sm font-medium text-plum truncate">{value || "—"}</span>
    </div>
  );
}

function Pref({ label, value }) {
  return (
    <div className="rounded-xl bg-brand-50/60 border border-brand-100 p-3">
      <div className="text-[11px] font-bold text-muted uppercase tracking-wide">{label}</div>
      <div className="text-sm font-bold text-plum mt-1 truncate">{value || "—"}</div>
    </div>
  );
}

/* ---- Edit modal ---- */
function EditModal({ open, onClose, user, onSaved }) {
  const p = user.personalInfo || {};
  const edu = user.educationInfo || {};
  const [form, setForm] = useState({});
  const [busy, setBusy] = useState(false);

  // Seed form each time it opens.
  const seed = () => ({
    fullName: p.fullName || "",
    email: user.email || "",
    phone: user.phone || "",
    age: p.age || "",
    city: p.city || "",
    gender: p.gender || "Female",
    maritalStatus: p.maritalStatus || "Single",
    bio: p.bio || "",
    occupation: edu.occupation || "",
    company: edu.company || "",
    education: edu.education || "",
    annualIncome: edu.annualIncome || "",
  });
  const f = { ...seed(), ...form };
  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const save = async () => {
    setBusy(true);
    try {
      await data.adminUpdateUser(user.userId, {
        email: f.email,
        phone: f.phone,
        personalInfo: {
          ...p,
          fullName: f.fullName,
          age: parseInt(f.age, 10) || 0,
          city: f.city,
          gender: f.gender,
          maritalStatus: f.maritalStatus,
          bio: f.bio,
        },
        educationInfo: {
          ...edu,
          occupation: f.occupation,
          company: f.company,
          education: f.education,
          annualIncome: f.annualIncome,
        },
      });
      onSaved?.();
      setForm({});
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit profile"
      subtitle={p.fullName}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={busy}>
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Pencil size={15} />}
            {busy ? "Saving…" : "Save changes"}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <EF label="Full name" className="col-span-2"><input value={f.fullName} onChange={(e) => set("fullName", e.target.value)} className="field-input" /></EF>
        <EF label="Email"><input value={f.email} onChange={(e) => set("email", e.target.value)} className="field-input" /></EF>
        <EF label="Phone"><input value={f.phone} onChange={(e) => set("phone", e.target.value)} className="field-input" /></EF>
        <EF label="Age"><input value={f.age} onChange={(e) => set("age", e.target.value.replace(/\D/g, ""))} className="field-input" /></EF>
        <EF label="City"><input value={f.city} onChange={(e) => set("city", e.target.value)} className="field-input" /></EF>
        <EF label="Gender">
          <select value={f.gender} onChange={(e) => set("gender", e.target.value)} className="field-input"><option>Female</option><option>Male</option></select>
        </EF>
        <EF label="Marital status">
          <select value={f.maritalStatus} onChange={(e) => set("maritalStatus", e.target.value)} className="field-input">
            <option>Single</option><option>Divorced</option><option>Widowed</option><option>Separated</option>
          </select>
        </EF>
        <EF label="Occupation"><input value={f.occupation} onChange={(e) => set("occupation", e.target.value)} className="field-input" /></EF>
        <EF label="Company"><input value={f.company} onChange={(e) => set("company", e.target.value)} className="field-input" /></EF>
        <EF label="Education"><input value={f.education} onChange={(e) => set("education", e.target.value)} className="field-input" /></EF>
        <EF label="Annual income"><input value={f.annualIncome} onChange={(e) => set("annualIncome", e.target.value)} className="field-input" /></EF>
        <EF label="Bio" className="col-span-2"><textarea rows={3} value={f.bio} onChange={(e) => set("bio", e.target.value)} className="field-input" /></EF>
      </div>
    </Modal>
  );
}

function EF({ label, children, className = "" }) {
  return (
    <div className={className}>
      <label className="block text-[13px] font-bold text-ink-soft mb-1.5">{label}</label>
      {children}
    </div>
  );
}
