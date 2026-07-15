"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { login } from "@/redux/slices/authSlice";
import { signInAdmin } from "@/lib/auth";
import { BRAND, BRAND_TAGLINE } from "@/lib/constants";
import Button from "@/components/ui/Button";
import { Heart, Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter your credentials.");
      return;
    }
    setBusy(true);
    try {
      const user = await signInAdmin(email, password);
      dispatch(login(user));
      router.replace("/");
    } catch (err) {
      setError(err?.message || "Sign in failed. Check your credentials.");
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[var(--bg)]">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-2xl grad-heart flex items-center justify-center text-white shadow-md">
              <Heart size={24} fill="white" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-plum leading-tight">{BRAND}</div>
              <div className="text-[11px] font-bold text-muted tracking-wider uppercase">
                {BRAND_TAGLINE}
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-extrabold text-plum">Welcome back</h1>
          <p className="text-sm text-muted mt-1 mb-7">
            Sign in to the admin console to manage your community.
          </p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-bold text-ink-soft mb-1.5">
                Admin email
              </label>
              <div className="flex items-center gap-2.5 bg-white border border-[var(--border)] rounded-xl h-11 px-3.5 focus-within:ring-2 focus-within:ring-brand-200">
                <Mail size={17} className="text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="flex-1 bg-transparent outline-none text-sm font-medium text-plum"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-ink-soft mb-1.5">Password</label>
              <div className="flex items-center gap-2.5 bg-white border border-[var(--border)] rounded-xl h-11 px-3.5 focus-within:ring-2 focus-within:ring-brand-200">
                <Lock size={17} className="text-muted" />
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent outline-none text-sm font-medium text-plum"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="text-muted hover:text-plum cursor-pointer"
                >
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={busy}>
              {busy ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
              {busy ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 rounded-xl bg-brand-50 border border-brand-100 px-4 py-3 text-xs text-brand-700 leading-relaxed flex items-center gap-2">
            <Lock size={14} className="shrink-0" />
            <span>Authorized administrators only. This console is restricted.</span>
          </div>
        </div>
      </div>

      {/* Right — brand panel */}
      <div className="hidden lg:flex flex-1 grad-hero relative overflow-hidden items-center justify-center p-12">
        <div className="absolute -top-20 -right-16 h-72 w-72 rounded-full bg-white/10" />
        <div className="absolute -bottom-24 -left-10 h-80 w-80 rounded-full bg-white/10" />
        <div className="relative text-white max-w-md">
          <Heart size={40} fill="white" className="mb-6 opacity-90" />
          <h2 className="text-4xl font-extrabold leading-tight">
            Where meaningful matches begin.
          </h2>
          <p className="mt-4 text-white/85 leading-relaxed">
            Oversee members, approve profiles, moderate reports and keep every
            conversation safe — all from one beautiful console.
          </p>
          <div className="mt-10 flex gap-8">
            {[
              ["Members", "Managed"],
              ["Matches", "Tracked"],
              ["Safety", "Moderated"],
            ].map(([a, b]) => (
              <div key={a}>
                <div className="text-lg font-extrabold">{a}</div>
                <div className="text-xs text-white/70 uppercase tracking-wider font-semibold">
                  {b}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
