"use client";
import { useEffect, useState } from "react";
import { UserPlus, ClipboardCheck, ShieldCheck, Sparkles, Check, Ban } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Animated lifecycle stepper for a single member.
 * Signed up → Profile completed → Verified → Live in Discover.
 */
export default function StageProgress({ user }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const suspended = !!user.suspended;
  const steps = [
    { key: "signup", label: "Signed up", icon: UserPlus, done: true },
    { key: "completed", label: "Profile completed", icon: ClipboardCheck, done: !!user.profileCompleted },
    { key: "verified", label: "Verified", icon: ShieldCheck, done: !!user.verified },
    { key: "live", label: "Live in Discover", icon: Sparkles, done: !!user.verified && !suspended },
  ];

  const doneCount = steps.filter((s) => s.done).length;
  const currentIndex = Math.min(doneCount, steps.length) - 1;
  const fillPct = suspended ? 100 : (Math.max(doneCount - 1, 0) / (steps.length - 1)) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-extrabold text-plum flex items-center accent-bar">Lifecycle</h3>
        {suspended ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 text-red-600 border border-red-100 px-2.5 py-0.5 text-xs font-bold">
            <Ban size={12} /> Suspended
          </span>
        ) : user.premium ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-500 border border-amber-100 px-2.5 py-0.5 text-xs font-bold">
            <Sparkles size={12} /> Premium member
          </span>
        ) : null}
      </div>

      <div className="relative px-1">
        {/* Track */}
        <div className="absolute left-6 right-6 top-6 h-1 rounded-full bg-[var(--bg)]" />
        {/* Animated fill */}
        <div
          className={cn("absolute left-6 top-6 h-1 rounded-full transition-all duration-1000 ease-out", suspended ? "bg-gradient-to-r from-red-400 to-red-500" : "grad-heart")}
          style={{ width: mounted ? `calc((100% - 3rem) * ${fillPct / 100})` : 0 }}
        />

        <div className="relative flex justify-between">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isCurrent = i === currentIndex && !suspended;
            return (
              <div key={s.key} className="flex flex-col items-center gap-2 w-24 text-center">
                <div
                  className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center border-2 bg-white transition-all animate-pop",
                    s.done && !suspended
                      ? "grad-heart text-white border-transparent"
                      : suspended && s.done
                      ? "bg-red-400 text-white border-transparent"
                      : "text-muted border-[var(--border)]",
                    isCurrent && "pulse-ring"
                  )}
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  {s.done ? <Check size={20} strokeWidth={3} /> : <Icon size={18} />}
                </div>
                <span className={cn("text-[11px] font-bold leading-tight", s.done ? "text-plum" : "text-muted")}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
